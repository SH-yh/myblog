/**
 * Created by HJ on 2017/10/17.
 */
var model = require("../model/db");
var assit = require("./assist");
/*渲染文章条目*/
exports.renderArticleList = function(req, res, next){
    var defaultAmount = 6,
        defaultDocument = "article",
        page = req.query.page || 0,
        type =  req.params.type || "",
        sort = {"date": -1};
    model.findDocument('classify', {}, {}, {}, function(classify){
        var queryJson = assit.getType(type, classify);
        if(queryJson){
            var articleType = queryJson.type ? 'type' : 'parentTag';
            model.findCount(defaultDocument, queryJson, function(sum){
                model.findDocument(defaultDocument, queryJson, {amount: defaultAmount, skip: page}, sort, function(doc) {
                    res.render('front/article', {
                        "content": doc,
                        "classify": classify,
                        "pageSum": Math.ceil(sum / defaultAmount),
                        "typeTag": articleType,
                        "type": type
                    });
                    res.end();
                })
            });
        }else {
            res.render('404');
            res.end();
        }
    });
};
/*渲染文章内容*/
exports.renderArticleContent = function(req, res, next){
    var id = req.params.id,
    defaultDocument = "article";
    model.findDocument(defaultDocument,{"id": id}, {}, {}, function(doc){
        res.render("front/articleContent", {
            "content": doc[0]
        });
    });
};
/*分页功能*/
exports.replyPaging = function(req, res, next){
    var defaultDocument = req.params.typeTag || "article";
    var queryBody = req.body,
        page = parseInt(queryBody.page),
        defaultAmount = parseInt(queryBody.amount),
        sort = {"date": -1};
    delete queryBody.page;
    delete queryBody.amount;
    var queryJson = queryBody.parentTag == "all" ? {} : queryBody;
    model.findDocument(defaultDocument, queryJson, {amount: defaultAmount, skip: page}, sort, function(content){
        res.json({doc: content});
    });
};
exports.renderHome = function(req, res, next){
    res.render('front/index');
    res.end();
};
exports.renderDome = function(req, res, next){
    var defaultCollection = "cases",
        defaultAmount = 8,
        page = req.query.page || 0,
        queryJson = {};
    model.findCount(defaultCollection, {}, function(count){
        model.findDocument(defaultCollection, queryJson, {amount: defaultAmount, skip: page}, {},function(content){
            res.render('front/demo', {
                "pageSum" : Math.ceil(count / defaultAmount),
                "typeTag": "parentTag",
                "type" : "",
                "content" : content
            });
            res.end();
        });
    });
};
exports.renderBoard = function(req, res, next){
    res.render('front/board');
    res.end();
};
