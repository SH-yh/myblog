requirejs(["https://code.jquery.com/jquery-1.9.1.min.js"], function(){
    $(function(){
        var oCvs = $('#cvs')[0];
        var oBckImg = $('body'),
            src = "/images/home/homebck.png",
            oLoad = $('#load'),
            oW = oCvs.width,
            oH = oCvs.height;
        var deg = 0,
            index = 0,
            content = "",
            text = "loading. . . . . .",
            len = text.length,
            v = 0.025;
        var RAF = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                function(callback){
                    setTimeout(callback, 1000/60);
                },
            id = null;
        function loadBck(src){
            var img = new Image();
            img.src = src;
            oBckImg.css("background", "url("+src+") no-repeat center ");
            img.onload = function(){
                setTimeout(function(){
                    id ?  cancelAnimationFrame(id) : animationLoading = null;
                    $('#cvs').fadeOut('slow', function(){
                        removeAnimateComponent(800);
                    });
                }, 500);
            };
            animationLoading();
        }
        function removeAnimateComponent(duration){
            oLoad.children().animate({'width' : '0'}, duration,function(){
                $('body').children('#load').remove();
            });
        }
        function animationLoading() {
            oCtx.clearRect(0, 0, oW, oH);
            deg = deg >= 360 ? 0 : deg + v;
            if(index >= len){
                index = 0;
                content = "";
            }
            if(index == parseInt(index)){
                content += text.charAt(index);
            }
            index += v*5;
            painter(deg, content);
            id = RAF(animationLoading);
        }
        function painter(deg, content){
            painterText(oW / 2, oH /2, content);
            painterRect(0, -oH/2, 18, '#fff', deg);
            painterRect(0, oH/2 - 15, 15, '#fff', deg);
        }
        function painterRect(x, y, size, color, deg){
            oCtx.save();
            oCtx.translate(oW/2, oH/2);
            oCtx.fillStyle = color;
            oCtx.rotate(deg);
            oCtx.fillRect(x, y, size, size);
            oCtx.restore();
        }
        function painterText(x, y, text){
            oCtx.font = "24px 微软雅黑";
            oCtx.fillStyle = "#fff";
            oCtx.textAlign = "center";
            oCtx.fillText(text, x, y)
        }
        if(oCvs.getContext){
            var oCtx = oCvs.getContext('2d');
            loadBck(src);
        }else{
            $('body').children('#load').remove();
        }
    });
});