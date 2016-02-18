/**
 *
 * Created by xuzhongwei on 2/4/16.
 */


var mongo = require("../model/mongo.js");
var mongodb = require("mongodb");
var steps = require("ocsteps");


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
            console.log(doc);
            var content = doc[0];
            res.render('blog/detail',{content:content})
        })
    },
    signUpController:function(req,res){
            res.render("blog/signup",{})
    },
    loginController:function(req,res){
            res.render("blog/login",{})
    },
    registerController:function(req,res){
        console.log(req.body);
        var name = req.body.name;
        var _class = req.body.class;

        steps(function(){
            mongo.find("ClassMates",{name:name,class:_class},{},this.hold(function(doc){

                if(doc.length==0){
                    res.end("{error:1,msg:'不存在这位同学'}");
                }else{
                    return doc[0];
                }
            }))
        },function(content){
                console.log(111);
                console.log(content);

                var _profile = content.profile || {};
                _profile.sex = req.body.sex;
                _profile.profile = req.body.profile;
                _profile.mail = req.body.mail;

            mongo.update("ClassMates",{name:content.name,class:content.class},{$set:{profile:_profile}},this.hold(function(doc){
                    return content;
            }))

        },function(content){
            var tablesName = ["UserInfo17","UserInfoBro","UserInfo38"];
            mongo.insert(tablesName[parseInt(req.body.class)-1],{name:content.name,class:content.class,password:req.body.password},{},this.hold(function(doc){
                console.log(doc);
                if(parseInt(doc.result.ok)==1 && parseInt(doc.result.n)>0){
                    req.session.loginSession = {login:1,name:content.name,class:content.class}
                    res.end("{error:0,msg:'注册成功'}");
                }
            }))
        })()

    },
    checkLoginController:function(req,res){
        console.log(req.body);
        var tablesName = ["UserInfo17","UserInfoBro","UserInfo38"];


        mongo.createIfNotExists(tablesName[parseInt(req.body.class)-1],function(doc){
            console.log(1111111111111);
            console.log(doc);

            mongo.find(tablesName[parseInt(req.body.class)-1],{name:req.body.name,class:req.body.class,password:req.body.password},{},function(doc){
                console.log(doc);
                doc = doc || {}
                if(doc.length==0){
                    res.end("{error:1,msg:'错误的密码或者名字'}");
                }else{
                    req.session.loginSession = {login:1,name:req.body.name,class:req.body.class}
                    res.end("{error:0,msg:'登陆成功'}");
                }
            })

        });
    },
    AllTimeLineController:function(req,res){
        steps(function(){

            if(isEmpty(req.session.loginSession)){
                res.redirect("/blog/login")
            }
            var _class = req.session.loginSession.class;
            var tablesName = ["UserInfo17","UserInfoBro","UserInfo38"];

            this.renderObj = []
            steps(
            function(){
                mongo.find(tablesName[parseInt(_class)-1],{class:_class},{},this.hold(function(doc){
                        return doc;
                }))
            },function(doc){

                    for(var i in doc){
                        (function(j,dot,that){
                            mongo.find("ClassMates",{name:dot.name,class:dot.class},{},that.hold(function(docs){
                                docs[0].profile = docs[0].profile || {};
                                doc[j].profile = docs[0].profile.profile;
                                doc[j].__id = docs[0]._id;
                                return doc;
                            }))

                        })(i,doc[i],this)
                    }

            },function(doc){
                    res.render("blog/allTimeLine",{content:doc,classNumber:req.session.loginSession.class})
            })();

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

