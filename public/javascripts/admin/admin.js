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
    var app = {
        paging: function(){
            var defaluteTemplate = '<li class="list-item">'+
                '<a href="/article/<{=content.type}>/<{=content.id}>">'+
                '<span class="item-title"><{=content.title}></span>'+
                '</a>'+
                '<span class="item-data">(<{=content.data}>)</span>'+
                '<span class="admin-handle">'+
                '<a class="edit" href="/admin/edit/<{=content.id}>">编辑</a>'+
                '<span id="delete">删除</span>'+
                '</span>'+
                '</li>';
            var defaultCollection = "article",
                amount = 12;
            plugs.paging(defaluteTemplate, defaultCollection, amount);
        },
        deleteDetail: function(){
            var delBtn,
                defaulateCollection,
                json;
            delBtn = $('.delete');
            defaulateCollection = 'article';
            delBtn.on('click', callback);
            function callback(){
                var listItem = $(this).parent().parent();
                var id = listItem.attr('data-id');
                json = {
                    id: id
                };
                plugs.deleteDetail(defaulateCollection, json, function(result){
                    if(result.ok == 1){
                        window.location.reload();
                    }
                })
            }
        }
    };
    app.paging();
    app.deleteDetail();
});