(function(win){
	var FRAM_RATE = 13;
	var SCALE_X = 1.5,
		SCALE_Y = 1.5;
	var JUMP_SPEED = 2.5;
	var GRAVITY = 9.8;
	var PROPORTION = 200 / 1;
	win.Man = function(x, y, img){
		this.x = x;
		this.y = y;
		this.state = "run";
		this.vy = 0;
		this.init(img);
	};
	win.Man.prototype = {
		constructor : Man,
		init : function(img){
			//初始化一个精灵图类,进行了一些帧动画的定义
			var sprite = new createjs.SpriteSheet({
				"images" : [img],
				//用来规定我们帧的信息
				"frames" : {
					"width" : 64, //每一帧的宽度
					"height" : 64, //每一帧的高度
					"count" : 45, //一共多少帧
					"regX" : 0, // 绘制起点X
					"regY" : 0 //绘制起点Y
				},
				//规定我们的帧动画
				"animations" : {
					"run" : { //注册run动画事件
						frames : [21, 20, 19, 18, 16, 15, 14, 13, 12],
						next : "run",
						speed : 1
					},
					"jump" : {
						frames : [34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
						next : "run",
						speed : 1
					},
					"die" : {
						frames: [8, 7, 6, 5, 4, 3, 2, 1, 0],
						next : "die",
						speed : 1
					}
				}
			});	
			this.sprite = new createjs.Sprite(sprite, this.state);
			this.sprite.framerate = FRAM_RATE;
			this.sprite.setTransform(this.x, this.y, SCALE_X, SCALE_Y);
			///将帧动画渲染到画布上
			stage.addChild(this.sprite);
		},
		update : function(){
			var sprite = this.sprite;
			//当前帧与上一帧的间隔时间
			var time = createjs.Ticker.getInterval() / 1000;
			switch(this.state){
				case "jump" :
					sprite.y += this.vy*time*PROPORTION;
					this.vy += time*GRAVITY;
					if(sprite.y > this.y && this.vy > 0){
						sprite.state = "run";
						sprite.y=this.y;
						this.vy = 0;
					}else if(sprite.y < 0){
						sprite.y = 0;
						this.vy = 0;
					}
					break;
				case "die":
					sprite.y += this.vy*time*PROPORTION;
					this.vy += time*GRAVITY;
					if(sprite.y > this.y && this.vy > 0){
						sprite.y=this.y;
						this.vy = 0;
					}
					if(sprite.currentFrame == 0){
						sprite.paused = true;
					}
					break;
			}
		},
		jump : function(){
			this.vy = -JUMP_SPEED;
			this.state = "jump";
			this.sprite.gotoAndPlay(this.state);
		},
		run : function(){
			this.state = "run";
			this.sprite.gotoAndPlay(this.state);
		},
		die : function(){
			this.state = "die";
			this.sprite.gotoAndPlay(this.state);
		}
	}
})(window)