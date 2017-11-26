/*进行数据库连接与增删查改*/
var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://localhost:27017/blog";
//数据库连接
function _connecteMongo(callback){
    MongoClient.connect(dbUrl, function(err, db){
        if(err){
            throw new Error(err);
            return;
        }
        if(callback){
            callback(db);
        }
    });
}
exports.findDocument = function(collectionName, queryJson, queryConfig, sort, callback){
    var queryMount = queryConfig.amount || 0,
        page = queryConfig.skip * queryMount || 0,
        sort = sort || {};
    _connecteMongo(function(db){
        db.collection(collectionName).find(queryJson).limit(queryMount).skip(page).sort(sort).toArray(function(err, doc){
            if(err){
                throw new Error(err);
                db.close();
                return;
            }
            if(callback){
                callback(doc);
                db.close();
                return;
            }
        });
    });
};
exports.findOneDocument = function(collectionName,queryJson,projection,callback){
    var queryJson = queryJson || {},
        projection = projection || {};
    _connecteMongo(function(db){
        db.collection(collectionName).findOne(queryJson,projection, function (err, data) {
            if(err){
                throw new Error(err);
                db.close();
                return;
            }else{
                if(callback){
                    callback(data)
                }
            }
      });
    });
};
/*查找总数*/
exports.findCount = function(collectionName,  queryJson, callback){
    _connecteMongo(function(db){
        db.collection(collectionName).count(queryJson,{}, function(err, sum){
            if(err){
                db.close();
                throw new Error(err);
            }
            if(callback){
                callback(sum);
                db.close();
                return;
            }
        });
    });
};
/*admin登陆验证*/
exports.checkMessage = function(collectionName, queryJson, callBack){
    _connecteMongo(function(db){
        db.collection(collectionName).findOne(queryJson, function(err, result){
            if(err){
                throw new Error(err);
                db.close();
                return;
            }
            if(callBack){
                callBack(result);
            }
            db.close();
        });
    })
};
//从数据库中删除某条数据
exports.deleteDocument = function(collectionName, json, callback){
    _connecteMongo(function(db){
        db.collection(collectionName).deleteOne(json, function(err, result){
            if(err){
                throw new Error(err);
                db.close();
            }else {
                if(callback){
                    callback(result.result);
                    db.close();
                }
            }
        })
    });
};
//更新
exports.updateDocument = function(collectionName, whereStr, setJson, callback){
    var updateStr = {$set: setJson};
    _connecteMongo(function(db){
        db.collection(collectionName).update(whereStr, updateStr, function(err, result){
            if(err){
                throw new Error(err);
                db.close();
            }else {
                if(callback){
                    callback(result.result);
                    db.close();
                }
            }
        })
    })
};
//插入
exports.insertDocument = function(collectionName, insertStr, callback){
    _connecteMongo(function(db){
        db.collection(collectionName).insertOne(insertStr, function(err, result){
            if(err){
                throw new Error(err);
                db.close();
            }else {
                if(callback){
                    callback(result.result);
                    db.close();
                }
            }
        })
    })
};