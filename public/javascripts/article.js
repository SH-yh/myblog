/**
 * Created by HJ on 2017/10/17.
 */
requirejs.config({
    baseUrl : '/javascripts/',
    shim: {
        "underscore": {
            exports: "_"
        }
    }//第三方配置

});
requirejs(['https://code.jquery.com/jquery-1.9.1.min.js', 'multifunction'],function(){
   $(function(){
       var app = {
           paging : function(){
               var defalutTemplete = '<li class="list-item">'+
                   '<div class="list-item-warp">'+
                   '<div class="article-header">'+
                   '<h1 class="article-title">'+
                   '<a href="/article/<%=content.type%>/{{=content.id}}"><{=content.title}></a>'+
                   '</h1>'+
                   '<div class="clearfix">'+
                   '<p class="article-overview">'+
                   '<span class="article-author">作者：</span>'+
                   '<span class="author-name"><{=content.author}></span>'+
                   '</p>'+
                   '<p class="article-date"><{=content.date}></p>'+
                   '</div>'+
                   '</div>'+
                   '<div class="article-body">'+
                   '<div class="article-body-content"><{=content.content}></div>'+
                   '</div>'+
                   '<div class="article-footer">'+
                   '<a href="#" class="article-type"><{=content.type}></a>'+
                   '</div>'+
                   '</div>'+
                   '</li>';
               plugs.paging(defalutTemplete, "article", 6);
           },
           up: function(){
               plugs.goUp("#up");//页面向上滚动
           }
       };
       app.up();
       app.paging();
   })
});