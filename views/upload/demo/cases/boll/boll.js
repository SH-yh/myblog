var cvs = document.getElementById("cvs");
var ctxt = cvs.getContext("2d");
var W = cvs.width;
var H = cvs.height;
var timer = null;
var speed = 25;
var bollX = W / 2;//小球的横坐标
var bollY = H / 2;//小球的纵坐标
var bollR = 10;//小球的半径
var bollVX = 10;
var bollVY = 5;
var panelW = 10;//板子的宽度
var panelH = 100;//板子高度;
var panel1Y = (H - panelH) / 2;//球拍1的纵坐标
var panel2Y = (H - panelH) / 2;//球拍2的纵坐标
var player1Score = 0;
var player2Score = 0;
var winScore = 3;
var isEnd = 0;
cvs.addEventListener('mousemove',function(e){
	var e = e || window.event;
	panel1Y = e.clientY - cvs.offsetTop - panelH / 2;
},false);
cvs.onclick = function(){
	if(isEnd){
		isEnd = 0;
		player2Score = 0;	
		player1Score = 0;
	}
}
animate();
function animate(){
	fillRect(0, 0, W, H, '#000');
	if(isEnd){
		if(player1Score > player2Score){
			fillText("恭喜你赢了",W / 2, H / 2 );
		}else{
			fillText("你输了",W / 2, H / 2 );
		}
		fillText("再来一局？",W / 2, H *2 / 3);
		return;
	}
	drawNet();
	bollX += bollVX;
	bollY += bollVY;
	if(panel2Y + panelH / 2 < bollY - 40){
		panel2Y += 5;
	}else if(panel2Y + panelH / 2 > bollY + 40){
		panel2Y -= 5;
	}
	if(bollX + bollR + panelW > W ){
		if(bollY < panel2Y || bollY > panel2Y + panelH){
			player1Score++;
			bollRest();
		}else{
			bollVX = -bollVX;
			bollVY = (bollY - (panel2Y + panelH/2)) * 0.3;
		}
	}
	if(bollX - bollR - panelW < 0 ){
		if(bollY < panel1Y || bollY > panel1Y + panelH){
			player2Score++;
			bollRest();
		}else{
			bollVX = -bollVX;
			bollVY = (bollY - (panel1Y + panelH/2)) * 0.3;
		}
	}
	if(bollY + bollR < 0 || bollY + bollR > H){
		bollVY = -bollVY;
	}
	//绘制最左边的球拍
	fillRect(1, panel1Y, panelW, panelH,'#fff');
	//绘制最右边的球拍
	fillRect(W - panelW - 1, panel2Y, panelW, panelH,'#fff');
	//绘制小球
	fillCircle(bollX, bollY, bollR, "#fff");
	fillText(player1Score, 100, 100);
	fillText(player2Score, W - 100, 100);
}
timer = setInterval(animate, speed);
//绘制矩形
function fillRect(x, y, w, h, cl){
	ctxt.fillStyle = cl;
	ctxt.fillRect(x, y, w, h);
}
//绘制圆形
function fillCircle(x, y, r, cl){
	ctxt.beginPath();
	ctxt.fillStyle = cl;
	ctxt.arc(x, y, r, 0, 2*Math.PI, false);
	ctxt.fill();
}
function drawNet(){ // 600 / 15 = 40 - 10 - 10 = 20
	for(var i = 0;i < H; i+=40){
		fillRect(W / 2 - 1, i+10, 2, 20, "#fff");
	}
}
function bollRest(){
	if(player1Score >= winScore || player2Score >= winScore){
		isEnd = 1;
	}
	bollVX = -bollVX;
	bollX = W / 2;//小球的横坐标
	bollY = H / 2;//小球的纵坐标
}
function fillText(score,x, y){
	ctxt.fillStyle = "#fff";
	ctxt.font = "40px 微软雅黑";
	ctxt.textAlign = "center";
	ctxt.fillText(score, x, y);
}