/**
 *
 * Created by xuzhongwei on 2/19/16.
 */


var mongo = require("../model/mongo.js");
var mongodb = require("mongodb");
var steps = require("ocsteps");


module.exports = {
    indexController: function (req, res) {
        steps(function(){
            var nameTxt = req.query.nameTxt;
            var classNumber = req.query.classNumber;
            console.log(nameTxt);
            console.log(classNumber);
            if(!nameTxt || !classNumber){
                  res.redirect('/blog');
                  this.terminate();
            }
        },function(){

                mongo.find("ClassMates",{class:req.query.classNumber,name:req.query.nameTxt},{},this.hold(function(doc){
                    console.log(doc);
                    return doc;
                }))

        },
        function(doc){
            console.log(doc);
            res.render("profile/index",{content:doc[0]});
        })()
    },
    updateController:function(req,res){
        var name = req.body.name;
        var _class = req.body._class;
        var key = req.body.key;
        var content = req.body.content;

        steps(
        function(){
            mongo.find("ClassMates",{class:_class,name:name},{},this.hold(function(doc){
                console.log(doc);
                return doc[0];
            }))

        },function(doc){
             if(isEmpty(doc)){
                 res.end(JSON.stringify({err:1,msg:"no user exists"}));
                 this.terminate();
             }
                 doc.profile = doc.profile || {};
                 doc.profile[key] = content;

                console.log(doc.profile)
                 mongo.update("ClassMates",{class:_class,name:name},{$set:{profile:doc.profile}},this.hold(function(doc){
                        console.log(doc);
                        res.end(JSON.stringify({err:0,msg:"修改成功"}));
                }))

        })();
    }
}


function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}
