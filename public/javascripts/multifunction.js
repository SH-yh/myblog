define(["https://code.jquery.com/jquery-1.9.1.min.js", "underscore" ], function(){
    plugs = {
        goUp : function(id){
            if(id.indexOf('#') == -1) {
                throw new Error("the prameter should is a id");
            }
            var item =  $(id),
                timer = null,
                default_duration = 200,
                duration = default_duration;
            var oHeight = $(window).height();
            var height = oHeight / 4 + oHeight;
            $(window).scroll(function(){
                //防抖处理
                if($(window).scrollTop() > height){
                    if(timer){
                        clearTimeout(timer);
                        duration = duration < 0 ? 14 : duration - 10;
                    }
                    timer = setTimeout(function(){
                        item.animate({
                            "width": "40px",
                            "height": "40px"
                        }, default_duration, function(){
                            duration = default_duration;
                        });
                    }, duration);

                }else if($(window).scrollTop() < oHeight) {
                    if(timer){
                        clearTimeout(timer);
                        duration = duration < 0 ? 14 : duration - 10;
                    }
                    timer = setTimeout(function(){
                        item.animate({
                            "width": "0px",
                            "height": "0px"
                        }, default_duration, function(){
                            duration = default_duration;
                        });
                    }, duration);
                }

            });
            item.click(function(){
                $(window).scrollTop(0);
            });
        },
        paging: function(){
            var defaultBaCK = '#back',
                defaultNext = "#next",
                defaultList = '.page-list',
                defaultActive = 'pageActive',
                defaultUrl = '',
                defaultType = $('.page-container').attr('data-type') || "all",
                defaultParent = $('.page-container').attr('data-parentTag'),//用来确定是不是父标签
                queryJson = {};
            var back = $(defaultBaCK),
                next = $(defaultNext),
                list = $(defaultList),
                pageIndex = 0,
                btnLength = list.length;
            //默认渲染模板
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
                            '<p class="article-date"><{=content.data}></p>'+
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
            back.on('click', trunPage);
            next.on('click', trunPage);
            list.on('click', btnPaging);
            //改变页码
            function trunPage(e){
                var target = e.target;
                pageIndex = target == back[0] ?  pageIndex-1 : pageIndex+1;
                pageIndex = pageIndex % btnLength;
                if(pageIndex < 0){
                    pageIndex = btnLength - 1;
                }
                changeBck();
                //进行ajax传输
                fetch();
            }
            function btnPaging(){
                pageIndex = $(this).attr("data-pageNumber");
                changeBck();
                fetch();
            }
            //改变按钮颜色
            function changeBck(){
                var targetItem = $(list[pageIndex]);
                targetItem.addClass(defaultActive).siblings().removeClass(defaultActive);
            }
            //ajax获取分页数据
            function fetch(){
                defaultUrl = '/article/'+defaultType+'/'+pageIndex;
                queryJson[defaultParent] = defaultType;
                queryJson.page = pageIndex;
                $.ajax(
                    {
                        url: defaultUrl,
                        method: "POST",
                        data: queryJson,
                        success: function(data){
                            var doc = data.doc,
                                len = doc.length,
                                container = $('#article-container');
                            var compiled = _.template(defalutTemplete);
                            container.html('');
                            for(var i = 0; i < len; i++){
                                var html = compiled({
                                    content: doc[i]
                                });
                                container.append(html);
                            }

                        },
                        error: function(err){
                            throw new Error(err);
                        }
                    }
                );
            }
        }
    };
    return plugs;
});