/**
 * Created by xuzhongwei on 2/9/16.
 */

var mongo = require("../model/mongo.js");
var mongodb = require("mongodb");
var steps = require('ocsteps');
var im = require('imagemagick');
var fs = require("fs")
var path = require("path")

module.exports = {
    indexController: function(req,res){

        steps(function(){
            var _id = req.query._id;
            if(!_id){
                res.redirect('/blog')
                this.terminate();
            }

            if(isEmpty(req.session.loginSession)){
                res.redirect("/blog/login")
                this.terminate();
            }

            mongo.find("ClassMates",{_id:new mongodb.ObjectID(_id)},{},function(doc){

                if(doc.length<1){
                    res.redirect('/blog')
                    this.terminate();
                }
                var content = doc[0];
                var timeLine = content.timeLine || []
                timeLine = eval(timeLine)
                for(var i in timeLine){
                   timeLine[i].targetname = timeLine[i].targetname || ""

                   timeLine[i].targetName =  timeLine[i].targetname.replace("-thumb","")


                    var patt = /([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-0][0-9])/;
                    var regRes = patt.exec(timeLine[i].start);
                    timeLine[i].start = regRes[1]+"年"+regRes[2]+"月"+regRes[3]+"日"
                }



                res.render('timeLine/index', {_id:_id,content:content,contentTimeLines:timeLine,loginSession:req.session.loginSession});
            })

        })();

    },
    addController:function(req,res){
        var _ids = req.query._ids
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
                    content.timeLine = content.timeLine || "[]"
                    return content
                }))

            } ,function(doc){
                res.render("timeLine/add",{_ids:_ids,content:doc,fromName:req.session.loginSession.name,fromClass:req.session.loginSession.class});
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
    },
    uploadController:function(req,res){

        var file = req.files[0];


        var filename = file.filename;

        var target_path = path.join(__dirname, "../public/timeLineupload")
        var originalPath = path.join(__dirname, "../upload")

        console.log(file);
        console.log(target_path)
        console.log(originalPath);
        var targetName = Math.random().toString(36).substring(2);

        fs.rename(originalPath+"/"+filename,target_path+'/' +targetName+".jpg",function(err){
            if(err) throw err;


            im.resize({
                srcPath: target_path+'/' +targetName+".jpg",
                dstPath: target_path+'/' +targetName+"-thumb.jpg",
                height:  450

            }, function(err, stdout, stderr){
                if (err) throw err;
                console.log('resized kittens.jpg to fit within 256x256px');
                res.end(JSON.stringify({targetName:targetName+"-thumb.jpg"}));
            });

//            fs.unlink(originalPath+"/"+file.filename,function(err){
//                if(err) throw err;
//
//            })

        })
    }

}




function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

