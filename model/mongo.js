'use strict';

/**
 * node-mongodbのドキュメント
 * http://mongodb.github.io/node-mongodb-native/2.0/
 */
var db;
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var conf = require('../config/dbConfig.js');

// Connection URL
var url = 'mongodb://' + conf.dbHost + ':' + conf.dbPort + '/' + conf.dbName;
// Use connect method to connect to the Server

function connect(callback) {
    MongoClient.connect(url, function(err, mongodb) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db = mongodb.db(conf.dbName);

        if (err) {
            callback(1)
        } else {
            callback(0)
            db.collection("ClassMates", function(outer_error, collection) {
                collection.find({}).toArray(function(inner_error, list) {
                    console.log(inner_error)
                    console.log(list)
                });
            });
        }


    })
}



/**
 * @param collection_name コレクション名
 * @param {json} criteria 検索条件
 * @param {json} projection 項目指定
 * @param callback コールバック関数
 * http://docs.mongodb.org/manual/reference/method/db.collection.find/
 */
function find(collection_name, criteria, projection, callback) {
    db.collection(collection_name, function(outer_error, collection) {
        collection.find({}).toArray(function(inner_error, list) {
            callback(list);
        });
    });
}

/**
 * @param collection_name コレクション名
 * @param {json} document 挿入ドキュメント
 * @param callback コールバック関数
 * http://docs.mongodb.org/manual/reference/method/db.collection.insert/
 */
function insert(collection_name, document, options, callback) {
    db.collection(collection_name, function(outer_error, collection) {
        collection.insert(document, options, function(inner_error, result) {
            callback(result);
        });
    });
}

/**
 * @param collection_name コレクション名
 * @param {json} query 更新条件
 * @param {json} update 更新内容
 * @param {json} options オプション
 * @param callback コールバック関数
 * http://docs.mongodb.org/manual/reference/method/db.collection.update/
 */
function update(collection_name, query, update, options, callback) {
    db.collection(collection_name, function(outer_error, collection) {
        collection.update(query, update, options, function(inner_error, result) {
            callback(result);
        });
    });
}

/**
 * @param collection_name コレクション名
 * @param {json} query 削除条件
 * @param {boolean} justOne
 * @param callback コールバック関数
 * http://docs.mongodb.org/manual/reference/method/db.collection.remove/
 */
function remove(collection_name, query, options, callback) {
    db.collection(collection_name, function(outer_error, collection) {
        collection.remove(query, options, function(inner_error, result) {
            callback(result);
        });
    });
}


function createIfNotExists(collection, callback) {

    db.collections(function(err, collections) {
        console.log('collection is')
        console.log(collection)
            //console.log(collections)

        for (var i in collections) {
            if (collection == collections[i]['s']['name']) {
                console.log("collection is" + collection)
                callback(1);
                return;
            }
        }

        db.createCollection(collection, function(err, result) {
            if (err) throw err;
            callback(0);
        });


    });

}

module.exports = {
    find: find,
    insert: insert,
    update: update,
    remove: remove,
    createIfNotExists: createIfNotExists,
    connect: connect
}