var stage,
	w,//canvas的宽
	h ;//canvas的高
var loader;
var man,
	ground,
	sky;
var stones = [];
var lastStone = null;
var oAgain = document.getElementById('onceAgain');
var oPoint = document.getElementById('points');
function init(){
	//byId 拿到Canvas标签，getContext("2d") 拿到canvas绘制环境
	stage = new createjs.Stage('cvs');
	w = stage.canvas.width;
	h = stage.canvas.height;

	//图片的预加载
	var manifset = [
		{src : 'image/bg.png', id : "bg"},
		{src : 'image/man.png', id : "man"},
		{src : 'image/ground.png', id : "ground"}
	];
	//初始化一个预加载队列
	loader = new createjs.LoadQueue(false);//false 代表不适应XHR
	loader.addEventListener('complete', handleComplete)
	loader.loadManifest(manifset);
}
function handleComplete(){
	var manImg = loader.getResult("man");
	var bgImg = loader.getResult("bg");
	var groundImg = loader.getResult("ground");

	sky = new createjs.Shape();//创建一个位图
	sky.graphics.bf(bgImg).drawRect(0, 0, w, h);

	//绘制草地
	ground = new createjs.Shape();
	ground.graphics.bf(groundImg).drawRect(0, 0, w + groundImg.width, groundImg.height);
	ground.y = h - groundImg.height;
	ground.maker = true;
	ground.action = {
		run : function(){
			ground.x -= 3;
			if(ground.x < -groundImg.width){
				ground.x = 0;
			}
		}
	}

	stage.addChild(sky, ground);
	for(var i = 0; i < 10; i++){
		var stone = new Stone(w + 5, groundImg);
		stones.push(stone);
	}
	man = new Man(200, 326, manImg);
	//设置定时器模式
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	//设置帧数
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener('tick', tick)
	window.addEventListener('keydown', function(e){
		var e = e || window.event;
		var keyCode = e.charCode || e.keyCode || e.which;
		if(keyCode == 32){
			man.jump();
		}
	}, false);
	oAgain.onclick = function(){
		for(var i = 0; i < stones.length; i++){
			stones[i].visibie = false;
			stones[i].x = w + 5;
			stones[i].update();
		}
		s_maker = true;
		ground.maker = true;
		man.run();
		oAgain.style.display = "none";
		point = 0;
	}
}
var t_maker = true,
	s_maker = true,
	point = 0;
var lastStone = null;
function tick(event){
	if(ground.maker){
		ground.action.run();
	}
	man.update();
	if(t_maker && s_maker){
		t_maker = false;
		for(var i = 0; i < stones.length; i++){
			if(!stones[i].visibie){
				stones[i].visibie = true;
				stones[i].x = w;
				stones[i].build();
				break;
			}
		}
		setTimeout(function(){
				t_maker = true;
			}, 2000)
	}
	for(var i = 0; i < stones.length; i++){
		if(stones[i].visibie && man.state != 'die'){
			if(s_maker){
				stones[i].update();
			}
			for(var j = 0; j < stones[i].stones.length; j++){
				var s = stones[i].stones[j];
				//计算游戏角色的中心点坐标
				var m_x = man.sprite.x + 48;//游戏角色的宽度是64*1.5
				var m_y = man.sprite.y + 48;
				//计算每个小障碍物的中心坐标
				var size = stones[i].getSize();
				var s_x = s.x + size.width / 2;
				var s_y = s.y + size.height / 2;

				if(Math.abs(m_x - s_x) < 24 + size.width / 2 &&
					Math.abs(m_y - s_y) < 48 + size.height / 2){
					//发生了碰撞
					man.die();
					s_maker = false;
					ground.maker = false;
					oAgain.style.display = "block";
					oAgain.innerHTML = "您的得分：" + point + "<br />再来一次"
					break;
				}else if(Math.abs(m_x - s_x) < 24 + size.width / 2 && lastStone != stones[i]){
					//游戏角色成功越过障碍物
					point++;
					oPoint.innerHTML ="分数:" + point;
					lastStone = stones[i];
				}
			}
		}
	}
	stage.update(event);
}
init();