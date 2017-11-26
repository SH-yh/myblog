var cvs = document.getElementById('cvs').getContext('2d');
function Snake(canvas){
	var self = this;
	this.zong = 20;
	this.hang = 16;
	this.r = 25;
	this.cvs = canvas;
	this.timer = null;
	this.time = 200;
	this.foo = [];
	this.mark = true;
	this.d = 1;//1、右 2、下 3、左 0、上
	this.s = [[2, 0], [1, 0], [0, 0]];

	this.init = function(){
		for(var i = 0;i < this.s.length; i++){
			this.drawRect(this.s[i][0], this.s[i][1]);
		}
		this.drawFood();
		window.addEventListener('keydown',self.control ,false);
		document.getElementById("btn").onclick = this.start;
		
	}
	this.game = function(){
		this.timer = setInterval(function(){
			var x = self.s[0][0];
			var y = self.s[0][1];
			switch(self.d){
				case 0 :
					y -= 1;
					window.addEventListener('keydown',self.control ,false);
					break;
				case 1 :
					x += 1;
					window.addEventListener('keydown',self.control ,false);
					break;
				case 2 :
					y += 1;
					window.addEventListener('keydown',self.control ,false);
					break;
				case 3 :
					x -= 1;
					window.addEventListener('keydown',self.control ,false);
					break;
			}
			//边界判断
			if(x > (self.zong - 1) || x < 0 || y > (self.hang - 1) || y < 0){
				self.faill();
			}
			//小蛇吃掉了食物
			if(x == self.foo[0] && y ==  self.foo[1]){
				self.drawFood();
			}else{
				var len = self.s.length;
				var mx = self.s[len-1][0];
				var my = self.s[len-1][1];
				self.s.pop();
				self.clear(mx, my);
			}
			self.s.unshift([x, y]);
			self.drawRect(x, y);
			for(var i = 1;i < len;i++){
				if(self.s[0][0] == self.s[i][0] && self.s[0][1] == self.s[i][1]){
					self.faill();
				}
			}
		}, this.time)
	};
	this.start = function(){
		if(self.mark){
			this.innerHTML = "暂停";
			self.game();
		}else{
			this.innerHTML = "开始";
			clearInterval(self.timer);
		}
		self.mark = !self.mark;
	};
	this.drawRect = function(x, y, cl){
		if(cl){
			this.cvs.fillStyle = cl;
		}
		this.cvs.fillRect(x*this.r, y*this.r, this.r, this.r);
		this.cvs.fillStyle = "#000";
	}
	this.drawFood = function(){
		var x = parseInt(Math.random()*this.zong);
		var y = parseInt(Math.random()*this.hang);
		for(var i = 0;i < this.s.length; i++){
			if(x == this.s[i][0] && y == this.s[i][1]){
				var x = parseInt(Math.random()*this.zong);
				var y = parseInt(Math.random()*this.hang);
				i = 0;
			}
		}
		this.foo = [x, y];
		this.drawRect(x, y, '#f00');
	}
	this.clear = function(x, y){
		this.cvs.clearRect(x*this.r, y*this.r, this.r, this.r);
	}
	this.control = function(e){
		var e = e || window.event;
		switch(e.keyCode){
			case 38 ://上
				if(self.d != 2){
					self.d = 0;
					window.removeEventListener('keydown', self.control);
				}
				break;
			case 40 ://下
				if(self.d != 0){
					self.d = 2;
					window.removeEventListener('keydown', self.control);
				}
				break;
			case 37 : //左
				if(self.d != 1){
					self.d = 3;
					window.removeEventListener('keydown', self.control);
				}
				break;
			case 39 : //右
				if(self.d != 3){
					self.d = 1;
					window.removeEventListener('keydown', self.control);
				}
				break;
		}
	}
	this.faill = function(){
		alert("失败");
		clearInterval(this.timer);
		return;
	}
}
var snake = new Snake(cvs);
snake.init();
