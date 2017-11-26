window.onload = (function(){
	//获取canvas标签以及绘制环境
	var cvs = document.getElementById('cvs');
	var ctx = cvs.getContext('2d');
	//与游戏地图有关的属性
	var cols = 8,
		rows = 4,
		space = 20,//水管区域与Canvas画布之间的间隔距离
		boxWidth = (cvs.width - 2 * space) / cols,
		pipeHeight = rows * boxWidth,
		marginTop = (cvs.height - pipeHeight) / 2;
	var pipeList = [];
	var waterList = [];
	var canClick = true,
		connectSuccess = false;
	return function(){
		var pipe0 = getImage('pipe0'),
			pipe1 = getImage('pipe1'),
			pipe2 = getImage('pipe2'),
			start = getImage('start');
		ctx.lineWidth = 2;
		//水管
		var Pipe = function(center, style, getAway, angle, coordinate){
			this.center = center;// 管道区域的中心点
			this.style = style; // 管道的样式
			this.getAway = getAway; // 是否能够翻转水管的标志 true为不可翻转
			this.angle = angle; // 开始时的角度
			this.endAngle = angle; // 结束时的角度
			this.coordinate = coordinate; //定义水管的坐标
		}
		Pipe.prototype = {
			constructor : Pipe,
			draw : function(){
				this.setHole();
				if(this.angle != this.endAngle){
					this.rotate();
				}
				var pic = pipe0;
				ctx.save();
				ctx.translate(this.center.x , this.center.y);
				ctx.rotate(this.angle);
				switch(this.style){
					case 0 : 
						break;
					case 1 :
						pic = pipe1;
						break;
					case 2 :
						pic = pipe2;
						break;
					case 3 :
						pic = start;
						break;
				}
				ctx.drawImage(pic, -boxWidth / 2, -boxWidth / 2,
							boxWidth , boxWidth);
				if(this.style && this.hover){
					ctx.strokeRect(-boxWidth / 2, -boxWidth / 2, boxWidth , boxWidth);
				}
				ctx.restore();
			},
			rotate : function(){
				if(Math.abs(this.angle - this.endAngle) < 0.01){
					this.endAngle = this.endAngle > 2 * Math.PI ? 0  : this.endAngle;
					this.angle = this.endAngle;
					canClick = true;
					//当前是阀门的话
					if(this.style == 3){
						var result = connectPipe();
						if(result){
							connectSuccess = true;
						}else{
							alert("游戏失败");
							//页面重新加载
							window.location.reload();
						}
					}

				}else {
					this.angle += (this.endAngle - this.angle)*0.2;
				}
			},
			//设置入水口和出水口
			setHole : function(){
				//得到此时水管的方向
				var zl = this.endAngle / (0.5 * Math.PI);
				if(this.style == 1){
					//定义出水口的方向，入水口的方向
					var initHole1 = 0;//入水口方向
					var initHole2 = 2;//出水口的方向
					var d = zl + initHole1;
					//当前的入水口
					this.inHole = d >= 4 ? d - 4 : d;
					var d2 = zl + initHole2;
					//当前的出水口
					this.outHole = d2 >= 4 ? d2 - 4 : d2;
				}else if(this.style == 2){
					//定义出水口的方向，入水口的方向
					var initHole1 = 1;//入水口方向
					var initHole2 = 2;//出水口的方向
					var d = zl + initHole1;
					//当前的入水口
					this.inHole = d >= 4 ? d - 4 : d;
					var d2 = zl + initHole2;
					//当前的出水口
					this.outHole = d2 >= 4 ? d2 - 4 : d2;
				}
			}

		}
		//自扩展Array原型函数
		Array.prototype.foreach = function(callback){
			for(var i = 0; i < this.length; i++){
				callback.apply(this[i], [i]);
			}
		}
		function getImage(item){
			return document.getElementById(item);
		}
		//获取下一个管道的位置以及它的的出水口和入水口是什么方向
		function getHole(item){
			var hole = 0, 
				nextPipe = 0;
			switch(item.outHole){
				//hole 为入水口
				case 0 :
					hole = 2;
					nextPipe = -cols;
					break;
				case 1:
					hole = 3;
					if(item.coordinate.cols == cols - 1){
						nextPipe = 1000000;
					}else{
						nextPipe = 1;
					}
					break;
				case 2:
					hole = 0;
					nextPipe = cols;
					break;
				case 3 :
					hole = 1;
					if(item.coordinate.cols == 0){
						nextPipe = 1000000;
					}else{
						nextPipe = -1;
					}
					break;
			}
			return {hole : hole, nextPipe : nextPipe};
			// hole : 下一个管道的入水口方向 nextPipe : 下一个管道的位置
		}
		//是检测水管连通性  返回一个真假值。
		function connectPipe(){
			var index = 0;
			while(1){
				var result = getHole(pipeList[index]);//拿到第一个水管的相关数据
				if(pipeList[result.nextPipe + index]){
					if(pipeList[result.nextPipe + index].inHole ==  result.hole){
						index = result.nextPipe + index;
					}else if( result.hole == pipeList[result.nextPipe + index].outHole){
						var dir = pipeList[result.nextPipe + index].inHole;
						pipeList[result.nextPipe + index].inHole = result.hole;
						pipeList[result.nextPipe + index].outHole = dir;
						index = result.nextPipe + index;
					}else {
						break;
					}
				}else {
					break;
				}
			}
			if(index == pipeList.length - 1){
				return true;
			}else {
				return false;
			}
		}
		var Painter = {
			drawBackground : function(){
				ctx.save();
				ctx.fillStyle = "#BB8350";
				ctx.strokeRect(0,
					pipeList[0].center.y - boxWidth / 2 - space,
					boxWidth * cols + 2*space, boxWidth * rows + 2 * space);
				for(var i = 0; i < rows; i++){
					for(var j = 0; j < cols; j++){
						ctx.drawImage(pipe0, j * boxWidth + space, 
							i * boxWidth + marginTop, boxWidth, boxWidth);
					}
				}
				ctx.restore();
			},
			drawHZ : function(){
				ctx.save();
				ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
				ctx.fillRect(315, 105 + marginTop, 172, 172);
				ctx.strokeRect(315, 105 + marginTop, 172, 172);
				ctx.fillStyle = "#fff";
				ctx.font = "30px 微软雅黑";
				ctx.textAlign = "center";
				ctx.fillText('净水器', cvs.width / 2, cvs.height / 2);
				ctx.restore();
			},
			drawWaterBox : function(){
				//初始化顶部水箱
				var wb1 = new WaterBox({x : cvs.width / 2, y : space + 50},
				false, cvs.width - 2 *space, 100);
				//初始化底部水箱
				var wb2 = new WaterBox({x : cvs.width / 2, y : cvs.height - space - 100},
				true, cvs.width - 2 *space, 100);
				waterList.push(wb1);
				waterList.push(wb2);
			},
			drawOutputPipe : function(){
				//初始化入水口
				var p1 = new Pipe({x : pipeList[0].center.x , 
					y : pipeList[0].center.y - boxWidth}, 1, true, 0);
				//初始化出水口
				var p2 = new Pipe({x : pipeList[pipeList.length - 1].center.x , 
					y : pipeList[pipeList.length - 1].center.y + boxWidth}, 1, true, 0);
				//初始化阀门
				var p3 = new Pipe({x : pipeList[0].center.x , 
					y : pipeList[0].center.y - boxWidth}, 3, true, 0);
				waterList.push(p1);
				waterList.push(p2);
				waterList.push(p3);
			}
		}
		//水箱对象
		var WaterBox = function(center, isgood, width, height){
			this.center = center;
			this.isgood = isgood;//是否水箱有水
			this.width = width;
			this.height = height;
			this.waterHeight = isgood ? 0 : height * 2/ 3;
			this.start = false;//是否开启动画
			this.end = false;//表示动画是否结束
		}
		WaterBox.prototype = {
			constructor : WaterBox,
			draw : function(){
				ctx.save();
				ctx.strokeStyle = "#000";
				ctx.strokeRect(this.center.x - this.width / 2, this.center.y - this.height/2,
				this.width, this.height);
				ctx.fillStyle = this.isgood ? "rgb(52, 160, 209)" : "rgb(164, 164, 164)";
				if(this.start){
					this.isgood ? this.addWater() : this.reduceWater();
					if(this.isgood){
						var h = (this.waterHeight == this.height * 2/ 3 ? 0 : this.height);
						ctx.fillRect(this.center.x + this.width / 2 - 66, 
						this.center.y - this.height/2, 37, h);
						if(h == 0){
							this.end = true;
						}
					}
				}
				ctx.fillRect(this.center.x - this.width / 2, 
					this.center.y - this.height/2 + this.height - this.waterHeight,
				this.width, this.waterHeight);
				ctx.restore();
			},
			addWater : function(){
				var h = this.height * 2/ 3;
				this.waterHeight = this.waterHeight > h ? h : this.waterHeight + 0.5;
			},
			reduceWater : function(){
				this.waterHeight = this.waterHeight < 0 ? 0 : this.waterHeight - 0.5;
			}
		}
		window.addEventListener('mousemove', function(e){
			var e = e || window.event;
			var bili = cvs.offsetHeight / cvs.height;
			var x = e.clientX - cvs.offsetLeft;
			var y = e.clientY - cvs.offsetTop;
			pipeList.foreach(function(){
				var xl = this.center.x - boxWidth /2 ;
				var xr =  this.center.x + boxWidth /2 ;
				var yt = this.center.y - boxWidth /2 ;
				var yb = this.center.y + boxWidth /2 ;
				this.hover = (x >= xl*bili && x  <= xr*bili && 
						y >= yt*bili && y <= yb *bili && !this.getAway);
			});


		},false);
		window.addEventListener('click', function(e){
			if(canClick){
				var e = e || window.event;
				var bili = cvs.offsetHeight / cvs.height;
				var x = e.clientX - cvs.offsetLeft;
				var y = e.clientY - cvs.offsetTop;
				pipeList.foreach(function(){
					var xl = this.center.x - boxWidth /2 ;
					var xr =  this.center.x + boxWidth /2 ;
					var yt = this.center.y - boxWidth /2 ;
					var yb = this.center.y + boxWidth /2 ;
					if(x >= xl*bili && x  <= xr*bili && 
							y >= yt*bili && y <= yb *bili && !this.getAway ){
						this.endAngle = this.endAngle + 0.5 * Math.PI;
					}
				})
				waterList.foreach(function(){
					var xl = this.center.x - boxWidth /2 ;
					var xr =  this.center.x + boxWidth /2 ;
					var yt = this.center.y - boxWidth /2 ;
					var yb = this.center.y + boxWidth /2 ;
					if(x >= xl*bili && x  <= xr*bili && 
							y >= yt*bili && y <= yb *bili  &&
							 this.style === 3 && this.constructor == Pipe){
						this.endAngle = this.endAngle + 4 * Math.PI;
					}
				});
				canClick = false;
			}
		}, false);
		//返回一个start 到 end范围内的随机整数
		function getRandom(start, end){
			return  Math.floor(Math.random()*(end - start) + start);
		}
		function init(){
			// 1 为 pipe0图片 2 : pipe2图片 0 ： pipe0图片
			// 翻转方向：0 ：向上 1 ：向右 2：向下 3：向左
			for(var i = 0; i < rows; i++){
				for(var j = 0; j < cols; j++){
					if(i > 0 && i < 3 && j > 2 && j < 5){
						var pipe = new Pipe(
							{
								x: j * boxWidth + space + boxWidth / 2, 
								y : i * boxWidth + marginTop + boxWidth / 2
							}, 1,
							true, Math.PI * 0.5, {rows : i, cols : j});
					}else{
						var pipe = new Pipe(
							{
								x: j * boxWidth + space + boxWidth / 2, 
								y : i * boxWidth + marginTop + boxWidth / 2
							}, getRandom(0, 2), 
							false, getRandom(0, 3) * Math.PI * 0.5, {rows : i, cols : j});
					}
					pipeList.push(pipe);
				}
			}
			//对我们拿到的对象按照地图数据进行修改
			var n = getRandom(0, allPath.length - 1);
			var path = allPath[n];
			path.foreach(function(){
				var index = this.rows * cols + this.cols;
				if((this.rows == 0 && this.cols == 0 )|| 
					(this.rows == (rows - 1 )&& this.cols == (cols - 1))){//第一个水管和第二个水管不可以翻转
					pipeList[index] = new Pipe({
						x: this.cols * boxWidth + space + boxWidth / 2, 
						y : this.rows * boxWidth + marginTop + boxWidth / 2
					}, this.style, true, 0, {rows : this.rows, cols : this.cols});
				}else if(this.rows > 0 && this.rows < 3 && this.cols > 2 && this.cols < 5){
					pipeList[index] = new Pipe({
						x: this.cols * boxWidth + space + boxWidth / 2, 
						y : this.rows * boxWidth + marginTop + boxWidth / 2
					}, this.style, true, 0.5 * Math.PI, {rows : this.rows, cols : this.cols});	
				}else {
					pipeList[index] = new Pipe({
						x: this.cols * boxWidth + space + boxWidth / 2, 
						y : this.rows * boxWidth + marginTop + boxWidth / 2
					}, this.style, false, getRandom(0, 3) * Math.PI * 0.5, {rows : this.rows, cols : this.cols});
				}
			});
			Painter.drawWaterBox();
			Painter.drawOutputPipe();
			animate();
		}
		function animate(){
			ctx.clearRect(0, 0, cvs.width, cvs.height);
			Painter.drawBackground();
			pipeList.foreach(function(){
				this.draw();
			});
			waterList.foreach(function(){
				if(this.constructor == WaterBox && connectSuccess){
					this.start = true;
					if(this.end){
						alert("你赢了");
						window.location.reload();
					}
				}
				this.draw();
			});
			Painter.drawHZ();
			AF(animate);
		}
		window.AF = window.requestAnimationFrame || 
					window.webkitRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function(callback){
						setTimeout(callback, 1000 / 60)
					}
		init();
	}
})()