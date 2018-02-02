var model = require("../model/db");
var assit = require("./assist");
var path = require('path');
var fileName = "";
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
                    model.findOneDocument('admin',{},{name:1}, function(data){
                            res.render('front/article', {
                                "ownerName":data.name,
                                "content": doc,
                                "classify": classify,
                                "pageSum": Math.ceil(sum / defaultAmount),
                                "typeTag": articleType,
                                "type": type,
                                "index": 1
                            });
                        res.end();
                    })
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
        model.findOneDocument('admin',{},{name:1}, function(data){
                res.render("front/articleContent", {
                    "ownerName":data.name,
                    "content": doc[0],
                    "index": 1
                });
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
    model.findOneDocument('admin',{},{name:1}, function(data){
        res.render('front/index',{
            ownerName:data.name,
            index: 0
        });
        res.end();
    });
};
exports.renderDome = function(req, res, next){
    var defaultCollection = "cases",
        defaultAmount = 8,
        page = req.query.page || 0,
        queryJson = {};
    model.findCount(defaultCollection, {}, function(count){
        model.findDocument(defaultCollection, queryJson, {amount: defaultAmount, skip: page}, {},function(content){
            model.findOneDocument('admin',{},{name:1}, function(data){
                res.render('front/demo', {
                    "ownerName":data.name,
                    "pageSum" : Math.ceil(count / defaultAmount),
                    "typeTag": "parentTag",
                    "type" : "",
                    "content" : content,
                    "index": 2
                });
                res.end();
            });
        });
    });
};
exports.renderCase = function(req, res, next){
    var defaultCollection = 'cases',
        id = req.params.caseId;
    var queryJson = {"id" :id.toString()};
    model.findOneDocument(defaultCollection, queryJson, {}, function(result){
        model.findOneDocument('admin',{},{name:1}, function(data){
            res.render('front/caseShow',{
                ownerName:data.name,
                caseId: id,
                index:2,
                caseContent: result.content,
                caseName:result.name
            });
            res.end();
        });
    });
};
exports.renderCaseShow = function(req, res, next){
    var params = req.params;
    var caseName = params.caseName,
        fileType = params.fileType;
    var basePath = 'upload/demo/cases/',
        filePath = "";
    var extname = path.extname(caseName);
    if(fileType || extname){
        var contentPath = path.dirname(__dirname)+"/views/";
        var dirFilePath = contentPath + basePath + fileName +"/" +caseName+"/"+ fileType,
            dirPath = contentPath + basePath +fileName+"/" +caseName;
        filePath = extname ? dirPath : dirFilePath;
        res.sendFile(filePath, function(err){
            if (err) {
                res.status(err.status).end();
            }
            res.end();
        });
    }else{
        fileName = caseName;
        filePath = path.dirname(__dirname)+"/views/"+basePath+caseName + "/index.html";
        res.sendFile(filePath, function(err){
            if (err) {
                res.status(err.status).end();
            }
            res.end();
        });
    }
};
exports.renderBoard = function(req, res, next){
    model.findOneDocument('admin',{},{name:1}, function(data){
        res.render('front/board', {
            "index": 3,
            ownerName:data.name,
        });
        res.end();
    });
};
exports.sendFile = function(req, res, next){
    var params = req.params;
    var basePath = 'upload/demo/';
    var file = params.file;
    var fileName = params.fileName;
    var contentPath = path.dirname(__dirname)+"/views/"+basePath+fileName+"/"+file;
    res.sendFile(contentPath, function(err){
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        res.end();
    });
};
exports.renderResume = function(req, res, next){
    res.render('front/resume');
};