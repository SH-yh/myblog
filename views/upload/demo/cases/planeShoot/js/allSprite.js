//用于绘制游戏对象
(function(win){
	var buttleWidth = 70;
	//负责管理绘制我们的游戏对象
	win.Sprite = function(name, painter, behaviors, args){
		if(name !== undefined){
			this.name = name;
		}
		if(painter !== undefined){
			this.painter = painter;
		}
		if(behaviors !== undefined){
			this.behaviors = behaviors;//游戏对象的控制函数
		}
		this.left = 0;//控制游戏对象的左右位置
		this.top = 0;//控制游戏对象的上下位置
		//游戏对象属性初始化
		this.painter.init(this);
	}
	win.Sprite.prototype = {
		constructor : Sprite,
		paint : function(){
			if(this.visible){
				if(this.painter.update){
					this.painter.update(this);
				}else {
					this.painter.paint(this);
				}
			}
			this.update();
		},
		//更新游戏对象
		update : function(){
			if(this.behaviors){
				for(var i = 0;i < this.behaviors.length; i++){
					this.behaviors[i].execute(this);
				}
			}
		}
	}
	//创建流星类
	win.starPainter = {
		//初始化流星的一些属性
		init : function(sprite){
			//流星分为星核和光晕
			sprite.width = Math.round(Math.random()*5);//星核的宽度，为随机值
			sprite.lightLength = 6;
			sprite.speed = sprite.width / 2;
			sprite.visible = true;
			//新建canvas标签
			var size = sprite.width + sprite.lightLength*2;
			//canvas实质就是图片
			sprite.cacheCanvas = document.createElement('canvas');
			sprite.ctx = sprite.cacheCanvas.getContext('2d');
			sprite.cacheCanvas.width = size;
			sprite.cacheCanvas.height = size;
			this.cache(sprite);
		},
		//负责绘制流星
		cache : function(sprite){
			//星核
			var center = sprite.width / 2 + sprite.lightLength;//圆心坐标
			sprite.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
			sprite.ctx.beginPath();
			sprite.ctx.arc(center, center, sprite.width / 2, 0, 2*Math.PI, false);
			sprite.ctx.fill();
			sprite.ctx.closePath();
			//光晕
			var opacity = 0.6;
			var opacitySpeed = 0.8 / sprite.lightLength;//亮度递减量
			for(var i = 0; i < sprite.lightLength; i++){
				opacity -= opacitySpeed;
				//拿到动态的亮度
				sprite.ctx.fillStyle = "rgba(52, 181, 246,"+ opacity +")";
				sprite.ctx.beginPath();
				sprite.ctx.arc(center, center, sprite.width / 2 + i, 0, 2*Math.PI, false);
				sprite.ctx.fill();
				sprite.ctx.closePath();
			}
		},
		//将游戏对象绘制到画布
		paint : function(sprite){
			ctx.drawImage(sprite.cacheCanvas, sprite.left, sprite.top, sprite.cacheCanvas.width, sprite.cacheCanvas.width);
		},
		behaviors : [
			{	//控制流星的移动（行为）
				execute : function(sprite){
					if(sprite.top > canvas.height){
						sprite.left = parseInt(Math.random()*canvas.width);
						sprite.top = parseInt(Math.random()*canvas.height) - canvas.height;
					}
					sprite.top += sprite.speed;
				}
			}
		]
	}

	//创建敌机类
	win.enemy = {
		init : function(sprite){
			sprite.width = 24;
			sprite.height = 24;
			sprite.kind = 1;
			sprite.blood = 50;//当前血量
			sprite.fullBlood = 50;
			sprite.speed = 2;
			sprite.py = Math.PI * 0.5;
			sprite.rotateAngle = Math.PI;
			sprite.visible = true;
			sprite.pyAngle = Math.random() > 0.5 ? -Math.random()*0.03 : Math.random()*0.03;//sprite.py的改变量
		},
		paint : function(sprite){
			var size = sprite.width;
			//拿到预加载好的飞机图片
			var enemy = stage.loading.getResult('ship');
			switch(sprite.kind){
				case 1 :
					ctx.drawImage(enemy, 96, 0, size, size,-size / 2, -size / 2, size, size);
					break;
				case 2 :
					ctx.drawImage(enemy, 120, 0, size, size, -size / 2, -size / 2, size, size);
					break;
				case 3 :
					ctx.drawImage(enemy, 144, 0, size, size, -size / 2, -size / 2, size, size);
					break;
			}
			//绘制血条
			var blood = size*sprite.blood / sprite.fullBlood;
			//外面白色的区域，里面的红色区域
			ctx.strokeStyle = "#fff";
			ctx.fillStyle = "#f00";
			var bloodHeight = 1;
			ctx.strokeRect(-size / 2 - 1, size + bloodHeight + 3, size + 2, bloodHeight + 2);
			ctx.fillRect(size / 2  - blood, size + bloodHeight + 3, blood, bloodHeight);
		},
		update : function(sprite){
			ctx.save();
			ctx.translate(sprite.left, sprite.top);
			ctx.rotate(sprite.rotateAngle);
			this.paint(sprite);
			ctx.restore();
		},
		getSize : function(sprite){
			return {
				width : sprite.width,
				height : sprite.height
			}
		},
		behaviors : [
			{
				//控制敌机的飞行
				execute : function(sprite){
					if(sprite.top > cH || !sprite.visible){
						this.levelUp(sprite);
						sprite.visible = true;
						sprite.blood = sprite.fullBlood;
						sprite.left = cW / 2;
						sprite.top = Math.random()*cH - cH;
						sprite.pyAngle = Math.random() > 0.5 ? -Math.random()*0.03 : Math.random()*0.03;
					}
					if(sprite.top > 0){
						//敌机的发射速度
						var speed = sprite.painter.kind == 1 ? 0.002 : 0.01;
						//间隔判断
						var random = Math.random();
						if(random < speed){
							this.shot(sprite);
						}
					}
					sprite.top += sprite.speed;
					sprite.left += 3*Math.sin(sprite.py);
					sprite.py += sprite.pyAngle;
				},
				//游戏难度升级
				levelUp : function(sprite){
					var num = Math.random();
					if(points >= 200 && points < 400){
							sprite.fullBlood = 150;
							//敌机升级为第二形态
							if(num < 0.1){
								sprite.kind = 2;
								sprite.fullBlood = 200;
							}
						}else if(points >= 400 && points < 600){
							sprite.fullBlood = 200;
							if(num < 0.1){
								sprite.kind = 3;
								sprite.fullBlood = 600;
							}
							if(num < 0.2){
								sprite.kind = 2;
								sprite.fullBlood = 400;
							}
						}else if(points >= 600){
							sprite.fullBlood = 500;
							if(num < 0.2){
								sprite.kind = 3;
								sprite.fullBlood = 1000;
							}
							if(num < 0.4){
								sprite.kind = 2;
								sprite.fullBlood = 750;
							}
						}
				},
				shot : function(sprite){
					this.addButtle(sprite);
				},
				addButtle : function(sprite){
					for(var i = 0; i < buttleNum; i++){
						var buttle = buttleList[i];
						if(!buttle.visible){
							buttle.isgood = false;
							buttle.left = sprite.left;
							buttle.top = sprite.top;
							buttle.visible = true;
							buttle.angle = sprite.rotateAngle;
							var buttleSpeed = 5;
							buttle.velocityX = buttleSpeed*Math.sin(buttle.angle);
							buttle.velocityY = buttleSpeed*Math.cos(buttle.angle);
							break;
						}
					}
				},
			}
		]
	}

	//创建炮弹类
	win.buttle = {
		init : function(sprite){
			sprite.isgood = true;//判断炮弹的类别
			sprite.width = buttleWidth;
			sprite.velocityX = 3;
			sprite.velocityY = 2;
			sprite.visible = true;//炮弹是否可见
		},
		paint : function(sprite){
			if(sprite.isgood){//玩家的炮弹
				var buttleImg = stage.loading.getResult('plasma');
				ctx.drawImage(buttleImg, -sprite.width/2, -sprite.width / 2, sprite.width, sprite.width);
			}else {//敌机的炮弹
				ctx.fillStyle = "#f00";
				ctx.beginPath();
				ctx.arc(0, 0, 3, 0, 2*Math.PI, false);
				ctx.fill();
				ctx.closePath()
			}
		},
		update : function(sprite){
			ctx.save();
			ctx.translate(sprite.left, sprite.top);
			ctx.rotate(sprite.angle);
			this.paint(sprite);
			ctx.restore();
		},
		behaviors : [
			{
				execute : function(sprite){
					sprite.left -= sprite.velocityX;
					sprite.top  -= sprite.velocityY;
					if(sprite.left < 0 || sprite.left > cW || sprite.top < 0 || sprite.top > cH){
						sprite.visible = false;
					}
				}
			}
		]
	}

	//创建道具类
	win.food = {
		init : function(sprite){
			sprite.width = 40;
			sprite.speed = 3;
			sprite.kind = "LevelUP";//道具的种类
			sprite.visible = true;
			sprite.date = null;
		},
		paint : function(sprite){
			var r = parseInt(Math.random()*255);
			var g = parseInt(Math.random()*255);
			var b = parseInt(Math.random()*255);
			ctx.fillStyle = "rgb("+r+","+g+","+b+")";//生成随机的颜色
			ctx.font = "18px 微软雅黑";
			ctx.textAlign = 'center';
			ctx.textBaseline = "middle";
			ctx.fillText(sprite.kind, sprite.left, sprite.top);
		},
		behaviors : [
			{
				execute : function(sprite){
					sprite.top += sprite.speed;
					if( sprite.top > cH){
						sprite.visible = false;
					}
					this.update(sprite);
				},
				update : function(sprite){
					if(sprite.date == null){
						sprite.date = new Date();
					}else {
						var now = new Date();
						var d =	now - sprite.date;
						if(d > 1000){//进行道具的重生判断
							var mark = Math.random() < 0.5 ? true : false;
							if(!sprite.visible && mark){
								sprite.left = Math.random()*cW - sprite.width;
								sprite.top = -30;
								sprite.visible = true;
								sprite.kind = Math.random() > 0.7 ? "LevelUP" :
									(Math.random() > 0.5 ? "SpeedUP" : "God")
							}
						}
					}
				}
			}
		]
	}

	//飞机精灵图帧动画处理
	win.planeSpriteSheet = function(spriteCell, sprite){
		this.spriteCell = spriteCell || [];//帧信息
		this.index = 0;//帧序列
		this.deretion = true;//帧动画播放方向
		this.dataCount = null;//帧与帧播放时间间隔
		this.active = true;//帧动画开关
		this.sprite = sprite;//精灵图
	}
	win.planeSpriteSheet.prototype = {
		constructor : planeSpriteSheet,
		advance : function(){//负责管理帧动画播放序列
			if(this.active){
				this.index++;
				if(this.index == this.spriteCell.length){
					this.index = 0;
					this.active = false;
				}
			}
		},
		paint : function(sprite){
			if(this.dataCount == null){
				this.dataCount = new Date();
			}else {
				var now = new Date();
				if(now - this.dataCount > sprite.fireFrame){
					this.advance();
					this.dataCount = now;
				}
			}
			if(this.active){
				var cell = this.spriteCell[this.index];
				ctx.drawImage(this.sprite, cell.x, cell.y, cell.w, cell.h, -sprite.width / 2, -sprite.width / 2, cell.w, cell.h);
			}
		}
	}

	//创建玩家飞机
	win.plane = {
		init : function(sprite){
			var planeImg = stage.loading.getResult('ship');
			sprite.width = 24;
			sprite.fireFrame = 150;
			sprite.fireLevel = 1;
			sprite.isgood = true;
			sprite.fire = true;
			sprite.rotateLeft = false;//左旋开关
			sprite.rotateRight = false;//右旋转开关
			sprite.toLeft = false;//左移开关
			sprite.toRight = false;//右移开关
			sprite.toUp = false;//上移开关
			sprite.toDown = false;//下移开关
			sprite.rotateSpeed = 0.06;
			sprite.god = false;
			sprite.rotateAngle = 0;
			sprite.velocityY = 2;
			sprite.velocityX = 3;
			sprite.power = 50;
			sprite.visible = true;
			sprite.sheet = new planeSpriteSheet(planeCell, planeImg);
		},
		god : function(sprite){
			ctx.beginPath();
			ctx.strokeStyle = "#fff";
			ctx.arc(sprite.left, sprite.top, Math.random()*4 + sprite.width / 2, 0 , Math.PI*2, false);
			ctx.stroke();
			ctx.closePath();
		},
		//重生
		reborn : function(sprite){
			setTimeout(function(){
				sprite.visible = true;
				sprite.god = true;
				sprite.left = cW / 2;
				sprite.top = cH - 32;
				setTimeout(function(){
					sprite.god = false;
				}, 3000)
			}, 1000)
		},
		paint : function(sprite){
			sprite.sheet.paint(sprite);
		},
		update : function(sprite){
			ctx.save();//!
			ctx.translate(sprite.left, sprite.top);
			ctx.rotate(sprite.rotateAngle);
			this.paint(sprite);
			ctx.restore();

			if(sprite.god){
				this.god(sprite);
			}
		},
		behaviors : [
			{
				execute : function(sprite){
					this.control(sprite);
			//当玩家飞机开学标志为真，并且飞机的射击动画完成一次，就开火一次
					if(sprite.fire && !sprite.sheet.active){
						sprite.sheet.active = true;
						this.shot(sprite);
					}
				},//!!
				control : function(sprite){
					if(sprite.toUp){//上移动
						var top = sprite.top;
						sprite.top = top < sprite.width / 2 ? 
							top : top - sprite.velocityY;
					}else if(sprite.toDown){//下移
						var top = sprite.top;
						sprite.top = top > (cH - sprite.width / 2) ? 
							top : top + sprite.velocityY;
					}else if(sprite.toLeft){
						var left = sprite.left;
						sprite.left = left < sprite.width / 2 ?
							left : left - sprite.velocityX;
					}else if(sprite.toRight){
						var left = sprite.left;
						sprite.left = left > (cW - sprite.width / 2) ? left : left + sprite.velocityX;
					}else if(sprite.rotateLeft){
						sprite.rotateAngle -= sprite.rotateSpeed;
					}else if(sprite.rotateRight){
						sprite.rotateAngle += sprite.rotateSpeed;
					}
				},
				shot : function(sprite){
					//添加炮弹
					this.addButtle(sprite, sprite.rotateAngle);
					//火力等级提升处理
					var angle = 0.1;
					for(var i = 1; i< sprite.fireLevel;i++){
						var rotateLeft = sprite.rotateAngle + i * angle;
						this.addButtle(sprite, rotateLeft);
						var rotateRight = sprite.rotateAngle - i * angle;
						this.addButtle(sprite, rotateRight);
					}
					var audio = document.getElementsByTagName('audio');
					for(var i = 0; i < audio.length; i++){
						if(audio[i].src.indexOf('shot') != -1 && 
							(audio[i].paused || audio[i].ended)){
							audio[i].play();
							break;
						}
					}
				},
				addButtle : function(sprite, angle){
					for(var i = 0; i < buttleNum; i++){
						var buttle = buttleList[i];
						if(!buttle.visible){
							buttle.isgood = true;
							buttle.left = sprite.left;
							buttle.top = sprite.top;
							buttle.visible = true;
							buttle.angle = angle;
							var buttleSpeed = 5;
							buttle.velocityX = buttleSpeed*Math.sin(-buttle.angle);
							buttle.velocityY = buttleSpeed*Math.cos(-buttle.angle);
							break;
						}
					}
				}
			}
		]
	}

	//创建爆炸类
	win.boom = {
		init : function(sprite){
			var boomImg = stage.loading.getResult('explosion');
			sprite.width = 60;
			sprite.fireFrame = 40;
			sprite.rotateAngle = 0;
			sprite.sheet = new planeSpriteSheet(explosionCell, boomImg);
		},
		paint : function(sprite){
			sprite.sheet.paint(sprite);
		},
		update : function(sprite){
			ctx.save();
			ctx.translate(sprite.left, sprite.top);
			ctx.rotate(sprite.rotateAngle);
			this.paint(sprite);
			ctx.restore();
		},
		behaviors : [
			{
				execute : function(sprite){
					//当一次帧动画完毕后
					if(!sprite.sheet.active){
						sprite.visible = false;
						sprite.sheet.active = true;
					}
				}
			}
		]
	}
})(window)