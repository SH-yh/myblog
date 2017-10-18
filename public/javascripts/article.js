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
       plugs.goUp("#up");//页面向上滚动
       plugs.paging();
   })
});