var express = require('express');
    router = express.Router(),
    controller = require('../controller/adminController');
/* GET users listing. */
router.get('/', function(req, res, next) {
    if(req.session.loginMark){
        controller.renderIndex(req, res, next);
    }else {
        res.redirect('/admin/login');
    }
});
router.get('/login', function(req, res, next){
    controller.renderLogin(req, res, next);
});
router.post('/login', function(req, res, next){
    controller.checkLogin(req, res, next);
});
router.get('/test', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
