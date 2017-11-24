
requirejs.config({
    baseUrl: '/javascripts/',
    shim: {
        'quill' :{
            exports: 'Qui'
        },
        'underscore': {
            exports: "_"
        }
    }
});
requirejs(["quill","underscore","https://code.jquery.com/jquery-1.9.1.min.js"], function(Quill){
    (function(){
        var app = {
            richEdit: function(){
               var toolbarOptions = [
                   [{ 'font': [] },{ 'size': ['small', false, 'large', ] }],
                   ['bold', 'italic', 'underline', 'strike', { 'align': [] }, { 'color': [] }, { 'background': [] }],
                   [{ 'header': 1 }, { 'header': 2 }],
                   [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                   [{ 'script': 'sub'}, { 'script': 'super' }],
                   [{ 'indent': '-1'}, { 'indent': '+1' }],
                   [{ 'direction': 'rtl' }],
                   ['blockquote', 'code-block','clean']
               ];
               new Quill('#editor', {
                   theme: 'snow',
                   modules: {
                       toolbar:  toolbarOptions
                   },
               });
           },
            editPublish: function(){
                var publishBtn = $('#publish'),
                    saveBtn = $('#save'),
                    cancelBtn = $('#cancel');
                publishBtn.on('click', app.startFetch);
                saveBtn.on('click', app.save);
                cancelBtn.on('click', app.cancelPublish);
            },
            cancelPublish: function(){
                window.localStorage.removeItem('doc');
                window.location.href = "/admin/";
            },
            save: function(){
                var json = app.getJson();
                window.localStorage.setItem('doc', JSON.stringify(json));
            },
            getJson: function(){
                var articleContainer = $('#article_title'),
                    articleTitle = articleContainer.val(),
                    articleId = articleContainer.attr('data-id') || "",
                    articleContent = $('.ql-editor').html(),
                    parentType = $('.parentType:checked').val(),
                    type = $('.childrenType:checked').val() || parentType,
                    abstract = $('#txtDesc').val(),
                    author = $('#author').attr('data-author'),
                    date = app.getDate();
                return {
                    "id" : articleId,
                    "type" : type,
                    "parentTag" : parentType,
                    "author" : author,
                    "title" : articleTitle,
                    "content": articleContent,
                    "abstract" : abstract,
                    "date" : date
                };
            },
            check: function(item){
                for(var key in item){
                    if(key == "id" && item[key] == ""){
                        continue;
                    }
                    if(item[key] == ""){
                        return false;
                    }
                }
                return true;
            },
            getDate: function(){
                var date = new Date(),
                    year = date.getFullYear(),
                    month = date.getMonth() + 1;
                    day = date.getDate();
                return year+"-"+month+"-"+day;
            },
            fetch: function(url, json){
                $.ajax({
                    url: url,
                    data: json,
                    method: "POST",
                    success: function(result){
                        if(result.ok){
                            window.location.href="/admin/"
                        }
                    },
                    error: function(){
                        console.log(result);
                    }
                });
            },
            setUrl: function(id){
                if(id){
                    return '/admin/update/article'
                }else{
                    return '/admin/edit/article'
                }
            },
            startFetch: function(){
                var json = app.getJson();
                if(!app.check(json)){
                    var warnMessage = "请填写完整！";
                    $('#warn').text(warnMessage);
                    return;
                };
                var url = app.setUrl(json.id);
                if(!json.id){
                    json.id = app.generId();
                }
                app.fetch(url, json)
            },
            generId : function(){
                var date = new Date(),
                    year = date.getFullYear().toString().substr(2,2),
                    month = (date.getMonth() + 1).toString(),
                    hour = date.getHours().toString(),
                    min = date.getMinutes().toString(),
                    sec = date.getSeconds().toString();
                var id = year+month+hour+min+sec;
                return id;
            },
            toggleRadio: function(){
                $('.parentType').on('focus', app.toggle);
            },
            toggle: function(){
                var defaulteTemplate = '<li class="specific-classify-item">'+
                    '<label for="<{=childrenContent.mark}>">'+
                    '<input class="childrenType"'+
                    'id=<{=childrenContent.mark}> type="radio" name="childrenClassify" value=<{=childrenContent.mark}>>'+
                    '<{=childrenContent.type}>'+
                    '</label>'+
                    '</li>';
                var queryUrl = '/admin/query/classify',
                    type = $(this).val(),
                    json = {"mark": type};
                $.ajax({
                    url: queryUrl,
                    method: 'POST',
                    data:json,
                    success: function(result){
                        var container = $('#children_classify'),
                            childrenType = result.children;
                        if(childrenType){
                            var len = childrenType.length,
                                compiled = _.template(defaulteTemplate);
                            container.html("");
                            for(var i = 0; i < len; i++){
                                var type = childrenType[i];
                                var html = compiled({
                                    childrenContent: type
                                });
                                container.append(html);
                            }
                        }else{
                            container.html('无子类别');
                        }

                    },
                    error: function(err){
                        throw new Error(err);
                    }
                });
            },
            start : function(){
                this.richEdit();
                this.editPublish();
                this.toggleRadio();
            }
        };
        app.start();
    })()
});