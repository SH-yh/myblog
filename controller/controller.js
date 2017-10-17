/**
 * Created by HJ on 2017/10/17.
 */
var model = require("../model/db");
/*渲染文章条目*/
exports.renderArticle = function(req, res, next){
    var defaultAmount = 8,
        defaultDocument = "article";
        page = req.query.page || 0;
    model.findDocument(defaultDocument, {}, {amount: defaultAmount, skip: page}, function(doc){
        var content = doc;
        model.findDocument("classify", {}, {}, function(classify){
            res.render('article', {
                "content" : content,
                "classify" : classify
            });
            res.end();
        });
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