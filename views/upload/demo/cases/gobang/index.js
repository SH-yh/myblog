var cvs = document.getElementById("canvas"),
	ctx = cvs.getContext('2d');
var oTitle = document.getElementById('title');
var maps,
	len;
var size = 40;
var d = 20;
var b = 2;//黑棋
var w = 1;//白棋
var mark = true;
function getMap(){
	maps = new Array(16);
	len = maps.length;
	for(var i = 0;i < len; i++){
		maps[i] = [];
		for(var j = 0; j< len;j++){
			maps[i][j] = 0;
		}
	}
}
function drawMap(){
	ctx.strokeStyle = "#111";
	for(var i = 0;i < len - 1; i++){
		for(var j = 0;j < len - 1;j++){
			ctx.strokeRect(i*size + d, j*size + d, size, size);
		}
	}
}
function init(){
	oTitle.innerHTML = "PK";
	ctx.clearRect(0, 0, cvs.width, cvs.height);
	getMap();
	drawMap();
	cvs.onclick = play;
}
function play(e){
	var e = e || window.event;
	var l = this.offsetLeft + d;
	var t = this.offsetTop + d;
	var x = e.clientX - l ;
	var y = e.clientY - t;
	var col, row, index = 0;
	//靠近左边
	if( x % size < size / 2 ){
		col = parseInt(x / size);
	}else {
		col = parseInt(x / size) + 1;
	}
	if(y % size < size / 2){
		row = parseInt(y / size);
	}else {
		row = parseInt(y / size) + 1;
	}

	//棋子的绘制
	if(maps[row][col] == 0){
		if(mark){
			ctx.drawImage(black,col*size,row*size,size,size);
			maps[row][col] = b;//2
			isWin(b, row, col);
		}else {
			ctx.drawImage(white,col*size,row*size,size,size);
			maps[row][col] = w;//1
			isWin(w, row, col);
		}
		mark = !mark;
	}
}
var black, white;
var oImg = {
	'black' : './image/black.png',
	'white' : './image/white.png'
}
function preLoadImage(img, callback){
	var count = index = 0, images = {};
	for(src in img){
		count++;
	}
	for(src in img){
		images[src] = new Image();
		images[src].src = img[src];
		images[src].onload = function(){
			if(++index == count){
				callback(images);
			}
		}
	}
}
preLoadImage(oImg, function(images){
	black = images.black;
	white = images.white;
	init();
});
function isWin(obj, row, col){
	var orgrow, orgcol, total = 1;//用来计数
	rest();
	//检测当前棋子的左边
	while(col > 0 && maps[row][col - 1] == obj){
		total++;
		col--;
	}
	row = orgrow;
	col = orgcol;
	//检测当前棋子的右边
	while(col < len - 1 && maps[row][col + 1] == obj){
		total++;
		col++;
	}
	judge();
	rest();
	//检测当前棋子的上方
	while(row > 0 && maps[row - 1][col] == obj){
		total++;
		row--;
	}
	row = orgrow;
	col = orgcol;
	//检测当前棋子的下方
	while(row < len - 1 && maps[row + 1][col] == obj){
		total++;
		row++;
	}
	judge();
	rest();
	//检测左对角线上方
	while(row > 0 && col > 0 && maps[row - 1][col - 1] == obj){
		total++;
		row--;
		col--;
	}
	row = orgrow;
	col = orgcol;
	//检测左对角线下方
	while(row < len - 1 && col < len - 1 && maps[row + 1][col + 1] == obj){
		total++;
		row++;
		col++;
	}
	judge();
	rest();
	//检测右对角线的上方
	while(row > 0  && col < len - 1 && maps[row - 1][col + 1] == obj){
		total++;
		row--;
		col++;
	}
	row = orgrow;
	col = orgcol;
	//检测右对角线的下方
	while(row < len - 1 && col > 0 && maps[row + 1][col - 1] == obj){
		total++;
		row++;
		col--;
	}
	judge();
	function rest(){
		orgrow = row;
		orgcol = col;
		total = 1;
	}
	function judge(){
		if(total >= 5){
			if(obj == 2){
				oTitle.innerHTML = "黑棋胜利";
			}else{
				oTitle.innerHTML = "白棋胜利";
			}
			setTimeout(init, 1000)
		}
	}
}