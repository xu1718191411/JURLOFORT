/**
 *
 * Created by xuzhongwei on 2/1/16.
 */
var mongo = require("../model/mongo.js");
var mongodb = require("mongodb");

module.exports = {
    indexController: function(req,res){
        res.render('admin/index', {});
    },
    formController: function(req,res){
        res.render('admin/form', {});
    },
    postController: function(req,res){
        console.log(req.body)
        mongo.insert("Articles",req.body,function(doc){
            console.log(doc);
        })

    },
    listController: function(req,res){

        mongo.find("Articles",{},{},function(doc){
            console.log(doc);
            res.render('admin/list', {links:doc});
        })
    },
    delController:function(req,res){
        var _id = req.query._id;
        mongo.remove("Articles",{_id:new mongodb.ObjectID(_id)},function(doc){
            console.log(doc);
            res.redirect('/admin/list');
        })
    },
    editController:function(req,res){
        var _id = req.query._id;
        mongo.find("Articles",{_id:new mongodb.ObjectID(_id)},{},function(doc){
            var content = doc[0];
            res.render('admin/edit',{content:content})
        })
    },
    updateController:function(req,res){
        var _id = req.body._id;

        //console.log(req.body);
        mongo.update("Articles",{_id:new mongodb.ObjectID(_id)},{$set:{'title':req.body.title,'content':req.body.content}},function(doc){
            console.log("updating")
            console.log(doc);
            res.redirect('/admin/list');
        })

    }

}
