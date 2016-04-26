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
    tmpLoginController:function(req,res){
        res.render('debate/tmpLogin', { title: 'Express' });
    },
    tmpLoginPostController:function(req,res){

        var users = [{username:"syoui",password:"syoui"},{username:"villa",password:"villa"}]

        console.log(req.body)

        var _username = req.body.username;
        var _password = req.body.password;
        var _position = req.body.position;

        var _isLogin = 0;
        for(var i=0;i<users.length;i++){
            if(_username == users[i].username && _password == users[i].password){
                _isLogin = 1;
                req.session.debateLogin = {username:_username,password:_password,position:_position}
            }
        }

        steps(function(){
            mongo.createIfNotExists("debateStatus",this.hold(function(res){
                if(res==0){
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



    }

}