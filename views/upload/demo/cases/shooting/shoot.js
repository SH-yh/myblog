(function(window){
	var Game = {
		init : function(){
			this.c = document.getElementById('game');
			this.ctx = this.c.getContext('2d');
			this.maxEnemies = 6;
			this.enemyAlive = 0;
			this.enemyButtle = [];
			this.enemyButtleIndex = 0;
			this.enemies = [];
			this.enemyIndex = 0;
			this.buttle = [];
			this.buttleIndex = 0;
			this.currFrame = 0;
			this.shoot = false;
			this.maxAlive = 3;
			this.live = 0;
			this.score = 0;
			this.particle = [];
			this.particleIndex = 0;
			this.maxParticle = 10;
			this.puse = false;
			this.over = false;
			this.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
			this.color = "rgba(20, 20, 20, 0.7)";
			this.bind();
			this.player = new Player();
			for(var i = 0;i < Game.maxEnemies; i++){
				new Enemy();
				this.enemyAlive++;
			};
			Game.invincibleMode(2000);
			this.loop();
		},
		bind : function(){
			window.addEventListener("keydown", Game.buttonDown, false );
			window.addEventListener("keyup", Game.buttonUp, false);
			this.c.addEventListener('click', Game.click, false);
		},
		collision : function(a, b){//a是子弹，b是飞机
			return !((a.x + a.width < b.x) 
					|| (a.x > b.x + b.width)
					|| (a.y + a.height < b.y)
					|| (a.y > b.y + b.height))//需要子弹 还有飞机
		},
		click : function(){
			if(!Game.puse){//点击暂停
				Game.pused();
			}else{//点击开始
				if(Game.over){
					Game.init();
				}else{
					Game.unpused();
					Game.loop();
					Game.invincibleMode(2000);
				}
			}
		},
		pused : function(){
			this.puse = true;
		},
		unpused : function(){
			this.puse = false;
		},
		buttonDown : function(e){
			var e = e || windown.event;
			var key = e.keyCode;
			if(key == 32){ //空格键
				Game.shoot = true;
			}
			if(key == 37 || key == 65){
				Game.player.moveLeft = true;
			}
			if(key == 39 || key == 68){
				Game.player.moveRight = true;
			}
		},
		buttonUp : function(e){
			var e = e || window.event;
			var key = e.keyCode;
			if(key == 32){
				Game.shoot = false;
			}
			if(key == 37 || key == 65){
				Game.player.moveLeft = false;
			}
			if(key == 39 || key == 68){
				Game.player.moveRight = false;
			}
			
		},
		clear : function(){
			this.ctx.fillStyle = this.color;
			this.ctx.fillRect(0, 0, this.c.width, this.c.height);
		},
		updateScore : function(){
			this.ctx.fillStyle = "#fff";
			this.ctx.font = "20px 微软雅黑";
			this.ctx.fillText("Score: "+this.score, 8, 20);
			this.ctx.fillText("lives: "+(this.maxAlive - this.live), 8, 40);
		},
		invincibleMode : function(time){
			Game.player.invincible = true;
			setTimeout(function(){
				Game.player.invincible = false;
			}, time)
		},
		gameOver : function(){
			this.over = true;
			this.puse = true;
			this.clear();
			var message1 = "Game Over";
			var message2 = "Score: " + Game.score;
			var message3 = "click or press blank to play again";
			this.ctx.fillStyle = "#fff";
			this.ctx.font = "bold 30px 微软雅黑";
			this.ctx.fillText(message1, this.c.width/2 - this.ctx.measureText(message1).width/2, this.c.height / 2 - 50);
			this.ctx.fillText(message2, this.c.width/2 - this.ctx.measureText(message2).width/2, this.c.height / 2 - 5);
			this.ctx.font ="20px 微软雅黑";
			this.ctx.fillText(message3, this.c.width/2 - this.ctx.measureText(message3).width/2, this.c.height / 2 + 30);
		},
		loop : function(){
			if(!Game.puse){
				Game.clear();
				for(i in Game.enemies){
					var currentEnemy = Game.enemies[i];
					currentEnemy.draw();
					currentEnemy.update();
					if(Game.currFrame % currentEnemy.shootSpeed == 0){
						currentEnemy.shoot();//创建子弹
					}
				}

				//绘制子弹并更新子弹的位置
				for(i in Game.enemyButtle){
					var currentEnemyButtle = Game.enemyButtle[i];
					currentEnemyButtle.draw();
					currentEnemyButtle.update();
				}
				if(Game.player.invincible){
					if(Game.currFrame % 20 == 0){
						Game.player.draw();
					}
				}else{
					Game.player.draw();
				}
				Game.player.update();
				
				//子弹的绘制
				for(i in Game.buttle){
					var currentButtle = Game.buttle[i];
					currentButtle.draw();
					currentButtle.update();
				}
				//粒子绘制
				for(i in Game.particle){
					var currentParticle = Game.particle[i];
					currentParticle.draw();
				}
				//跟新分数信息
				Game.updateScore();
				Game.currFrame =  Game.requestAnimationFrame.call(window, Game.loop);
			}
		},
		random : function(min ,max){
			return Math.floor(Math.random()*(max - min) + min);
		}	
	};

	var Enemy = function(){
		this.width = 60;
		this.height = 20;
		this.x = Game.random(0, Game.c.width - this.width);
		this.y = Game.random(10, 40);
		this.speed = Game.random(2, 3);
		this.vy = Game.random(1, 3) * 0.1;
		this.shootSpeed = Game.random(30, 80);
		this.color = "hsl("+ Game.random(0, 360) +", 60%, 50%)";
		this.index = Game.enemyIndex;
		Game.enemies[Game.enemyIndex++] = this;
		this.moveLeft = Math.random() > 0.5 ? false : true;
	};
	Enemy.prototype.draw = function(){
		Game.ctx.fillStyle = this.color;
		Game.ctx.fillRect(this.x, this.y, this.width, this.height);
	};
	Enemy.prototype.update = function(){
		if(this.moveLeft){
			if(this.x > 0){
				this.x -= this.speed;
				this.y += this.vy;
			}else{
				this.moveLeft = false;
			}
		}else{
			if(this.x + this.width < Game.c.width){
				this.x += this.speed
				this.y += this.vy;
			}else{
				this.moveLeft = true;
			}
		}
		for(i in Game.buttle){
			var currentButtle = Game.buttle[i];
			if(Game.collision(currentButtle, this)){
				this.die();
				delete Game.buttle[currentButtle.index];
			}
		}
	}
	Enemy.prototype.shoot = function(){
		new EnemyBullet(this.x + this.width/2, this.y + this.height, this.color);
	}
	Enemy.prototype.die = function(){
		this.explode();
		delete Game.enemies[this.index];
		Game.score += 150;
		Game.enemyAlive = Game.enemyAlive > 1 ? Game.enemyAlive - 1 : 0;
		if(Game.enemyAlive < Game.maxEnemies){
			setTimeout(function(){
				Game.enemyAlive++;
				new Enemy();
			}, 2000);
		}
	}
	Enemy.prototype.explode = function(){
		for(var i = 0; i < Game.maxParticle;i++){
			new Particle(this.x + this.width / 2, this.y + this.height / 2, this.color);
		}
	}

	var Player = function(){
		this.width = 60;
		this.height = 20;
		this.x = (Game.c.width - this.width) /2;
		this.y = Game.c.height - this.height;
		this.speed = 8;
		this.color = "#fff";
		this.moveLeft = false;
		this.moveRight = false;
		//无敌状态
		this.invincible = false;
	}
	Player.prototype.draw = function(){
		Game.ctx.fillStyle = this.color;
		Game.ctx.fillRect(this.x, this.y, this.width, this.height);
	}
	Player.prototype.shoot = function(){
		new Buttle(Game.player.x + Game.player.width/2, Game.player.y,Game.player.color); 
	}
	Player.prototype.update = function(){
		if(Game.shoot && Game.currFrame % 10 == 0){
			this.shoot();
		}
		if(this.moveLeft && this.x > 0){
			this.x -= this.speed;
		}
		if(this.moveRight && this.x + this.width < Game.c.width){
			this.x += this.speed;
		}
		for(i in Game.enemyButtle){
			var currentButtle = Game.enemyButtle[i];
			//检测碰撞
			if(Game.collision(currentButtle, this) && !this.invincible){
				this.die();
				delete Game.enemyButtle[currentButtle.index];
			}
		}
	}
	Player.prototype.die = function(){
		if(Game.live < Game.maxAlive){
			Game.invincibleMode(2000);
			Game.live++;
		}else{
			Game.gameOver();
		}
	}

	var Buttle = function(x, y, color){
		this.width = 8;
		this.height = 20;
		this.x = x;
		this.y = y;
		this.vy = 6;
		this.index = Game.buttleIndex;
		this.color = color;
		Game.buttle[Game.buttleIndex++] = this;
	}
	Buttle.prototype.draw = function(){
		Game.ctx.fillStyle = this.color;
		Game.ctx.fillRect(this.x, this.y, this.width, this.height);
	}
	Buttle.prototype.update = function(){
		this.y -= this.vy;
		if(this.y < 0){
			delete Game.buttle[this.index];
		}
	}

	var EnemyBullet = function(x, y, color){
		this.width = 8;
		this.height = 20;
		this.x = x;
		this.y = y;
		this.vy = 6;
		this.color = color;
		this.index = Game.enemyButtleIndex;
		Game.enemyButtle[Game.enemyButtleIndex++] = this;
	}
	EnemyBullet.prototype.draw = function(){
		Game.ctx.fillStyle = this.color;
		Game.ctx.fillRect(this.x, this.y, this.width, this.height);
	}
	EnemyBullet.prototype.update = function(){
		this.y += this.vy;
		if(this.y > Game.c.height){
			delete Game.enemyButtle[this.index];
		}
	}
	var Particle = function(x, y, color){
		this.size = 40;
		this.x = x;
		this.y = y;
		this.vx = Game.random(-5, 5);
		this.vy = Game.random(-5, 5);
		this.gravity = 0.05;
		this.color = color; 
		this.life = 0;
		this.maxLife = 100;
		this.index = Game.particleIndex;
		Game.particle[Game.particleIndex++] = this;
	}
	Particle.prototype.draw = function(){
		this.x += this.vx;
		this.y += this.vy;
		this.y += this.gravity;
		this.size *= 0.89;
		this.life++;
		Game.ctx.fillStyle = this.color;
		Game.ctx.fillRect(this.x, this.y, this.size, this.size);
		if(this.life >= this.maxLife){
			delete Game.particle[this.index];
		}
	}
	Game.init();
})(window)