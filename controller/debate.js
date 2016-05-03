/**
 * Created by xuzhongwei on 15/11/12.
 */

var mongo = require("../model/mongo.js");
var tool = require("./tool.js");
var steps = require('ocsteps');

module.exports = {
    indexController: function(req,res){

        if(tool.isEmpty(req.session.debateLogin)){
            res.redirect("tmpLogin")
            return;
        }

        if(!req.session.debateLogin.num){
            res.end("num has not been writen in session")
            return;
        }

        steps(function(){
            mongo.find("themes",{group:parseInt(req.session.debateLogin.group)},{},this.hold(function(list){
                var theme = list[0];

                mongo.find("debateStatus",{num:theme.num},{},this.hold(function(result){
                    theme.pro = result[0].pro
                    theme.con = result[0].con
                    return theme
                }))

            }))
        },function(theme){
            res.render('debate/index', { userInformation:  req.session.debateLogin, theme : theme });
        })()


    },
    groupController: function(req,res){

        var themes;
        if(tool.isEmpty(req.session.debateLogin)){
            res.redirect("tmpLogin")
            return;
        }

        steps(function(){
            mongo.find("themes",{group:parseInt(req.session.debateLogin.group)},{},this.hold(function(list){
                themes = list;

                for(var i=0;i<themes.length;i++){
                    (function(j,that){
                        mongo.find("debateStatus",{num:themes[j].num},{},that.hold(function(result){
                            themes[j].pro = result[0].pro
                            themes[j].con = result[0].con
                        }))
                    })(i,this)

                }


            }))
        },function(){
            res.render("debate/group",{userInformation:  req.session.debateLogin,themes:themes,})
        })()


    },
    tmpLoginController:function(req,res){
        res.render('debate/tmpLogin', { title: 'Express' });
    },
    tmpLoginPostController:function(req,res){

        var members = [{username:"syoui",password:"syoui"},{username:"villa",password:"villa"}]
        var groups = [{groupname:"miyoshi",members:members},{groupname:"okamoto"},{groupname:"nakagomi"}]



        console.log(req.body)

        var _username = req.body.username;
        var _password = req.body.password;
        var _group = parseInt(req.body.group)

        var users = groups[_group]["members"] || []

        var _isLogin = 0;
        for(var i=0;i<users.length;i++){
            if(_username == users[i].username && _password == users[i].password){
                _isLogin = 1;
                req.session.debateLogin = {username:_username,password:_password,group:_group}
            }
        }

        if(_isLogin == 0){
            res.end(JSON.stringify({error:1,msg:"username or password not correct"}))
            return;
        }

        steps(function(){
            mongo.createIfNotExists("debateStatus",this.hold(function(res){
                if(res==0){
                    mongo.insert("debateStatus",{num:1},{},this.hold(function(res){

                    }))
                }
            }))
        },function(){
            mongo.find("debateStatus",{num:1},{},this.hold(function(result){
                    if(result.length<=0){
                        mongo.insert("debateStatus",{num:1},{},this.hold(function(res){

                        }))
                    }
            }))

        })()


        if(_isLogin==0){
            res.end(JSON.stringify({error:1,msg:"username or password not correct"}))
        }else{
            res.end(JSON.stringify({error:0,msg:"successful"}))

        }



    },
    preparePostController:function(req,res){
        if(tool.isEmpty(req.session.debateLogin)){
           res.end(JSON.stringify({error:1,msg:"illegal session"}))
        }

        var _position = req.session.debateLogin.position
        var _update = parseInt(_position)==1?{proPrepare:1}:{conPrepare:1}


        steps(function(){
            mongo.update("debateStatus",{num:1},{$set:_update},{},function(result){
                    res.end(JSON.stringify({error:0,msg:_position+" has prepared"}))
            })
        })()

    }


}