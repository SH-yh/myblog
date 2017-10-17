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
        page = page * queryMount;
        db.collection(collectionName).find(queryJson).limit(queryMount).skip(page).toArray(function(err, doc){
            if(err){
                throw new Error(err);
                return;
            }
            if(callback){
                callback(doc);
                db.close();
                return;
            }
            db.close();
        });
    });
};