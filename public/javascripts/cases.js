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
                    "<a href=/cases/<{=content.id}>>"+
                    "<div class='item-head'>"+
                    "<img src=<{=content.imgSrc}> alt=<{=content.title}>>"+
                    "</div>"+
                    "<div class='item-body'>"+
                    "<h1 class='demo-title'><{=content.title}></h1>"+
                    "<p class='demo-describe'><{=content.introduce}></p>"+
                    "</div>"+
                    "</a>"+
                    "</li>";
                var defaultUrl = "cases",
                    amount = 8;
                plugs.paging(defaluteTemplate, defaultUrl, amount);
            },
            start : function(){
                var oLimit = 1280;
                app.paging();
                plugs.midMenu(oLimit);
            }
        };
        app.start();
    })
});