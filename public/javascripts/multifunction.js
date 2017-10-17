/**
 * Created by HJ on 2017/10/16.
 */
define(["https://code.jquery.com/jquery-1.9.1.min.js"], function(){
    plugs = {
        goUp : function(id){
            if(id.indexOf('#') == -1) {
                throw new Error("the prameter should is a id");
            }
            var item =  $(id),
                timer = null,
                default_duration = 200,
                duration = default_duration;
            var oHeight = $(window).height();
            var height = oHeight / 4 + oHeight;
            $(window).scroll(function(){
                //防抖处理
                if($(window).scrollTop() > height){
                    if(timer){
                        clearTimeout(timer);
                        duration = duration < 0 ? 14 : duration - 10;
                    }
                    timer = setTimeout(function(){
                        item.animate({
                            "width": "40px",
                            "height": "40px"
                        }, default_duration, function(){
                            duration = default_duration;
                        });
                    }, duration);

                }else if($(window).scrollTop() < oHeight) {
                    if(timer){
                        clearTimeout(timer);
                        duration = duration < 0 ? 14 : duration - 10;
                    }
                    timer = setTimeout(function(){
                        item.animate({
                            "width": "0px",
                            "height": "0px"
                        }, default_duration, function(){
                            duration = default_duration;
                        });
                    }, duration);
                }

            });
            item.click(function(){
                $(window).scrollTop(0);
            });
        }
    };
    return plugs;
});