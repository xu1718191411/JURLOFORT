/**
 *
 * Created by xuzhongwei on 2/1/16.
 */
var mongo = require("../model/mongo.js");
var mongodb = require("mongodb");
var fs = require("fs");
var path = require("path")
var im = require('imagemagick');
var steps = require('ocsteps');


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
            res.redirect('/admin/list');
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
            console.log(content);
            res.render('admin/edit',{content:content})
        })
    },
    updateController:function(req,res){
        var _id = req.body._id;

        //console.log(req.body);
        mongo.update("Articles",{_id:new mongodb.ObjectID(_id)},{$set:{'title':req.body.title,'content':req.body.content,'targetName':req.body.targetName}},function(doc){
            console.log("updating")
            console.log(doc);
            res.redirect('/admin/list');
        })

    },
    uploadController:function(req,res){

        var file = req.files[0];




        var filename = file.filename;

        var target_path = path.join(__dirname, "../public/upload")
        var originalPath = path.join(__dirname, "../uploads")

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
    },
    timeLineController: function(req,res){
        var _class = req.query.class || "A1";
        console.log(_class);

        var _query = {};
        if(_class=="A1"){
            _query.class = "1";
        }else if(_class=="A2"){
            _query.class = "2";
        }else{
            _query.class = 0;
        }

        console.log(_query);

        mongo.find("ClassMates",_query,{},function(doc){
            console.log(doc);
            res.render('admin/timeLine', {links:doc});
        })


    },
    postClassMateController:function(req,res){
        console.log(req.body)
        mongo.find("ClassMates",{name:req.body.name,class:req.body.class},{},function(doc){
            if(doc.length>0){
                res.redirect('/admin/timeLine?class=A'+req.body.class);
            }else{
                mongo.insert("ClassMates",req.body,function(doc){
                    console.log(doc);
                    res.redirect('/admin/timeLine?class=A'+req.body.class);
                })
            }
        })

    },
    editClassMateController:function(req,res){
        var _id = req.query._id;
        mongo.find("ClassMates",{_id:new mongodb.ObjectID(_id)},{},function(doc){
            var content = doc[0];
            console.log(content);
            res.render('admin/profile',{content:content})
        })
    },
    updateClassMateController:function(req,res){
        var name = req.body.name;
        console.log(1111);
        console.log(req.body);
        var _update = JSON.parse(JSON.stringify(req.body));
        delete _update.name;
        delete _update.class;
        delete _update._id;


        mongo.find("ClassMates",{name:req.body.name,class:req.body.class},{},function(doc){
            if(doc.length>1){
                console.llg(22222)
                res.redirect('/admin/timeLine?class=A'+req.body.class);
            }else{
                mongo.update("ClassMates",{name:req.body.name},{$set:{'profile':_update}},{},function(doc){
                    console.log(doc);
                    res.redirect('/admin/timeLine?class=A'+req.body.class);
                })
            }
        })
    },

    personTimeLineController:function(req,res){
            steps(
                function(){
                    var _id = req.query._id;
                    req.session._id = _id;
                    mongo.find("ClassMates",{_id:new mongodb.ObjectID(_id)},{},this.hold(function(doc){
                        var content = doc[0];
                        console.log(content);
                        return content
                    }))

                } ,function(doc){
                res.render("admin/personTimeLine",{content:doc});
            })()

    },
    saveTxtDataController:function(req,res){

            steps(function(){
                req.session = req.session || {}

                if(!req.session._id){
                    res.end("no _id;");
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
