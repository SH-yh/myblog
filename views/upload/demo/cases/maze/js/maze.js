var Map = {
	tile_size : 16,//每个数字所代表的最小区域
	//为地图数据中的每一个数字所代表的事物进行属性定义
	//solid : 表明当前的区域是否是固体，是否可以停留
	keys : [
		{id : 0, color: "#333", solid : 0 }, //id 地图数据中的数字
		{id : 1, color: "#888", solid : 0},
		{id : 2, color: "#555", solid : 1,  bounce : 0.35},
		{id : 3, color: "rgba(121, 220, 242, 0.4)", g : {x : 0.9 ,y :0.9}, gravity : {x : 0, y: 0.1}, jump: 1, },
		{id : 4, color: "#777",  jump: 1}, 
		{id : 5, color: "#E373FA", solid : 1, bounce :1.1},
		{id : 6, color: "#666", solid : 1, bounce : 0},
		{id : 7, color: "#73C6FA", solid : 0, script: 'change_color'},
		{id : 8, color: "#FADF73", solid : 0, script:'win'},
		{id : 9, color: "#C93232", solid : 0, script: 'died'},
		{id : 10, color: "#555", solid : 1},
		{id : 11, color: "#0FF", solid : 0, script : 'unlock'}
	],
	data : map, //拿到地图数据
	//小球的位置
	player : {
		x : 2,
		y : 2,
		color : "#FF9900"
	},
	//模拟重力加速度 主要是作为y坐标改变依据
	gravity : {
		x : 0,
		y : 0.3
	},
	//对速度的限制，最大速度
	vel_limit : {
		x : 2,
		y : 16
	},
	movement_speed : {
		jump : 6,
		left : 0.3,
		right : 0.3
	},
	scripts : {
		change_color : 'clarity.player.color = "hsl("+Math.floor(Math.random()*360)+", 60%, 50%)"',
		win : 'alert("you are win!");clarity.load_map(Map);',
		died : 'alert("you are die!");clarity.load_map(Map);',
		unlock : 'clarity.current_map.keys[10].solid = 0;clarity.current_map.keys[10].color = "#888"'
	}

}
var Clarity = function(){
	this.switch_jump = 0;
	this.viewport_limit = false;//是否开启视口限制
	this.key = {
		left : false,
		right : false,
		up : false
	}
	this.player= {
		loc : {
			x : 0,
			y : 0
		},
		//小球的加速度 两个 1 水平方向上的加速度， 2 竖直方向上的加速度
		vel : {
			x : 0,
			y : 0
		},
		can_jump : true
	};
	this.viewport = {
		x : 200,
		y : 200
	};
	this.camera = {
		x : 0,
		y : 0
	};
	window.onkeydown = this.keydown.bind(this);
	window.onkeyup = this.keyup.bind(this);
}
Clarity.prototype.keydown = function(e){
	var e  = e || window.event;
	var code = e.charCode || e.which || e.keyCode;
	switch(code){
		case 37 :
			this.key.left = true;
			break;
		case 39 :
			this.key.right = true;
			break;
		case 38 :
			this.key.up = true;
			break;
	}
}
Clarity.prototype.keyup = function(){
	var e  = e || window.event;
	var code = e.charCode || e.which || e.keyCode;
	switch(code){
		case 37 :
			this.key.left = false;
			break;
		case 39 :
			this.key.right = false;
			break;
		case 38 :
			this.key.up = false;
			break;
	}
}
Clarity.prototype.error = function(message){
	alert(message);
}
Clarity.prototype.log = function(message){
	console.log(message);
}
Clarity.prototype.set_viewport = function(item){
	this.viewport.x = item.x;
	this.viewport.y = item.y;
}

Clarity.prototype.load_map = function(map){
	if(typeof map == 'undefined' || 
		typeof map.data == 'undefined' ||
		typeof map.keys == 'undefined'){
		this.error("地图数据有问题， 请检查！");
		return;
	}
	this.current_map = map;
	this.current_map.background = map.background || "#333";
	this.current_map.gravity = map.gravity;
	this.tile_size = map.tile_size;
	var self = this;
	//补充
	self.current_map.height = 0;
	self.current_map.width = 0;

	map.keys.forEach(function(key){
		map.data.forEach(function(row, y){
			self.current_map.height = Math.max(self.current_map.height, y);
			row.forEach(function(tile, x){
				self.current_map.width  = Math.max(self.current_map.height, x);
				if(tile == key.id){
					self.current_map.data[y][x] = key;
				}
			});
		})
	});
	//计算整个游戏的大小
	this.current_map.width_p = self.current_map.width * this.tile_size;
	this.current_map.height_p = self.current_map.height * this.tile_size;

	//定义游戏主角的位置
	this.player.loc.x = map.player.x * this.tile_size || 0;
	this.player.loc.y = map.player.y * this.tile_size || 0;
	this.player.color = map.player.color || "#000";
	this.player.vel = {
		x : 0,
		y : 0
	};
	this.camera = {
		x : 0,
		y : 0
	};
	this.key = {
		left : false,
		right : false,
		up : false
	};
	this.log("地图成功加载");
	return true;
}
Clarity.prototype.move_player = function(){
	var tX = this.player.loc.x + this.player.vel.x;
	var tY = this.player.loc.y + this.player.vel.y;
	var offset = this.tile_size / 2 - 1;
	var tile = this.get_tile(Math.round(this.player.loc.x / this.tile_size),
			Math.round(this.player.loc.y / this.tile_size));
	//到目前，我们的this.play.vel.x，this.play.vel.y都是0，接下来对这两个变量进行改变
	if(tile.gravity){
		this.player.vel.x += tile.gravity.x;//此时仍为0
		this.player.vel.y += tile.gravity.y;
	}else{
		this.player.vel.x += this.current_map.gravity.x;//此时仍为0
		this.player.vel.y += this.current_map.gravity.y;
	}
	if(tile.g){
		this.player.vel.x *= tile.g.x;//此时仍为0
		this.player.vel.y *= tile.g.y;
	}
	
		
	//tX, tY是canvas中的下一个位置的坐标，我们通过公式将其转换成地图数据中坐标
	var t_y_up = Math.floor(tY / this.tile_size);
	var t_y_down = Math.ceil(tY / this.tile_size);

	var y_near1 = Math.round((this.player.loc.y - offset) / this.tile_size);
	var y_near2 = Math.round((this.player.loc.y - offset) / this.tile_size);

	//计算横坐标
	var x_near1 = Math.round((this.player.loc.x - offset) / this.tile_size);
	var x_near2 =  Math.round((this.player.loc.x + offset) / this.tile_size);
	var t_x_left = Math.floor(tX / this.tile_size);
	var t_x_right = Math.ceil(tX / this.tile_size);

	var left1 = this.get_tile(t_x_left, y_near1);
	var left2 = this.get_tile(t_x_left, y_near2);
	var right1 = this.get_tile(t_x_right, y_near1);
	var right2 = this.get_tile(t_x_right, y_near2);

	var top1 = this.get_tile(x_near1, t_y_up);
	var top2 = this.get_tile(x_near2, t_y_up);
	var bottom1 = this.get_tile(x_near1, t_y_down);
	var bottom2 = this.get_tile(x_near2, t_y_down);
	//针对竖直通道的连跳处理
	if(tile.jump && this.switch_jump > 15 ){
		this.player.can_jump = true;
		this.switch_jump = 0;
	}else {
		this.switch_jump++;
	}
	//对速度进行限制，不可以无限累加
	//我们的速度是有正有负
	//Math.max(this.play.vel.x, -this.current_map.vel_limit.x) 
	//当速度为负的时候，进行速度的判断
	this.player.vel.x = Math.min(Math.max(this.player.vel.x, -this.current_map.vel_limit.x), this.current_map.vel_limit.x);
	this.player.vel.y = Math.min(Math.max(this.player.vel.y, -this.current_map.vel_limit.y), this.current_map.vel_limit.y);

	//目前拿到安全速度
	this.player.loc.x += this.player.vel.x;
	this.player.loc.y += this.player.vel.y;
	this.player.vel.x *= 0.9;
	//判断水平方向上是否可以移动
	if(left1.solid || left2.solid || right1.solid || right2.solid){
		while(this.get_tile( Math.floor(this.player.loc.x / this.tile_size), y_near1).solid ||
			  this.get_tile(Math.floor(this.player.loc.x / this.tile_size), y_near2).solid){
				this.player.loc.x += 0.1;
		}
		//当水平方向上碰到墙壁，处理，让玩家停留下来
		while(this.get_tile( Math.ceil(this.player.loc.x / this.tile_size), y_near1).solid ||
			  this.get_tile(Math.ceil(this.player.loc.x / this.tile_size), y_near2).solid){
				this.player.loc.x -= 0.1;
		}
		var bounce = 0;
		if(left1.solid && left1.bounce > bounce){
			bounce = left1.bounce;
		}
		if(left2.solid && left2.bounce > bounce){
			bounce = left2.bounce;
		}
		if(right1.solid && right1.bounce > bounce){
			bounce = left1.bounce;
		}
		if(right2.solid && right2.bounce > bounce){
			bounce = right2.bounce;
		}
		this.player.vel.x *= -bounce || 0;
	}

	//判断是否可以停留
	if(top1.solid || top2.solid || bottom1.solid || bottom2.solid){
		while(this.get_tile(x_near1, Math.floor(this.player.loc.y / this.tile_size)).solid ||
			  this.get_tile(x_near2, Math.floor(this.player.loc.y / this.tile_size)).solid){
			this.player.loc.y += 0.1;
		}
		//处理，让玩家停留在天花板上
		while(this.get_tile(x_near1, Math.ceil(this.player.loc.y / this.tile_size)).solid ||
			  this.get_tile(x_near2, Math.ceil(this.player.loc.y / this.tile_size)).solid){
			this.player.loc.y -= 0.1;
		}
		//弹跳处理
		var bounce = 0;
		if(top1.solid && top1.bounce > bounce){
			bounce = top1.bounce;
		}
		if(top2.solid && top2.bounce > bounce){
			bounce = top2.bounce;
		}
		if(bottom1.solid && bottom1.bounce > bounce){
			bounce = bottom1.bounce;
		}
		if(bottom2.solid && bottom2.bounce > bounce){
			bounce = bottom2.bounce;
		}
		this.player.vel.y *= -bounce || 0;
		if((bottom1.solid || bottom2.solid) && !tile.jump){
			this.player.can_jump = true;
		}
	}
	//视口的移动
	//拿到玩家与参考点的相对坐标
	var c_x = Math.round(this.player.loc.x - this.viewport.x / 2);
	var c_y = Math.round(this.player.loc.y - this.viewport.y / 2);
	//拿到玩家与参考点的相对坐标与适口坐标的相对值
	var x_diff = Math.abs(c_x - this.camera.x);
	var y_diff = Math.abs(c_y - this.camera.y);
	//视口x方向上的改变
	if(x_diff > 5){
		var msg = Math.round(Math.max(1, x_diff*0.1));
		if(c_x != this.camera.x){
			this.camera.x += c_x > this.camera.x ? msg : -msg;
			if(this.viewport_limit){
				//右边界的判断
				this.camera.x = 
					Math.min((this.current_map.width_p - 
						this.viewport.x + this.tile_size),
						this.camera.x);
				//左边界的判断
				this.camera.x = 
					Math.max(0, this.camera.x);
			}
		}
	}
	if(y_diff > 5){
		var msg = Math.round(Math.max(1, y_diff*0.1));
		if(c_y != this.camera.y){
			this.camera.y += c_y > this.camera.y ? msg : -msg;
			if(this.viewport_limit){
				//右边界的判断
				this.camera.y = 
					Math.min((this.current_map.height_p - 
						this.viewport.y + this.tile_size),
						this.camera.y);
				//左边界的判断
				this.camera.y = 
					Math.max(0, this.camera.y);
			}
		}
	}
	if(this.last_id!= tile.id && tile.script){
		eval(this.current_map.scripts[tile.script]);
	}
	this.last_id = tile.id;
}
//根据坐标返回地图数据中的数字
Clarity.prototype.get_tile = function(x, y){
	return (this.current_map.data[y] && this.current_map.data[y][x]) ? this.current_map.data[y][x] : 0
}
Clarity.prototype.draw_tile = function(context,x , y, tile){
	ctx.fillStyle = tile.color;
	ctx.fillRect(x, y, this.tile_size, this.tile_size);
}
//绘制游戏场景内容
Clarity.prototype.draw_map = function(context){
	for(var y = 0; y < this.current_map.data.length; y++){
		for(var x = 0; x < this.current_map.data[y].length; x++){
			var t_x = x * this.tile_size - this.camera.x; //在X方向上平移地图内容
			var t_y = y * this.tile_size - this.camera.y; //在Y方向评议地图内容
			if(t_x > this.viewport.x || 
				t_x < -this.tile_size || t_y > this.viewport.y || t_y < -this.tile_size){
				continue;
			}
			this.draw_tile(context, t_x, t_y, this.current_map.data[y][x]);
		}
	}
}
//绘制游戏玩家
Clarity.prototype.draw_player = function(context){
	var r = this.tile_size / 2 - 1;
	context.fillStyle = this.player.color;
	context.beginPath();
	context.arc(this.player.loc.x + r - this.camera.x, 
		this.player.loc.y + r - this.camera.y, r, 0, 2*Math.PI, false);//圆心横坐标的确定 
	context.fill();

}
//总绘制方法
Clarity.prototype.draw = function(context){
	this.draw_map(context);
	this.draw_player(context);
}
Clarity.prototype.update = function(){
	if(this.key.left){//可以控制玩家向左移动
		if( this.player.vel.x > -this.current_map.vel_limit.x){
			this.player.vel.x -= this.current_map.movement_speed.left;
		}
	}
	if(this.key.right){//可以控制玩家向右移动
		if( this.player.vel.x < this.current_map.vel_limit.x){
			this.player.vel.x += this.current_map.movement_speed.right;
		}
	}
	if(this.key.up){//可以控制玩家跳跃
		if(this.player.can_jump && this.player.vel.y > -this.current_map.vel_limit.y){
			this.player.vel.y -= this.current_map.movement_speed.jump;
			this.player.can_jump = false;
		}
	}
	
	this.move_player();
}
var requestAnimationFrame = window.requestAnimationFrame || 
							window.mozRequestAnimationFrame || 
							window.webkitRequestAnimationFrame ||
							window.oRequestAnimationFrame || 
							window.msRequestAnimationFrame || 
							function (callback) {
								setInterval(callback, 1000 / 60)
							}
var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');
var clarity = new Clarity();
clarity.load_map(Map);
clarity.set_viewport({x : cvs.width, y : cvs.height});
clarity.viewport_limit = true;
function loop(){
	ctx.fillStyle = "#333";
	ctx.fillRect(0, 0, cvs.width, cvs.height);
	clarity.draw(ctx);
	clarity.update();
	requestAnimationFrame(loop);
}
loop();