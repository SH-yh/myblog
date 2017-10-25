var express = require('express');
var router = express.Router();
var controller = require("../controller/controller");
/* GET home page. */

router.get('/', function(req, res, next) {
    controller.renderHome(req, res, next);
});
/*文章条目显示*/
router.get('/article', function(req, res, next){
    controller.renderArticleList(req, res, next);
});
/*具体类型文章条目显示*/
router.get('/article/:type', function(req, res, next){
    controller.renderArticleList(req, res, next);
});
/*文章内容显示*/
router.get('/article/:type/:id', function(req, res, next){
    controller.renderArticleContent(req, res, next);
});
/*分页功能*/
router.post('/:typeTag/:type/:page', function(req, res, next){
    controller.replyPaging(req, res, next)
});
router.get('/demo', function(req, res, next){
    controller.renderDome(req, res, next);
});
router.get('/board', function(req, res, next){
    controller.renderBoard(req, res, next);
});
module.exports = router;
