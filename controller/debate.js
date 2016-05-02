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

        res.render('debate/index', { userInformation:  req.session.debateLogin });
    },
    groupController: function(req,res){
        res.render("debate/group",{})
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
        var _position = parseInt(req.body.position);
        var _group = parseInt(req.body.group)

        var users = groups[_group]["members"] || []

        var _isLogin = 0;
        for(var i=0;i<users.length;i++){
            if(_username == users[i].username && _password == users[i].password){
                _isLogin = 1;
                req.session.debateLogin = {username:_username,password:_password,position:_position}
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

        },function(){
            if(parseInt(_position) == 1){
                mongo.update("debateStatus",{num:1},{$set:{pro:_username}},function(res){

                })
            }else{
                mongo.update("debateStatus",{num:1},{$set:{con:_username}},function(res){

                })
            }

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