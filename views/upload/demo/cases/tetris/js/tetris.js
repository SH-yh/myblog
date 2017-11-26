window.onload = function(){
	var oCanvas = document.getElementById('canvas');
	var ctxt = oCanvas.getContext('2d');
	var contarr = []; 
	var nextarr = [];
	var nowarr = [];
	var timer, mark = true, speed = 500, score = 0;
	var createRect = [
		[
			[0,0,0,0],
			[0,0,0,0],
			[1,1,1,1],
			[0,0,0,0]
		],[
			[0,0,0,0],
			[0,1,1,0],
			[0,1,1,0],
			[0,0,0,0]
		],[
			[0,0,0,0],
			[1,1,1,0],
			[0,1,0,0],
			[0,0,0,0]
		],[
			[0,1,1,0],
			[0,1,0,0],
			[0,1,0,0],
			[0,0,0,0]
		],[
			[0,1,1,0],
			[0,0,1,0],
			[0,0,1,0],
			[0,0,0,0]
		],[
			[0,1,0,0],
			[0,1,1,0],
			[0,0,1,0],
			[0,0,0,0]
		],[
			[0,0,1,0],
			[0,1,1,0],
			[0,1,0,0],
			[0,0,0,0]
		],[
			[0,1,0,0],
			[0,1,0,0],
			[0,1,0,0],
			[0,1,0,0]
		]
	]
	init();
	document.getElementById('stop').onclick = stop;
	document.getElementById('restart').onclick = restart;
	function init(){
		drawLayout();
		contarr = createArray();
		contDraw();
		drawRect();
	}
	function createArray(){
		var arr = [];
		for(var i = 0;i < 22; i++){
			arr[i] = [];
			for(var j = 0; j < 11; j++){
				arr[i][j] = 0;
			}
		}
		return arr;
	}
	function drawLayout(){
		ctxt.strokeStyle = "#fff";
		ctxt.fillStyle = "#000"
		ctxt.fillRect(0, 0 , 450, 600);
		ctxt.clearRect(20, 25, 275, 550);
		ctxt.fillStyle = "#fff";
		ctxt.font = "20px 微软雅黑";
		ctxt.textAlign = 'left';
		ctxt.fillText("下一个:", 325, 50, 100);
		ctxt.clearRect(325, 70, 100, 100);
		ctxt.fillText("得分:", 325, 250, 100);
		ctxt.fillText("0", 325, 300, 100);
	}
	function contDraw(){
		ctxt.strokeStyle = "#bebebe";
		ctxt.lineWidth = 1;
		//填充色
		ctxt.fillStyle = "#3A70A3";
		for(var i = 0; i < 22; i++){
			for(var j = 0; j < 11; j++){
				var x = j * 25 + 20;
				var y = i * 25 + 25;
				ctxt.clearRect(x, y, 25, 25);
				if(contarr[i][j] == 1){
					ctxt.fillRect(x + 1, y + 1, 24, 24);
				}else{
					ctxt.strokeRect(x, y, 25, 25);
				}
			}
		}
	}
	function Box(){
		var len = createRect.length;
		return createRect[Math.floor(Math.random()*len)];
	}
	function drawRect(){
		if(nextarr.length == 0){
			nowarr = Box();
		}else{
			nowarr = nextarr;
		}
		nowarr.top = -4;
		nowarr.left = 4;
		nextarr = Box();
		for(var i = 0;i < nextarr.length; i++){
			for(var j = 0; j < nextarr[i].length; j++){
				var x = 325 + j * 25;
				var y = 70 + i * 25;
				ctxt.clearRect(x, y, 25, 25);
				if(nextarr[i][j]){
					ctxt.fillRect(x + 1, y + 1, 24, 24);
				}else{
					ctxt.strokeRect(x, y, 25, 25);
				}
			}
		}
	}
	function makeRect(){
		for(var i = 0;i < nowarr.length; i++){
			for(var j = 0; j < nowarr[i].length;j++){
				if(i + nowarr.top < 0){
					continue;
				}
				if(nowarr[i][j] == 1){
					contarr[i + nowarr.top][j  + nowarr.left] = 1;
				}
			}
		}
	}
	function move(x, y){
		var x = x || 0;
		var y = y || 1;
		clear();
		var status = tryMove(x, y);
		if(status){
			if(status != 2){
				nowarr.left += x;
				nowarr.top += y;
			}
			makeRect();
		}else{
			for(var i = 0; i < nowarr.length;i++){
				for(var j = 0;j < nowarr.length;j++){
					if(i + nowarr.top < 0 ){
						continue;
					}
					if(nowarr[i][j]){
						contarr[i + nowarr.top][j + nowarr.left] = 1;
					}
				}
			}
			remove();
			over();
			drawRect();
		}
		contDraw();
		//返回0代表不能向下移动了
	}
	function clear(){
		for(var i = 0;i < nowarr.length; i++){
			for(var j = 0; j < nowarr[i].length;j++){
				if(i + nowarr.top < 0){
					continue;
				}
				if(nowarr[i][j] == 1){
					contarr[i + nowarr.top][j + nowarr.left] = 0;
				}
			}
		}
	}
	function tryMove(mx, my){
		//0 不能向下移动、1可以移动、2不可以左右移动
		var mark = 1;
		for(var i = 0; i < nowarr.length; i++){
			for(var j = 0; j < nowarr[i].length; j++){
				if(nowarr[i][j]){
					var x = nowarr.left + mx  + j;
					var y = nowarr.top  + my + i;
					if(y < 0){
						continue;
					}
					if(y > 21){
						return 0;
					}
					if(x < 0){
						return 2;
					}
					if(x > 10){
						return 2;
					}
					var num = contarr[y][x];
					if(num != 0 ){
						return 0;
					}
				}
				
				
			}
		}
		return mark;
	}
	function stop(){
		if(mark){
			timer = setInterval(move, speed);
			window.addEventListener('keyup', keyUp, false);
			this.innerHTML = "暂停";
		}else{
			clearInterval(timer);
			this.innerHTML = "开始";
			window.removeEventListener('keyup', keyUp, false);
		}
		mark = !mark; 
	}
	function restart(){
		clearInterval(timer);
		init();
	}
	function keyUp(e){
		var e = e || window.event;
		switch(e.keyCode){
			case 38 :
			// 变换功能
				rotate();
				break;
			case 40 :
				move(0, 1);
				break;
			case 37 :
				move(-1, 0);
				break;
			case 39 :
				move(1, 0);
				break;
		}
	}
	function rotate(){
		clear();
		var newArr = [];
		var save;
		for(var i = 0;i < nowarr.length; i++){
			newArr[i] = [];
		}
		for(var i = 0; i < nowarr.length;i++){
			for(var j = 0; j < nowarr[i].length;j++){
				newArr[j].unshift(nowarr[i][j]);
			}	
		}
		save = nowarr;
		newArr.top = nowarr.top;
		newArr.left = nowarr.left;
		nowarr = newArr;
		if(tryMove(0, 0) != 1){
			nowarr = save;
		}
		for(var i = 0; i < nowarr.length; i++){
			for(var j = 0;j < nowarr[i].length;j++){
				if(i + nowarr.top < 0){
					continue;
				}
				if(nowarr[i][j]){
					contarr[i + nowarr.top][j + nowarr.left] = 1;
				}
			}
		}
		contDraw();
	}
	function remove(){
		//主要用来储存一行全为1 的行号
		var rem = [];
		for(var i = 0; i < contarr.length;i++){
			var index = 0;
			for(var j = 0;j < contarr[i].length;j++){
				if(contarr[i][j]){
					index++;
				}
				if(index == 11){
					score += 100;
					setScore(score);
					rem.push(i);
				}
			}
		}
		for(var i = 0; i < rem.length;i++){
			contarr.splice(rem[i], 1);
		}
		for(var i = 0; i< rem.length;i++){
			var newArr = [];
			for(var j = 0;j < contarr[0].length;j++){
				newArr.push(0);
			}
			contarr.unshift(newArr);
		}
	}
	function over(){
		for(var i = 0;i < contarr.length; i++){
			if(contarr[0][i]){
				alert("游戏结束");
				clearInterval(timer);
			}
		}
	}
	function setScore(score){
		ctxt.fillStyle = "#000000";
		ctxt.fillRect(325, 280, 100, 20);
		ctxt.fillStyle = "#fff";
		ctxt.fillText(score, 325, 300, 100);
	}
}