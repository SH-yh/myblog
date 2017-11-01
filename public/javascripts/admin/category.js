requirejs(["https://code.jquery.com/jquery-1.9.1.min.js"], function(){
    $(function(){
        var app = {
            mark : true,
            handle: function(){
                var editBtn = $('.edit'),
                    deleteBtn = $('.delete'),
                    addBtn = $('.add');
                editBtn.on('click', this.handleEdit);
                deleteBtn.on('click', this.handleDelete);
                addBtn.on('click', this.handleAdd)
            },
            handleCommon: function(item){
                var self = $(item);
                    item = self.parent().siblings().find('.type-item');
                var json = {
                    "type": "",
                    "mark": "",
                    "children": []
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
                    typeItem = self.parent().siblings().find('.type-item');
                if(app.mark){
                    self.addClass(defaultActive).html(activeContent);
                    typeItem.attr('contenteditable', true);
                }else{
                    var url = '/admin/category/update',
                        json = app.handleCommon(this);
                    self.removeClass(defaultActive).html(defaultContent);
                    typeItem.attr('contenteditable', false);
                    self.off('click');
                    app.fetch(url, json, self, app.handleEdit);
                }
                app.mark = !app.mark;
            },
            handleDelete: function(){
               // app.handleCommon(this);
            },
            handleAdd: function(){
                var self = $(this);
                var defaultActive = 'enable',
                    defaultContent = "添加",
                    activeContent = "保存",
                    typeItem = self.parent().siblings().find('.type-item');
                if(app.mark){
                    self.addClass(defaultActive).html(activeContent);
                    var typeWrap = self.parent().prev().find('.typeWarp');
                    var html = '<span data-relation = "children" id="newTypeItem" contenteditable = "true" class="type-item"  data-mark="">类型</span>'+
                        '<span data-relation = "children" contenteditable = "true"  class="type-item" id="mark"  data-mark="">代号</span>';
                    typeWrap.append(html);
                }else{
                    var url = '/admin/category/update',
                        json;
                    self.removeClass(defaultActive).html(defaultContent);
                    typeItem.attr('contenteditable', false);
                    $('#newTypeItem').attr('data-mark', $("#mark").html());
                    typeItem.remove("#mark");
                    json = app.handleCommon(this);
                    self.off('click');
                    app.fetch(url, json, self, app.handleAdd);
                }
                app.mark = !app.mark;
            },
            fetch: function(url, data, item, handle){
                $.ajax({
                    url: url,
                    method: "POST",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(data),
                    success: function(){
                        item.on('click', handle);
                    },
                    error: function(){
                        item.on('click', handle);
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
