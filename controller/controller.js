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
        type =  req.params.type || "";
    model.findDocument('classify', {}, {}, function(classify){
        var queryJson = assit.getType(type, classify);
        if(queryJson){
            var articleType = queryJson.type ? 'type' : 'parentTag';
            model.findCount(defaultDocument, queryJson, function(sum){
                model.findDocument(defaultDocument, queryJson, {amount: defaultAmount, skip: page}, function(doc) {
                    res.render('article', {
                        "content": doc,
                        "classify": classify,
                        "pageSum": Math.ceil(sum / defaultAmount),
                        "articleType": articleType,
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
    model.findDocument(defaultDocument,{"id": id}, {}, function(doc){
        res.render("articleContent", {
            "content": doc[0]
        });
    });
};
/*分页功能*/
exports.replyPaging = function(req, res, next){
    var defaultAmount = 6,
        defaultDocument = "article";
    var queryBody = req.body,
        page = parseInt(queryBody.page);
    delete queryBody.page;
    var queryJson = queryBody.parentTag == "all" ? {} : queryBody;
    model.findDocument(defaultDocument, queryJson, {amount: defaultAmount, skip: page}, function(classify){
        res.json({doc: classify});
    });
};
exports.renderHome = function(req, res, next){
    res.render('index');
    res.end();
};
exports.renderDome = function(req, res, next){
    res.render('demo');
    res.end();
};
exports.renderBoard = function(req, res, next){
    res.render('board');
    res.end();
};