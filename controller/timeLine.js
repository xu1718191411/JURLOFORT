/**
 * Created by xuzhongwei on 2/9/16.
 */

var mongo = require("../model/mongo.js");
var mongodb = require("mongodb");
var steps = require('ocsteps');

module.exports = {
    indexController: function(req,res){

        steps(function(){

            var _id = req.query._id;
            console.log(1110)
            console.log(_id);
            mongo.find("ClassMates",{_id:new mongodb.ObjectID(_id)},{},function(doc){
                var content = doc[0];
                var timeLine = content.timeLine || {}

                res.render('timeLine/index', {content:content,contentTimeLines:eval(timeLine)});
            })

        })();

    },
    addController:function(req,res){

        steps(
            function(){
                if(isEmpty(req.session.loginSession)){
                    res.redirect("/blog/login")
                }
            },
            function(){
                var _id = req.query._id;
                req.session._id = _id;
                mongo.find("ClassMates",{_id:new mongodb.ObjectID(_id)},{},this.hold(function(doc){
                    var content = doc[0];
                    console.log(content);
                    return content
                }))

            } ,function(doc){
                res.render("timeLine/add",{content:doc,fromName:req.session.loginSession.name,fromClass:req.session.loginSession.class});
            })()
    },
    saveTxtDataController:function(req,res){

        steps(function(){
            req.session = req.session || {}

            if(!req.session._id){//目标_id
                res.end("no _id;");
            }
        },function(){
            if(isEmpty(req.session.loginSession)){
                res.end("你未登陆")
            }
        },function(){
            mongo.update("ClassMates",{_id:new mongodb.ObjectID(req.session._id)},{$set:{timeLine:req.body.dataSet}},function(doc){
                console.log("updating")
                console.log(doc);
                res.end("{err:0,doc:"+doc+"}")
            })
        })()
    }
}




function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

