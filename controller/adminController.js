var fs = require('fs'),
    zlib = require('zlib'),
    path = require('path'),
    unzip = require('unzip');
var model = require('../model/db'),
    assist = require('./assist'),
    formidable = require('formidable');
//登陆界面渲染
exports.renderLogin  = function(req, res, next){
    res.render('admin/login', {
        error : 0
    });
    res.end();
};
//初始界面渲染
exports.renderIndex = function(req, res, next){
    var defaultCollection_A = 'admin',
        defaultCollection_B = 'article',
        defaultAmount = 12,
        defaultPage = 0,
        sort = {"date": -1};
    model.findDocument(defaultCollection_A, {}, {}, {}, function(result){
        model.findDocument(defaultCollection_B, {},  {amount: defaultAmount, page: defaultPage}, sort,function(doc){
            model.findCount(defaultCollection_B, {}, function(count){
                res.render('admin/index', {
                    info : result,
                    details: doc,
                    type: "",
                    typeTag: "parentTag",
                    pageSum : Math.ceil(count / defaultAmount)
                });
                res.end();
            });
        });
    });
};
//文章编辑发表界面渲染
exports.renderEdit = function(req, res, next){
    var defaultCollection_A = 'admin',
        defaultCollection_B = 'article',
        defaultCollection_C = 'classify',
        queryJson;
    queryJson = assist.security({id: req.params.id}) || {};
    model.findDocument(defaultCollection_A, {}, {}, {}, function(info){
        model.findDocument(defaultCollection_B, queryJson, {}, {}, function(articleContent){
            model.findDocument(defaultCollection_C, {}, {}, {}, function(classify){
                res.render('admin/edit', {
                    info : info,
                    articleContent: articleContent[0],
                    classify: classify,
                });
                res.end();
            });
        });
    });
};
exports.renderPublish = function(req, res, next){
    var defaultCollection_A = 'admin',
        defaultCollection_B = 'classify';
    model.findDocument(defaultCollection_A, {}, {}, {}, function(info){
        model.findDocument(defaultCollection_B, {}, {}, {}, function(classify){
            res.render('admin/publish', {
                info : info,
                classify: classify,
            });
            res.end();
        });
    });
};
exports.renderCategory = function(req, res, next){
    var defaultCollection_A = 'classify',
        defaultCollection_B = 'admin';
    model.findDocument(defaultCollection_A, {}, {}, {}, function(classify){
        model.findDocument(defaultCollection_B, {}, {}, {}, function(info){
            res.render('admin/category', {
                info:info,
                classify: classify
            });
        });
    });
};
exports.renderAdminCases = function(req, res, next){
        var defaultCollection_A = "cases",
            defaultCollection_B = 'admin';
        var  defaultAmount = 8,
            defaultPage = 0;
        model.findDocument(defaultCollection_B, {}, {}, {}, function(info){
            model.findDocument(defaultCollection_A, {}, {amount: defaultAmount, page: defaultPage}, {}, function(caseInfo){
                model.findCount(defaultCollection_A, {}, function(count){
                    res.render('admin/case', {
                        info:info,
                        caseInfo:caseInfo,
                        type: "",
                        typeTag: "parentTag",
                        pageSum : Math.ceil(count / defaultAmount)
                    });
                });
            });
        });

};
//登陆验证
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
/*从数据库中删除某些数据*/
exports.deleteSomething = function(collectionName, json, next, callback){
    model.deleteDocument(collectionName, json, function(result){
        if(callback){
            callback(result);
        }
    });
};
//更新
exports.updateArticle = function(req, res, next){
    var defaultCollection = req.params.type,
        updateStr = assist.security(req.body),
        whereStr = {"id": updateStr.id};
    model.updateDocument(defaultCollection,whereStr,updateStr, function(result){
        res.json({ok:result.ok});
    })
};
exports.insertArticle = function(req, res, next){
    var defaultCollection = req.params.type,
        insertStr = assist.security(req.body);
    model.findCount(defaultCollection, {}, function(count){
        model.insertDocument(defaultCollection, insertStr, function(result){
            res.json({ok:result.ok});
            res.end();
        });
    });
};
exports.insertClassify = function(req, res, next){
    var defaultCollection = req.params.type,
        insertStr = assist.security(req.body);
    model.insertDocument(defaultCollection, insertStr, function(result){
        res.json({ok:result.ok});
        res.end();
    });
};
exports.querySomething = function(req, res, next){
    var defaultCollection = req.params.type,
        queryJson = assist.security(req.body);
    model.findDocument(defaultCollection,queryJson,{},{},function(result){
        res.json(result[0]);
        res.end();
    })
};
//更新文章列表
exports.updateCategory = function(req, res, next,callback){
    var defaultCollection = "classify",
        updateStr = assist.security(req.body),
        whereStr = {"mark": updateStr.mark};
    model.updateDocument(defaultCollection,whereStr,updateStr, function(result){
        if(callback){
            callback(result)
        }else {
            res.json({ok: result.ok});
        }
    })
};
exports.addCaseItem = function(req, res, next){
    var collectionName = "cases";
    var form = new formidable.IncomingForm();
    var uploadPath = path.resolve(__dirname + "/../views/upload/demo/cases/");
    form.uploadDir = uploadPath;
    form.parse(req, function(err, fields, files){
        err && res.render('404');
        var casePic = files.casePic,
            caseFiles = files.caseFiles,
            caseTile = fields.caseTitle,
            caseName =fields.caseName,
            caseContent = fields.caseContent;
        var picPath = casePic.path,
            filePath = caseFiles.path;
        var fileExtname = path.extname(caseFiles.name);
        var newFile = filePath+fileExtname;
        //将图片移动到相应文件夹
        var newPicPath = path.resolve(__dirname + "/../views/upload/demo/casesImg/")+"/"+casePic.name;
        fs.rename(picPath,newPicPath,function(err){
            if(err) {
                res.render('404');
            }else{
                console.log(filePath,newFile);
                fs.rename(filePath,newFile,function(err){
                    if(err) {
                        res.render('404');
                        return;
                    }else if(/[rar|zip|cab|arj|lzh|ace|tar|gzip|uue|bz2|jar|iso|z]$/g.test(fileExtname)){
                        var caseCollection = {
                            "id" : +new Date() + "",
                            "name" : caseName,
                            "title" : caseTile,
                            "imgSrc" : "/storage/casesImg/"+casePic.name,
                            "content" : caseContent,
                            "introduce" : caseContent.substr(1, 20)
                        };
                        var readStream = fs.createReadStream(newFile);
                        readStream.pipe(unzip.Extract({ path: uploadPath }));

                        model.insertDocument(collectionName, caseCollection, function(result){
                            if(result.n == 1 && result.ok == 1) {
                                fs.unlink(newFile, function(){
                                    res.redirect('/admin/cases');
                                })
                            }
                        });

                    }
                });
            }
        });
    })
};