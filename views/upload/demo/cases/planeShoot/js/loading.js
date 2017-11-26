var Loading = (function(){
	var loadComplete = false;
	var dataCount = null;
	//datas : 加载的资源 canvas : canvas callback : 预加载完毕后的执行函数
	function init(datas, canvas, callback){
		this.canvas = canvas;
		this.x = this.canvas.width / 2;//确定圆心X坐标
		this.y = this.canvas.height / 2;//确定圆心Y坐标
		this.r = 80;
		this.percent = 0;
		this.writePercent = 0;
		this.angle = 0;//转动的角度
		this.elew = 10;//小正方形的尺寸
		this.callback = callback;
		this.result = [];
		//进行预加载信息
		this.load(datas);
	}
	init.prototype = {
		constructor : init,
		load : function(datas){
			var index = 0;//遍历序号
			var self = this;
			li();
			function li(){
				if(datas[index].src.indexOf('.mp3') != -1){
					var audio = document.createElement('audio');
					//当页面加载完毕后开始加载音频
					audio.preload = "auto";
					//指定链接
					audio.src = datas[index].src;
					//当浏览器页面能够在不停止播放音频进行缓冲的情况下，可以持续播放
					audio.addEventListener('canplaythrough', loadMp3);
					if(datas[index].src.indexOf('bgm') != -1){
						audio.id = "bgm";
						audio.loop = true;//设置循环播放
						audio.volume = 0.8;//设置音量
					}
					function loadMp3(){
						self.result[datas[index].id] = audio;
						audio.removeEventListener('canplaythrough', loadMp3);
						index++;//遍历序号加1
						document.body.appendChild(audio);
						if(index != datas.length){
							//转换成百分比
							self.percent =parseInt(index / datas.length *100);
							li.call(self);
						}else {
							self.percent = 100;
						}
					}	
				}else if(datas[index].src.indexOf('.jpg') != -1 || 
					datas[index].src.indexOf('.png') != -1){
					preloadImg(datas[index].src, function(img){
						self.result[datas[index].id] = img;
						index++;//遍历序号加1
						if(index != datas.length){
							//转换成百分比
							self.percent = parseInt(index / datas.length *100);
							li.call(self);
						}else {
							self.percent = 100;
						}
					});
				}
			}
		},
		paint : function(){
			var ctx = this.canvas.getContext('2d');
			ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
			ctx.fillRect(this.x - this.r - this.elew*2, this.y - this.r - this.elew*2,
				(this.r + this.elew + 5)*2, (this.r + this.elew + 5)*2);
			ctx.fillStyle = "#fff";
			//开始我们的绘制
			ctx.save();
			//将原点移动到画布的中心
			ctx.translate(this.x, this.y);
			ctx.rotate(this.angle);
			ctx.fillRect(5, -this.r + this.elew / 2, this.elew, this.elew);
			ctx.fillRect(-5, this.r - + this.elew / 2, this.elew, this.elew);
			ctx.restore();
			//绘制文字
			ctx.clearRect(this.x - 48, this.y - 12, 96, 24);
			ctx.font = "18px 微软雅黑";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			var message = "加载中" + this.writePercent + "%";
			ctx.fillText(message, this.x, this.y);

			this.angle = this.angle > 2*Math.PI ? 0 : this.angle + 0.05;
		},
		getResult : function(id){
			return this.result[id];
		},
		update : function(){
			var self = this;
			if(dataCount == null){
				dataCount = new Date();
			}else {
				var now = new Date();
				var td = now - dataCount;
				if(td > 10){
					this.writePercent++;
					dataCount = new Date();
					if(this.writePercent == 100){
						setTimeout(function(){
							self.callback();
							loadComplete = true;
						}, 500)
					}
				}
			}
		},
		getLoadState : function(){
			return loadComplete;
		},
		loop : function(){
			if(this.percent != this.writePercent){
				this.update();
			}
			if(!loadComplete){
				this.paint();
			}
		}
	}
	return init;
})();
function preloadImg(img, callback){
	var image = new Image();
	image.src = img;
	image.onload = function(){
		callback.call(image, image);
	}
}