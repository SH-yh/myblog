var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('index');
});
router.get('/article', function(req, res, next){
    res.render('article');
});
router.get('/demo', function(req, res, next){
    res.render('demo');
});
router.get('/board', function(req, res, next){
    res.render('board');
});
module.exports = router;
