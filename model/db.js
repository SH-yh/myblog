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
exports.findDocument = function(collectionName, queryJson, queryConfig, callback){
    var queryMount = queryConfig.amount || 0,
        page = queryConfig.skip * queryMount || 0;
    _connecteMongo(function(db){
        db.collection(collectionName).find(queryJson).limit(queryMount).skip(page).toArray(function(err, doc){
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