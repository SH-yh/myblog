requirejs(["https://code.jquery.com/jquery-1.9.1.min.js"], function(){
    $(function(){
        var app = {
            mark: true,
            childrenMark: "",
            handle: function(){
                var editBtn = $('.edit'),
                    addBtn = $('.add'),
                    newAddBtn = $('#newAdd');
                editBtn.on('click', this.handleEdit);
                addBtn.on('click', this.handleAdd);
                newAddBtn.on('click', this.handleNewType);
            },
            handleCommon: function(item){
                var self = $(item);
                    item = self.parent().siblings().find('.type-item');
                var json = {
                    "type": "",
                    "mark": "",
                    "children": [],
                    "childrenMark" : app.childrenMark
                };
                item.each(function(){
                    var self = $(this);
                    var value = self.html();
                    var attr = self.attr('data-relation'),
                        mark = self.attr("data-mark");
                    if(attr == 'parent'){
                        json.type = value;
                        json.mark = mark;
                    }else if(attr == 'children'){
                        json.children.push({
                            "type": value,
                            "mark": mark
                        });
                    }
                });
                return json;
            },
            handleEdit: function(){
                var self = $(this),
                    defaultActive = 'enable',
                    defaultContent = "编辑",
                    activeContent = "保存",
                    typeItem = self.parent().siblings().find('.type-item'),
                    editBtn = $('.edit'),
                    addBtn = $('.add');
                addBtn.off('click');
                editBtn.off('click');
                self.on('click', app.handleEdit);
                if(app.mark){
                    app.handleDelete(this);
                    self.addClass(defaultActive).html(activeContent);
                    typeItem.attr('contenteditable', true);
                    app.mark = false;
                }else{
                    var url = '/admin/category/article/del',
                        json = app.handleCommon(this);
                    self.removeClass(defaultActive).html(defaultContent);
                    typeItem.attr('contenteditable', false);
                    self.off('click');
                    app.fetch(url, json, function(){
                        addBtn.on('click', app.handleAdd);
                        editBtn.on('click', app.handleEdit);
                        app.mark = true;
                    });
                }
            },
            handleDelete: function(that){
                var typeItem = $('.type-item');
                typeItem.on('click', handle);
                function handle(){
                    var self = $(this);
                    var deleteBtn = self.next();
                    deleteBtn.fadeIn();
                    deleteBtn.on('click', judge(self));
                }
                function judge(item){
                    var type = item.attr("data-relation"),
                        mark = item.attr("data-mark"),
                        parent,
                        parents,
                        index,
                        url,
                        json = null;
                    return function(){
                        if(type == "parent"){
                            parent = item.parents('li');
                            parents = parent.parent();
                            index = parent.index();
                            url = "/admin/del/classify";
                            url = url,
                            json = {"mark":mark};
                            parents.children(parent).eq(index).remove();
                            app.fetch(url, json);
                            return;
                        }else if(type == "children"){
                            app.childrenMark = mark;
                            parents = item.parents('div.typeWarp');
                            parent = item.parent();
                            index = parent.index();
                            parents.children(parent).eq(index).remove();
                        }
                    }
                }
            },
            handleAdd: function(){
                var self = $(this);
                var defaultActive = 'enable',
                    defaultContent = "添加",
                    activeContent = "保存",
                    typeItem = self.parent().siblings().find('.type-item'),
                    addBtn = $('.add'),
                    editBtn = $('.edit');
                editBtn.off('click');
                addBtn.off('click');
                self.on('click', app.handleAdd);
                if(app.mark){
                    self.addClass(defaultActive).html(activeContent);
                    var typeWrap = self.parent().prev().find('.typeWarp');
                    var html =
                        '<div class="type-container">'+
                            '<span data-relation = "children" id="newTypeItem" contenteditable = "true" class="type-item"  data-mark="">类型</span>'+
                            '<span data-relation = "children" contenteditable = "true"  class="type-item" id="mark"  data-mark="">代号</span>'+
                        '</div>';

                    typeWrap.append(html);
                }else{
                    var url = '/admin/category/article/update',
                        json;
                    self.removeClass(defaultActive).html(defaultContent);
                    typeItem.attr('contenteditable', false);
                    $('#newTypeItem').attr('data-mark', $("#mark").html());
                    typeItem.remove("#mark");
                    json = app.handleCommon(this);
                    self.off('click');
                    app.fetch(url, json, function(){
                        addBtn.on('click', app.handleAdd);
                        editBtn.on('click', app.handleEdit);
                        window.location.reload();
                    });
                }
                app.mark = !app.mark;
            },
            handleNewType: function(){
                var newType = $('.newType'),
                    mark = true,
                    url = '/admin/new/classify';
                var data = {
                    "type": "",
                    "mark": "",
                    "children": []
                };
                newType.each(function(){
                    if($(this).val() == ""){
                        mark = false;
                    }
                });
                if(mark){
                    $('.warn').fadeOut();
                    data.type = $('.newType[name=type]').val();
                    data.mark = $('.newType[name=mark]').val();
                    app.fetch(url, data, function(){
                        window.location.reload();
                    });
                }else{
                    $('.warn').fadeIn();
                }
            },
            fetch: function(url, data, callback){
                $.ajax({
                    url: url,
                    method: "POST",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(data),
                    success: function(result){
                        if(callback && result.ok){
                            callback();
                        }
                    },
                    error: function(){
                        if(callback){
                            callback();
                        }
                    }
                });
            },
            start: function(){
                this.handle()
            }
        };
        app.start()
    });
});
