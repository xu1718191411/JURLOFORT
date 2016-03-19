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
    logoutController:function(req,res){
      req.session.adminLogin = 0;
      res.redirect('/admin/login');
    },
    loginController:function(req,res){
        var s = parseInt(Math.random()*10000);
        console.log(s);
        req.session.random  = s
        console.log(req.session.random)
        res.render('admin/login', {random:s});

        res.end();
    },
    loginPostController:function(req,res){
        if(isEmpty(req.body.userName) || isEmpty(req.body.passWord) || isEmpty(req.body.random)){
           res.redirect('/admin/login')
        }

        if(req.body.random != req.session.random){
            console.log(req.body.random);
            console.log(req.session.random)
            res.redirect('/admin/login');


        }

        var userName = req.body.userName;
        var passWord = req.body.passWord;

        if((userName == "villa_ak99") && (passWord == "kmkt2gb")){

            req.session.adminLogin = 1;
            res.redirect('/admin/list');

        }else{
            res.redirect('/admin/login');

        }

        res.end()
    },
    formController: function(req,res){
        res.render('admin/form', {});
    },
    funckyFormController: function(req,res){
        res.render('admin/funckyForm', {});
    },
    postController: function(req,res){
        console.log(req.body)
        mongo.insert("Articles",req.body,function(doc){
            console.log(doc);
            res.redirect('/admin/list');
        })

    },
    funckyPostController:function(req,res){
        console.log(req.body)
        mongo.insert("Funckies",req.body,function(doc){
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

    funckyListController: function(req,res){

        mongo.find("Funckies",{},{},function(doc){
            console.log(doc);
            res.render('admin/funckyList', {links:doc});
        })
    },

    historyController:function(req,res){
            var _class = req.query._class;
            var _className
            var cid;

            if(_class=="A1"){
                _className = '高四十八班'
                cid = 1;
            }else if(_class == "A2"){
                _className =  '兄弟连'
                cid = 2;
            }else if(_class == "A3"){
                _className = '初三八班'
                cid = 2;
            }else{
                res.redirect(302,'/admin/list');
                next();

            }

            steps(function(){

                mongo.createIfNotExists("historyList"+cid,this.hold(function(doc){
                        if(parseInt(doc)==0){
                            res.render("admin/history",{_className:_className,docs:[]});
                            res.end()
                        }
                }))

            },function(){
                mongo.find("historyList"+cid,{toUserClass:cid.toString()},{},this.hold(function(doc){
                    doc = doc || []
                    for(var i in doc){
                        doc[i]['date'] = changeDate(doc[i]['date']);
                    }
                    res.render("admin/history",{_className:_className,docs:doc});

                }))
            })()
    },

    delController:function(req,res){
        var _id = req.query._id;
        mongo.remove("Articles",{_id:new mongodb.ObjectID(_id)},function(doc){
            console.log(doc);
            res.redirect('/admin/list');
        })
    },
    funckyDelController:function(req,res){
        var _id = req.query._id;
        mongo.remove("Funckies",{_id:new mongodb.ObjectID(_id)},function(doc){
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
    funckyEditController:function(req,res){
        var _id = req.query._id;
        mongo.find("Funckies",{_id:new mongodb.ObjectID(_id)},{},function(doc){
            var content = doc[0];
            console.log(content);
            res.render('admin/funckyEdit',{content:content})
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
    funckyUpdateController:function(req,res){
        var _id = req.body._id;

        //console.log(req.body);
        mongo.update("Funckies",{_id:new mongodb.ObjectID(_id)},{$set:{'title':req.body.title,'content':req.body.content,'targetName':req.body.targetName,'category':req.body.category}},function(doc){
            console.log("updating")
            console.log(doc);
            res.redirect('/admin/list');
        })

    },
    uploadController:function(req,res){

        var file = req.files[0];

        if(/\/([A-Za-z]+$)/.exec(req.headers['referer']) == "funckyForm"){
            var target_path = path.join(__dirname, "../public/upload")
        }else{
            var target_path = path.join(__dirname, "../public/FunckyUpload")
        }


        var filename = file.filename;


        var originalPath = path.join(__dirname, "../uploads")

        console.log(file);
        console.log(target_path)
        console.log(originalPath);
        var targetName = Math.random().toString(36).substring(2);

        steps(
        function(){
            fs.exists(target_path, this.hold(function(exists) {
                return exists;
            }));
        },
        function(_exists){
            if(!_exists){
                fs.mkdir(target_path,this.hold(function(_result){

                }))
            }
        },
        function(){
            fs.rename(originalPath+"/"+filename,target_path+'/' +targetName+".jpg",this.hold(function(err){
                if(err) throw err;



        }))
        },function(){
            im.resize({
                srcPath: target_path+'/' +targetName+".jpg",
                dstPath: target_path+'/' +targetName+"-thumb.jpg",
                height:  450

            }, this.hold(function(err, stdout, stderr){
                if (err) throw err;
                console.log('resized kittens.jpg to fit within 256x256px');
                res.end(JSON.stringify({targetName:targetName+"-thumb.jpg"}));
            }));

//            fs.unlink(originalPath+"/"+file.filename,function(err){
//                if(err) throw err;
//
//            })
        })()
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
            console.log('bbbbbbbbbbbb')
            console.log(doc);
            res.render('admin/timeLine', {links:doc});
        })


    },
    postClassMateController:function(req,res){
        console.log(req.body)


        mongo.createIfNotExists("ClassMates",function(result){

            console.log("result is "+result);
            mongo.find("ClassMates",{name:req.body.name,class:req.body.class},{},function(doc){
                if(doc.length>0){
                    res.redirect('/admin/timeLine?class=A'+req.body.class);
                }else{
                    mongo.insert("ClassMates",req.body,function(doc){
                        console.log('aaaaaaaaaaaa')
                        console.log(doc);
                        res.redirect('/admin/timeLine?class=A'+req.body.class);
                    })
                }
            })
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
                res.redirect('/admin/timeLine?class=A'+req.body.class);
            }else{
                mongo.update("ClassMates",{name:req.body.name},{$set:{'profile':_update}},{},function(doc){
                    console.log(doc);
                    res.redirect('/admin/timeLine?class=A'+req.body.class);
                })
            }
        })
    },
    delClassMateController:function(req,res){
        var _id = req.query._id;
        var _class = "A1";

        steps(function(){

            mongo.find("ClassMates",{_id:new mongodb.ObjectID(_id)},{},function(doc){
                if(doc.length>1){
                    res.redirect('/admin/list');
                }else{
                    _class = "A"+doc[0]['class'];
                    mongo.remove("ClassMates",{_id:new mongodb.ObjectID(_id)},function(doc){
                        res.redirect('/admin/timeLine?class='+_class)
                    })
                }
            })

        },function(){

        })();



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


function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

function changeDate(str){
    var now_date, now_date_format;
    now_date = new Date(parseInt(str));
    now_date_format = now_date.getFullYear();

    if (parseInt(now_date.getMonth()) < 9) {
        now_date_format += "-" + "0" + (parseInt(now_date.getMonth()) + 1);
    } else {
        now_date_format += "-" + (parseInt(now_date.getMonth()) + 1);
    }
    if (parseInt(now_date.getDate()) < 9) {
        now_date_format += "-" + "0" + (parseInt(now_date.getDate()) + 1);
    } else {
        now_date_format += "-" + (parseInt(now_date.getDate()) + 1);
    }

    if (parseInt(now_date.getHours()) < 9) {
        now_date_format += " " + "0" + (parseInt(now_date.getHours()));
    } else {
        now_date_format += " " + (parseInt(now_date.getHours()));
    }


    if (parseInt(now_date.getMinutes()) < 9) {
        now_date_format += ":" + "0" + (parseInt(now_date.getMinutes()));
    } else {
        now_date_format += ":" + (parseInt(now_date.getMinutes()));
    }

    if (parseInt(now_date.getSeconds()) < 9) {
        now_date_format += ":" + "0" + (parseInt(now_date.getSeconds()));
    } else {
        now_date_format += ":" + (parseInt(now_date.getSeconds()));
    }

    return now_date_format;

}

