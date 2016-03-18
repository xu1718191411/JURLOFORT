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


                    var patt = /([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])T([0-9][0-9]):([0-9][0-9]):([0-9][0-9])\.([0-9][0-9][0-9])Z/;
                    var regRes = patt.exec(timeLine[i].start);

                    if(!isEmpty(regRes)) {
                        var d = new Date(regRes[1], regRes[2], regRes[3], regRes[4], regRes[5], regRes[6]);
                        timeLine[i].start = utc2Jtc(d)
                        console.log(timeLine[i].start)
                    }
                }



                res.render('timeLine/index', {_id:_id,content:content,contentTimeLines:timeLine,loginSession:req.session.loginSession});
            })

        })();

    },
    addController:function(req,res){
        var _ids = req.query._ids
        var allMembers = []
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

                mongo.find("ClassMates",{class:req.session.loginSession.class.toString()},{},this.hold(function(_allMembers){

                    for(var i in _allMembers){

                        if(_allMembers[i].name!=doc.name){
                            allMembers.push(_allMembers[i])
                        }
                    }

                    res.render("timeLine/add",{_ids:_ids,content:doc,fromName:req.session.loginSession.name,fromClass:req.session.loginSession.class,allMembers:allMembers});

                }))

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

function utc2Jtc(date){
    var d = Date.parse(date)+9*60*60*1000;
    return changeDate(d);
}



function changeDate(str){
    var now_date, now_date_format;
    now_date = new Date(parseInt(str));
    now_date_format = now_date.getFullYear();

    if (parseInt(now_date.getMonth()) <= 9) {
        now_date_format += "-" + "0" + (parseInt(now_date.getMonth()));
    } else {
        now_date_format += "-" + (parseInt(now_date.getMonth()));
    }
    if (parseInt(now_date.getDate()) <= 9) {
        now_date_format += "-" + "0" + (parseInt(now_date.getDate()));
    } else {
        now_date_format += "-" + (parseInt(now_date.getDate()));
    }

    if (parseInt(now_date.getHours()) <= 9) {
        now_date_format += " " + "0" + (parseInt(now_date.getHours()));
    } else {
        now_date_format += " " + (parseInt(now_date.getHours()));
    }


    if (parseInt(now_date.getMinutes()) <= 9) {
        now_date_format += ":" + "0" + (parseInt(now_date.getMinutes()));
    } else {
        now_date_format += ":" + (parseInt(now_date.getMinutes()));
    }

    if (parseInt(now_date.getSeconds()) <= 9) {
        now_date_format += ":" + "0" + (parseInt(now_date.getSeconds()));
    } else {
        now_date_format += ":" + (parseInt(now_date.getSeconds()));
    }

    return now_date_format;

}
