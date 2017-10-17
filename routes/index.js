var express = require('express');
var router = express.Router();
var controller = require("../controller/controller");
/* GET home page. */

router.get('/', function(req, res, next) {
    controller.renderHome(req, res, next);
});
/*文章条目显示*/
router.get('/article', function(req, res, next){
    controller.renderArticle(req, res, next);
});
/*文章内容显示*/

router.get('/article/:type/:id', function(req, res, next){
    controller.renderArticleContent(req, res, next);
});

router.get('/demo', function(req, res, next){
    controller.renderDome(req, res, next);
});
router.get('/board', function(req, res, next){
    controller.renderBoard(req, res, next);
});
module.exports = router;
