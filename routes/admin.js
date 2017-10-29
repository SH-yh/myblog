var express = require('express');
    router = express.Router(),
    controller = require('../controller/adminController');
/* GET users listing. */
//登陆验证
router.post('/login', function(req, res, next){
    controller.checkLogin(req, res, next);
});
//做未登录验证筛查
router.all("*", function(req, res, next){
    if(!req.session.loginMark){
        controller.renderLogin(req, res, next);
    }else{
        next();
    }
});

//初始界面
router.get('/', function(req, res, next) {
    controller.renderIndex(req, res, next);
});

//登陆界面
router.get('/login', function(req, res, next){
    controller.renderLogin(req, res, next);
});
//文章编辑
router.get('/edit/:id', function(req, res, next){
    controller.renderEdit(req, res, next);
});
//文章发表
router.get('/publish', function(req, res, next){
    controller.renderPublish(req, res, next);
});
//文章删除
router.post('/del/:type/:id', function(req, res, next){
    controller.deleteSomething(req, res, next);
});
//编辑文章
router.post('/update/:type', function(req, res, next){
    controller.updateArticle(req, res, next);
});
//发表文章
router.post('/edit/:type', function(req, res, next){
    controller.insertArticle(req, res, next);
});
//分页显示
router.post('/query/:type', function(req, res, next){
    controller.querySomething(req, res, next);
});
module.exports = router;
