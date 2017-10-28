
requirejs.config({
    baseUrl: '/javascripts/',
    shim: {
        'quill' :{
            exports: 'Quill'
        }
    }
});
requirejs(["quill"], function(Quill){
    (function(){
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
    })()
});