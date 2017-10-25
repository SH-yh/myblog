/**
 * Created by HJ on 2017/10/25.
 */
var model = require('../model/db'),
    assist = require('./assist');
exports.renderLogin  = function(req, res, next){
    res.render('admin/login', {
        error : 0
    });
    res.end();
};
exports.renderIndex = function(req, res, next){
    var defaultCollection_A = 'admin',
        defaultCollection_B = 'article';
    model.findDocument(defaultCollection_A, {}, {}, function(result){
        model.findDocument(defaultCollection_B, {}, {}, function(doc){
            res.render('admin/index', {
                info : result,
                details: doc
            });
            res.end();
        });
    });
};
exports.checkLogin = function(req, res, next){
    var securityJson = assist.security(req.body),
        defaultCollection = 'admin',
        defaultFallTemplate = 'admin/login',
        defaultSucceed = '/admin/';
    model.checkMessage(defaultCollection, securityJson, function(result){
        if(result){
            req.session.loginMark = true;
            res.redirect(defaultSucceed);
        }else{
            res.render(defaultFallTemplate, {
                error : 1
            });
        }
        res.end();
    });
};
