var oCanvas = document.getElementById('canvas');
var oContext = oCanvas.getContext('2d');
var msg = document.getElementById('msg');
var w = 35;
var h = 35;
var level = 0, moveTimes = 0;
var curMan, curMap, curLevel, preMap, mark = false;
//收集图片信息
var images = {
	ball : './img/ball.png',
	block : './img/block.gif',
	box : './img/box.png',
	down : './img/down.png',
	left : './img/left.png',
	right : './img/right.png',
	up : './img/up.png',
	wall : './img/wall.png'
}

//预加载图片
function preLoadImage(callback){
	var image = {},  count = index=0;
	for(item in images){
		count++;	
	}
	for(item in images){
		image[item] = new  Image();
		image[item].src = images[item],
		image[item].onload = function(){
			if(++index == count){
				callback(image);
			}
		}
	}
}
var ball, block, box, down, left, right, up, wall;
preLoadImage(function(image){
	block = image.block;
	ball = image.ball;
	box = image.box;
	down = image.down;
	left = image.left;
	right = image.right;
	up = image.up;
	wall = image.wall;
	init();
})
function init(){
	initLevel();
	window.addEventListener('keydown', keyDown,false);
}
function initLevel(){
	curMan = down;
	moveTimes = 0;
	curLevel = copyArray(levels[level]); //当前关卡原始数据
	curMap = copyArray(levels[level]);//代表当前关卡的移动数据
	initMap();
	drwaMap(curMap);
	showMessage();
}
function People(x, y ){
	this.x = x;
	this.y = y;
}
var peoplePosition = new People(0, 0);
function drwaMap(map){
	for(var i = 0;i < 16;i++){
		for(var j = 0;j < 16; j++){
			var pic = block;
			switch(map[i][j]){
				case 0 :
				 	pic = block;
				 	break;
				case 1 :
					pic = wall;
					break;
				case 2 :
					pic = ball;
					break;
				case 3 :
					pic = box;
					break;
				case 4 :
					pic = curMan;
					peoplePosition.x =	i;
					peoplePosition.y = j;
					break;
				case 5 :
					pic = box;
					break;
			}
			oContext.drawImage(pic, j * w - (pic.width - w)/2, i * h - pic.height, pic.width, pic.height);
		}
	}
}
//绘制地板
function initMap(){
	for(var i = 0; i < 16; i++){
		for(var j = 0;j < 16;j++){
			oContext.drawImage(block, j*w, i*h, w, h);
		}
	}
}
function keyDown(event){
	var event = event || window.event;
	switch(event.keyCode){
		case 38 :
			go('up');
			break;
		case 37 :
			go('left');
			break;
		case 39 :
			go('right');
			break;
		case 40 :
			go('down');
			break;

	}
}
function go(dir){
	var p1, p2;
	switch(dir){
		case 'left':
			p1 = new People(peoplePosition.x, peoplePosition.y - 1);
			p2 = new People(peoplePosition.x , peoplePosition.y - 2);
			curMan = left;
			break;
		case 'right':
			p1 = new People(peoplePosition.x, peoplePosition.y  + 1);
			p2 = new People(peoplePosition.x, peoplePosition.y + 2);
			curMan = right;
			break;
		case 'up' :
			p1 = new People(peoplePosition.x - 1, peoplePosition.y);
			p2 = new People(peoplePosition.x - 2, peoplePosition.y);
			curMan = up;
			break;
		case 'down':
			p1 = new People(peoplePosition.x + 1, peoplePosition.y);
			p2 = new People(peoplePosition.x + 2, peoplePosition.y);
			curMan = down;
			break;
	}
	preMap = copyArray(curMap);
	if(tryGo(p1, p2)){
		moveTimes++;
		showMessage();
		mark = true;
	};
	initMap();
	drwaMap(curMap);
	if(cheackFinsh()){
		nextLevel(1);
	}
}
function tryGo(p1, p2){
	//判断小人的坐标是否超出了边界
	if(p1.x < 0 || p1.y < 0) return false;
	if(p1.x > curMap.length || p1.y > curMap.length) return false;
	//判断小人的在当前方向上的下一个位置是否是围墙
	if(curMap[p1.x][p1.y] == 1) return false;
	//判断小人在当前方向上的下一个位置是否是箱子
	if(curMap[p1.x][p1.y] == 3 || curMap[p1.x][p1.y] == 5){
		if(curMap[p2.x][p2.y] == 1 || curMap[p2.x][p2.y] == 3){
			return false;
		}
		curMap[p2.x][p2.y] = 3;
	}
	curMap[p1.x][p1.y] = 4;
	//找到原始数据中小人当前位置所代表的数字
	var stuets = curLevel[peoplePosition.x][peoplePosition.y];
	if(stuets != 2){
		if(stuets == 5){
			stuets = 2;
		}else{
			stuets = 0;
		}
	}
	curMap[peoplePosition.x][peoplePosition.y] = stuets;
	peoplePosition= p1;
	return true;
}
function cheackFinsh(){
	var len = curMap.length;
	for(var i = 0;i < len;i++){
		for(var j = 0; j < len; j++){
			if(curLevel[i][j] == 2 && curMap[i][j] != 3 || curLevel[i][j] == 5 && curMap[i][j] != 3){
				return false;
			}
		}
	}
	return true;
}

function copyArray(array){
	var arr = [];
	var len = array.length
	for(var i = 0;i < len; i ++){
		arr[i] = [];
		for(var j = 0;j < len; j ++){
			arr[i][j] = array[i][j];
		}
	}
	return arr;
}
function nextLevel(n){
	level += n;
	if(level < 0){
		level = 0;
	}else if(level > levels.length - 1){
		level = levels.length - 1;
	}
	initLevel();
}
function showMessage(){
	msg.innerHTML = '第' + level + '关 ' + ' 移动次数' + moveTimes;
}
function help(){
	msg.innerHTML = '用键盘上的上、下、左、右键移动小人，把箱子全部推到小球的位置即可过关。箱子只可向前推，不能往后拉，并且小人一次只能推动一个箱子。';
}
function selectionLevel(value){
	level = value;
	initLevel();
}
function preBack(){
	if(mark){
		moveTimes++;
		showMessage();
		initMap();
		drwaMap(preMap);
		curMap = copyArray(preMap);
		mark = false;
	}
}