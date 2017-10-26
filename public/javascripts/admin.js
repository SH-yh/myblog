/**
 * Created by HJ on 2017/10/26.
 */
requirejs.config({
    baseUrl : '/javascripts/',
    shim : {
        "underscore": {
            exports: "_"
        }
    }
});
requirejs(['multifunction'], function(){
    var defaluteTemplate = '<li class="list-item">'+
        '<a href="/article/<{=content.type}>/<{=content.id}>">'+
            '<span class="item-title"><{=content.title}></span>'+
        '</a>'+
        '<span class="item-data">(<{=content.data}>)</span>'+
    '<span class="admin-handle">'+
        '<span class="edit">编辑</span>'+
        '<span id="delete">删除</span>'+
        '</span>'+
        '</li>';
    var defaultUrl = "article",
        amount = 12;
    plugs.paging(defaluteTemplate, defaultUrl, amount);
});