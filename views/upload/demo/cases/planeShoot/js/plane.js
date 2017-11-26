var canvas = document.getElementById('cvs');
var ctx = canvas.getContext('2d');
var ogs = document.getElementById('gameStart');
var gsStart = document.getElementById('gs-start'),
	godBtn = document.getElementById('god'),
	verygodBtn = document.getElementById('verygod');
	pertygodBtn = document.getElementById('pertygod');
	nogodBtn = document.getElementById('nogod');
var starSum = 50,
	enemyNum = 30,
	dieNum = 0;
	buttleNum = 400;
	cW = canvas.width,
	cH  = canvas.height;
var foodItem = null,//保存道具对象
	planeItem = null;
var sprite = [],
	buttleList = [],
	boomList = [];//保存我们的sprite对象

var points = 0;
Array.prototype.foreach = function(callback){
	var len = this.length;
	for(var i = 0; i < len; i++){
		callback.apply(this[i], [i]);
	}
}
//初始化定时器
window.RAF = window.requestAnimationFrame || 
			 window.webkitRequestAnimationFrame ||
			 window.mozeRquestAnimationFrame ||
			 window.oRquestAnimationFrame || 
			 window.msRquestAnimationFrame ||
			 function(callback){
			 	setTimeout(callback, 1000 / 60)
			 }
//注册键盘事件
//键盘按下打开开关
window.addEventListener('keydown', function(e){
	var e = e || window.event;
	var keyCode = e.keyCode || e.charCode || e.which;
	switch(keyCode){
		//左旋转
		case 90:
			planeItem.rotateLeft = true;
			break;
		//右旋转
		case 67:
			planeItem.rotateRight = true;
			break;
		//上
		case 38 :
			planeItem.toUp = true;
			break;
		//下
		case 40:
			planeItem.toDown = true;
			break;
		//左
		case 37:
			planeItem.toLeft = true;
			break;
		//右
		case 39:
			planeItem.toRight = true
			break;
	}
},false);
//键盘弹起关闭开关
window.addEventListener('keyup', function(e){
	var e = e || window.event;
	var keyCode = e.keyCode || e.charCode || e.which;
	switch(keyCode){
		//左旋转
		case 90:
			planeItem.rotateLeft = false;
			break;
		//右旋转
		case 67:
			planeItem.rotateRight = false;
			break;
		//上
		case 38:
			planeItem.toUp = false;
			break;
		//下
		case 40:
			planeItem.toDown = false;
			break;
		//左
		case 37:
			planeItem.toLeft = false;
			break;
		//右
		case 39:
			planeItem.toRight = false;
			break;
	}
},false);
//创建一个舞台类，负责去呈现我们的画面
var stage = {
	init : function(){
		var self = this;
		this.loading = new Loading(datas, canvas, function(){
			ogs.style.display = "block";
			//为按钮注册点击事件
			godBtn.onclick = function(){
				if(planeItem){
					stage.upgrade(planeItem, 4, 40);
				}
			}
			verygodBtn.onclick = function(){
				if(planeItem){
					stage.upgrade(planeItem, 10, 40);
				}
			}
			pertygodBtn.onclick = function(){
				if(planeItem){
					stage.upgrade(planeItem, 40, 60);
				}
			}
			nogodBtn.onclick = function(){
				if(planeItem){
					stage.upgrade(planeItem, 40, 20);
				}
			}
			//document.getElementById('bgm').play();
			gsStart.onclick = function(){
				ogs.style.display = "none";
				//添加游戏对象
				self.addElement();
			}
		});
	},
	upgrade : function(item,level, speed){
		item.god = true;
		item.fireLevel = level;
		item.fireFrame = speed;
	},
	addElement : function(){
		//绘制流星
		this.createStar();
		//创建敌机
		this.createEnemy();
		//创建炮弹
		this.createButtle();
		//创建道具
		this.createFood();
		//创建玩家飞机
		this.createPlane();
		//创建爆炸图片
		this.createBoom();
	},
	createStar : function(){
		for(var i = 0; i < starSum; i++){
			var star = new Sprite('star', starPainter, starPainter.behaviors);
			star.left = Math.random()*cW;//设置流星的左边距
			star.top = Math.random()*cH;//设置流星的上边距
			sprite.push(star);
		}
	},
	createEnemy : function(){
		for(var i = 0; i < enemyNum; i++){
			var enemyPlane = new Sprite('enemy', enemy, enemy.behaviors);
			var x = Math.round(Math.random()*(cW - enemy.getSize(enemyPlane).width * 2));
			var y = Math.random()*cH - cH;
			enemyPlane.top = y;
			enemyPlane.left = x;
			sprite.push(enemyPlane);
		};
	},
	createButtle : function(){
		for(var i = 0; i < buttleNum; i++){
			var buttleItem = new Sprite('buttle', buttle, buttle.behaviors);
			buttleItem.visible = false;
			buttleList.push(buttleItem);
		}
	},
	createFood : function(){
		foodItem = new Sprite('food', food, food.behaviors);
		foodItem.top = -30;
		foodItem.left = Math.random()*cW - 40;
		foodItem.visible = false;
		sprite.push(foodItem);
	},
	createPlane : function(){
		planeItem = new Sprite('plane', plane, plane.behaviors);
		planeItem.left = cW / 2;
		planeItem.top = cH - 32;
		sprite.push(planeItem);
	},
	createBoom : function(){
		for(var i = 0; i < enemyNum; i++){
			var boomItem = new Sprite('boom', boom, boom.behaviors);
			boomItem.visible = false;
			boomList.push(boomItem);
		}
	},
	//绘制提示信息
	drawTip : function(item){
		ctx.fillStyle = "#fff";
		ctx.font = "18px 微软雅黑";
		ctx.textAlign = 'left';
		ctx.textBaseline = "middle";
		//绘制火力等级以及射击速度
		var message = "Level:" + (item.fireLevel > 4 ? "MAX" : item.fireLevel);
		//射击速度 速度的范围（40 - 150）
		var d = 190 - item.fireFrame;
		var speed = d == 150 ? "MAX" : d;
		var message1 = "        speed:" + speed;
		ctx.fillText((message + message1), 0, cH-30);
		//绘制分数
		var tip = "Points:" + points + "    死亡次数:" + dieNum;
		ctx.fillText(tip, 0, 18);
		//绘制操作提示
		ctx.textAlign = "right";
		var ccontrol = "Tips : 方向键移动，按“Z”“C”键旋转飞机";
		ctx.fillText(ccontrol, cW-10, 18);
	},
	boom : function(sprite){
		for(var i = 0; i < boomList.length; i++){
			if(!boomList[i].visible){
				boomList[i].left = sprite.left;
				boomList[i].top = sprite.top;
				boomList[i].visible = true;
				var audio = document.getElementsByTagName('audio');
				for(var j = 0; j < audio.length; j++){
					if(audio[j].src.indexOf('boom') != -1 && 
						(audio[j].paused || audio[j].ended)){
						audio[j].play();
						break;
					}
				}
				break;
			}
		}
	},
	//负责更新游戏的内容
	update : function(){
		var self = this;
		this.loading.loop();
		if(this.loading.getLoadState()){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
		//遍历我们的sprite数组
		sprite.foreach(function(){
			this.paint();
		})
		//便利我们的buttleList数组
		buttleList.foreach(function(){
			if(this.visible){
				this.paint();
			}
		});
		boomList.foreach(function(){
			if(this.visible){
				this.paint();
			}
		});
		if(planeItem){
			this.drawTip(planeItem);
		}
		this.collisionDeal();
	},
	//定时器调用的函数
	loop : function(){
		var self = this;
		this.update();
		
		window.RAF(function(){
			self.loop();
		})
		
	},
	//碰撞处理函数
	collisionDeal : function(){
		buttleList.foreach(function(){
			var buttle = this;
			//玩家炮弹与敌机的碰撞检测
			sprite.foreach(function(){
				var item = this;
				if(item.name == "enemy" && item.visible && buttle.visible && buttle.isgood){
					//检测是否发生碰撞
					if(stage.collision(buttle, item)){
						buttle.visible = false;
						item.blood -= planeItem.power;
						if(item.blood <= 0){
							//死亡 分数增加
							stage.boom(item);
							item.visible = false;
							points += item.kind;
						}
					}
				}
			})
			//敌机炮弹与玩家飞机的碰撞检测
			if(buttle.visible){
				if(!buttle.isgood && planeItem.visible && !planeItem.god){
					if(stage.collision(buttle, planeItem)){
						buttle.visible = false;
						planeItem.visible = false;
						dieNum++;
						stage.boom(planeItem);
						//玩家飞机重生函数
						plane.reborn(planeItem);
					}
				}
			}
		});
		sprite.foreach(function(){
			//道具的碰撞检测
			if(this.name == "food" && this.visible){
				if(stage.collision(this, planeItem)){
					this.visible = false;
					switch(this.kind){
						case "LevelUP" :
							planeItem.fireLevel = planeItem.fireLevel >= 4 ? planeItem.fireLevel : planeItem.fireLevel + 1;
							break;
						case "SpeedUP" :
							planeItem.fireFrame = planeItem.fireFrame < 40 ? 40 : planeItem.fireFrame - 10;
							break;
						case "God" :
							planeItem.god = true;
							setTimeout(function(){
								planeItem.god = false;
							},5000)
							break;
					}
				}
			}
			if(this.name == "enemy" && this.visible){
				if(stage.collision(this, planeItem)){
					if(!planeItem.god){
						planeItem.visible = false;
						stage.boom(planeItem);
						plane.reborn(planeItem);
					}
					this.visible = false;
					stage.boom(this);
				}
			}
		});

	},
	//碰撞检测
	collision : function(item1, item2){
		//玩家子弹与敌机的碰撞
		var d = this.getDistance(item1, item2);
		//计算半径之和
		var sumR = item1.width / 2 + item2.width / 2;
		if (d < sumR){
			return true;//发生碰撞
		}else {
			return false;//没有发生碰撞
		}
	},
	getDistance : function(item1, item2){
		var x = item1.left - item2.left;
		var y = item1.top - item2.top;
		var sum = Math.pow(x, 2) + Math.pow(y, 2);
		return Math.sqrt(sum, 2);
	},
	start : function(){
		this.init();
		this.loop();
	}
}
stage.start();