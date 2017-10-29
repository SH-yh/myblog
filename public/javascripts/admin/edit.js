
requirejs.config({
    baseUrl: '/javascripts/',
    shim: {
        'quill' :{
            exports: 'Qui'
        }
    }
});
requirejs(["quill", "https://code.jquery.com/jquery-1.9.1.min.js"], function(Quill){
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

            },
            save: function(){

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
                console.log(json);
                if(!app.check(json)){
                    var warnMessage = "请填写完整！";
                    $('#warn').text(warnMessage);
                    return;
                };
                var url = app.setUrl(json.id);
                app.fetch(url, json)
            },
            start : function(){
                this.richEdit();
                this.editPublish();
            }
        };
        app.start();
    })()
});