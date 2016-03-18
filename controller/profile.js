/**
 *
 * Created by xuzhongwei on 2/19/16.
 */


var mongo = require("../model/mongo.js");
var mongodb = require("mongodb");
var steps = require("ocsteps");
var tools = require('./tool.js')


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
            res.render("profile/index",{content:doc[0],classNumber:req.session.loginSession.class,nameTxt:req.session.loginSession.name});
        })()
    },
    uploadController:function(req,res){
        steps(function(){
            tools.upload(req,res,"../public/profileUpload",this.hold(function(err,doc){
                if(err){
                    throw err
                }
                return doc
            }))
        },function(doc){
            mongo.find("ClassMates",{name:req.session.loginSession.name,class:req.session.loginSession.class},{},this.hold(function(list){
                console.log(list)
                var profile = list[0].profile || {}
                profile.targetName = eval("("+doc+")").targetName
                return profile


            }))
        },function(_profile){
            mongo.update("ClassMates",{name:req.session.loginSession.name,class:req.session.loginSession.class},{$set:{profile:_profile}},{},this.hold(function(_result){
                console.log(JSON.stringify({targetName:_profile.targetName}))

                res.end(JSON.stringify({targetName:_profile.targetName}))
            }))
        }
        )()
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
