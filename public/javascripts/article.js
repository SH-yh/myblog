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
                   '<a href=/article/<{=content.type=>/{{=content.id}}><{=content.title}></a>'+
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
                   '<span  class="article-type"><{=content.type}></span>'+
                   '</div>'+
                   '</div>'+
                   '</li>';
               plugs.paging(defalutTemplete, "article", 6);
           },
           extend: function(){
                var oWidth = $(window).width(),
                    mark = true,
                    timer = null,
                    duration = 300,
                    oClassify = $('#classify');
                if(oWidth < 1280){
                    $('#expand_list').on('click', handle);
                    function handle(){
                        if(timer){
                            clearTimeout(timer);
                        }
                        timer = setTimeout(handleExtend, duration);
                        function handleExtend(){
                            if(mark){
                                oClassify.animate({
                                    top:'90px'
                                },300, function(){
                                    oClassify.animate({
                                        top:'64px'
                                    },200,function(){
                                        oClassify.animate({
                                            top:'90px'
                                        },300,function(){
                                            oClassify.animate({
                                                top:'64px'
                                            },200, function(){
                                                duration = 100;
                                            })
                                        })
                                    })
                                });
                            }else{
                                oClassify.animate({
                                    top:'-100%'
                                },500, function(){
                                    duration = 100;
                                });
                            }
                            mark = !mark;
                        }
                    }
                }
           },
           up: function(){
               plugs.goUp("#up");//页面向上滚动
           },
           start: function(){
               var oLimit = 1280;
               this.up();
               this.extend();
               this.paging();
               plugs.midMenu(oLimit);
           }
       };
       app.start();
   })
});