requirejs.config({
    baseUrl : '/javascripts/',
    shim : {
        "underscore": {
            exports: "_"
        }
    }
});
requirejs(["https://code.jquery.com/jquery-1.9.1.min.js", "multifunction"], function(){
    $(function(){
        var cases = {
            start: function(){
                this.upFile();
                this.paging();
            },
            paging: function(){
                var defaluteTemplate = '<li class="case-item">'+
                    '<span class="case-title"><{=content.title}></span>'+
                    '<div class="btn-wrap">'+
                    '<span class="handle-btn edit" data-id=<{=content.id}>>编辑</span>'+
                    '<span class="handle-btn delete" data-id=<{=content.id}>>删除</span>'+
                    '</div>'+
                    '</li>';
                var defaultCollection = "cases",
                    amount = 8;
                plugs.paging(defaluteTemplate, defaultCollection, amount, function(){
                    var deleteBtn = $(".delete");
                    deleteBtn.on("click", cases.handleDelete);
                });
            },
            upFile: function(){
                var casePicBtn = $("#casePic"),
                    caseFilesBtn = $("#caseFiles"),
                    submitBtn = $("#submit"),
                    deleteBtn = $(".delete"),
                    closeFormBtn = $("#form_close"),
                    showFormBtn = $("#show_btn");
                casePicBtn.on('change', this.handleUploadFile);
                caseFilesBtn.on('change', this.handleUploadFile);
                submitBtn.on("click", this.handleSubmit);
                deleteBtn.on("click", this.handleDelete);
                closeFormBtn.on("click", this.handleFormStatus);
                showFormBtn.on("click", this.handleFormStatus)
            },
            handleUploadFile: function(e){
                var file = this.files;
                var fileName = this.files[0].name,
                    fileWrap = $('#upload_item_show');

                switch(e.target.id){
                    case "casePic":
                        if(file[0].type.indexOf("image") == -1){
                            alert("请上传图片");
                            return;
                        };
                        break;
                    default:
                        break;
                }
                fileWrap.append("<span class='upload-item'>"+fileName+"</sapn>");
            },
            handleSubmit: function(e){
                var textInput = $("input[type='text']");
                var textAreaValue = $("textarea").val();
                var casePicValue = $("#casePic").val(),
                    caseFilesValue = $("#caseFiles").val();
                var length = textInput.length;
                for(var i = 0; i < length; i++){
                    var item = textInput[i];
                    if(item.value == "" || textAreaValue==""){
                        alert("请填写完整!");
                        e.preventDefault();
                        return false;
                    }else if(caseFilesValue == "" || casePicValue == ""){
                        alert("请上传文件!");
                        e.preventDefault();
                        return false;
                    };
                }
                return true;
            },
            handleDelete: function(e){
                var self = $(this);
                var caseId = self.attr("data-id");
                defaulateCollection = 'cases';
                json = {
                    id: caseId
                };
                plugs.deleteDetail(defaulateCollection, json, function(result){
                    if(result.ok == 1){
                        window.location.reload();
                    }
                })
            },
            handleFormStatus: function(e){
                var formWrap = $("#form_container");
                switch(e.target.id){
                    case "form_close":
                        formWrap[0].style.display = "none";
                        break;
                    case "show_btn":
                        formWrap[0].style.display = "block";
                        break;
                    default:
                        break;
                }

            }
        };
        cases.start();
    });
});