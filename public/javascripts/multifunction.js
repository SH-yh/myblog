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
                targetItem = $('.select-page'),
                defaultUrl = '',
                mark = false, //消失
                born = true,
                defaultType = $('.page-container').attr('data-type') || "all",
                defaultParent = $('.page-container').attr('data-parentTag'),//用来确定是不是父标签
                pageSum = parseInt($('.page-sum').html());
                queryJson = {};
            var back = $(defaultBaCK),
                next = $(defaultNext),
                pageIndex = 0;
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
            targetItem.on('change', changeTargetVal);
            //改变页码
            function trunPage(e){
                var target = e.target;
                pageIndex = target == back[0] ?  pageIndex-1 : pageIndex+1;
                pageIndex = pageIndex % pageSum;
                if(pageIndex < 0){
                    pageIndex = pageSum - 1;
                }
                changeNumber();
                //进行ajax传输
                fetch();
            }
            function changeTargetVal(){
                var page = $(this).val();
                if(cheackInput(page, pageSum)){
                    if(born){
                        generWarn();
                    }else{
                        $('#warn').fadeIn(500);
                        mark = !mark;
                    }
                    targetItem.attr('disabled', true);
                    return;
                }
                pageIndex = page - 1;
                fetch();
            }
            function cheackInput(val, target){
                var min = 0;
                if(val > target){
                    return true;
                }else if(val <= min){
                    return true;
                }else if(String(val).indexOf('.') != -1){
                    return true;
                }else if(isNaN(val)){
                    return true;
                }else {
                    return false;
                }
            }
            function displayWarn(id){
                var warn =  $("#"+id);
                warn.on('click',function(){
                    if(!mark) {
                        $(this).fadeOut(500);
                        targetItem.attr('disabled', false);
                    }else{
                        $(this).fadeIn(500);
                        targetItem.attr('disabled', true);
                    }
                    mark = !mark;
                });
            }
            function generWarn(){
                if(born){
                    var id = 'warn';
                    var div = document.createElement('div');
                    div.id = id;
                    div.style.cssText = "position:fixed;width:200px;height:80px;top:0;border:1px solid #333;"+
                        "right:0;bottom:0;left:0;padding:10px 25px;margin:auto;background:#0076A4;text-align:center;"+
                        "line-height:40px;color:#fff";
                    div.innerHTML = "查无此页，请重新输入<br/>点击隐藏";
                    $('body').append(div);
                    displayWarn(id);
                    born = false;
                }
            }
            //改变按钮颜色
            function changeNumber(){
                targetItem.val(pageIndex+1);
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