/**
 *
 * Created by xuzhongwei on 2/4/16.
 */


var mongo = require("../model/mongo.js");
var mongodb = require("mongodb");

module.exports = {
    indexController: function(req,res){

        mongo.find("Articles",{},{},function(doc){
            console.log(doc);
            //res.render('blog/index', {});
            res.render('blog/index', {contents:doc});
        })


    },
    detailController:function(req,res){
        var _id = req.query._id;
        mongo.find("Articles",{_id:new mongodb.ObjectID(_id)},{},function(doc){
            console.log(content);
            res.render('blog/detail',{content:content})
        })
    }
}

