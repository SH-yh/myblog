/**
 * Created by HJ on 2017/10/24.
 */
requirejs.config({
    baseUrl : '/javascripts/',
    shim: {
        "underscore": {
            exports: "_"
        }
    }//第三方配置

});
requirejs([ 'multifunction'],function(){
    $(function(){
        var app = {
            paging: function(){
                var defaluteTemplate = "<li class='demo-item'>"+
                    "<div class='item-head'>"+
                    "<a href=<{=content.src}>>"+
                    "<img src=<{=content.imgSrc}> alt=<{=content.title}>"+
                    "</a>"+
                    "</div>"+
                    "<div class='item-body'>"+
                    "<h1 class='demo-title'><{=content.title}></h1>"+
                    "<p class='demo-describe'><{=content.introduce}></p>"+
                    "</div>"+
                    "</li>";
                var defaultUrl = "cases",
                    amount = 8;
                plugs.paging(defaluteTemplate, defaultUrl, amount);
            },
            start : function(){
                var oWidth = $(window).width();
                app.paging();
                if(oWidth <= 1280){
                    plugs.midMenu();
                }
            }
        };
        app.start();
    })
});