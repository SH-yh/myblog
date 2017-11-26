(function(win){
	var STONES_WIDTH = 70;
	var STONES_HEIGHT = 28;
	var STONES_NUM = 8;
	var STONE_SPEED = 3;
	win.Stone = function(x, img){
		this.x = x;
		this.y = 0;
		this.img = img;
		this.visibie = false;
		this.stones = [];
		this.init();
	}
	win.Stone.prototype = {
		constructor : Stone,
		init : function(){
			for(var i = 0; i < STONES_NUM; i++){
				var stone = new createjs.Shape();
				stone.graphics.s("#000").f("#59554D").drawRect(0, 0, STONES_WIDTH, STONES_HEIGHT);
				stone.x = this.x;
				stage.addChild(stone);
				this.stones.push(stone);
			}
		},
		update : function(){
			var index = 0;
			//处理上方的障碍物
			for(var i = 0; i < this.top; i++){
				this.stones[index].x = this.x;
				this.stones[index].y = i * STONES_HEIGHT;
				index++;
			}	
			//处理下方的障碍物
			for(var j = 0; j < this.bottom; j++){
				this.stones[index].x = this.x;
				this.stones[index].y = h - 	this.img.height - (j + 1)* STONES_HEIGHT;
				index++;
			}
			if(this.visibie){
				if(this.x <= -STONES_WIDTH){
					this.visibie = false;
				}
				this.x -= STONE_SPEED;
			}
		},
		getSize : function(){
			return {
				width : STONES_WIDTH,
				height : STONES_HEIGHT
			}
		},
		build : function(){
			this.top = parseInt(Math.random()*STONES_NUM);
			this.bottom = STONES_NUM - this.top;
		}
	}
})(window)