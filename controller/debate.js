/**
 * Created by xuzhongwei on 15/11/12.
 */

var mongo = require("../model/mongo.js");
var tool = require("./tool.js");
var steps = require('ocsteps');

module.exports = {
    indexController: function(req,res){

        var proPrepare
        var conPrepare
        var pro
        var con

        if(tool.isEmpty(req.session.debateLogin)){
            res.redirect("tmpLogin")
            return;
        }

        if(!req.session.debateLogin.num){
            res.end("num has not been writen in session")
            return;
        }

        // user status
        //   -1 logout
        //    0 login
        //    1 entering
        //    2 debating

        steps(
            function(){

            mongo.createIfNotExists("userStatus",this.hold(function(result){

            }))
        },function(){

            mongo.find("userStatus",{username:req.session.debateLogin.username,group:req.session.debateLogin.group},{},this.hold(function(result){
                    if(result.length>0){
                        mongo.update("userStatus",{username:req.session.debateLogin.username,group:req.session.debateLogin.group},{$set:{status:1,num:req.session.debateLogin.num}},this.hold(function(result){

                        }))
                    }else{
                        mongo.insert("userStatus",{username:req.session.debateLogin.username,group:req.session.debateLogin.group,status:1,num:req.session.debateLogin.num},{},this.hold(function(result){

                        }))
                    }
            }))


        },function(){
            mongo.createIfNotExists("debateStatus",this.hold(function(res){
                if(res==0){
                    mongo.insert("debateStatus",{num:req.session.debateLogin.num},{},this.hold(function(res){

                    }))
                }
            }))
        },function(){
            mongo.find("debateStatus",{num:req.session.debateLogin.num},{},this.hold(function(result){
                if(result.length<=0){
                    mongo.insert("debateStatus",{num:req.session.debateLogin.num},{},this.hold(function(res){

                    }))
                }

                proPrepare = result[0].proPrepare
                conPrepare = result[0].conPrepare
                pro = result[0].pro
                con = result[0].con
            }))

        },function(){
            mongo.find("themes",{group:req.session.debateLogin.group},{},this.hold(function(list){
                var theme = list[0];

                mongo.find("debateStatus",{num:theme.num},{},this.hold(function(result){
                    theme.pro = result[0].pro
                    theme.con = result[0].con
                    return theme
                }))

            }))
        },function(theme){
            res.render('debate/index', { userInformation:  req.session.debateLogin, theme : theme ,proPrepare:proPrepare, conPrepare:conPrepare,pro:pro,con:con});
        })()


    },
    groupController: function(req,res){

        var themes = []
        var debatingList = []
        if(tool.isEmpty(req.session.debateLogin)){
            res.redirect("tmpLogin")
            return;
        }

        console.log(req.session.debateLogin)

        steps(function(){

            mongo.find("themes",{group:req.session.debateLogin.group},{},this.hold(function(result){

                for(var i=0;i<result.length;i++){

                    (function(k,that){
                        mongo.find("debateStatus",{num:result[k].num,status:{$gte:0}},{},that.hold(function(_result){
                            if(_result.length>0){
                                debatingList.push({num:result[k].num,theme:result[k].theme,con:_result[0].con,pro:_result[0].pro,status:_result[0].status})
                            }
                        }))
                    })(i,this)

                }
            }))

        },function(){

            mongo.find("themes",{group:req.session.debateLogin.group},{},this.hold(function(list){


                for(var i=0;i<list.length;i++){
                    (function(j,that){
                        mongo.find("debateStatus",{num:list[j].num,status:{$exists:false}},{},that.hold(function(result){
                            if(result.length>0){
                                themes.push({pro:result[0].pro,con:result[0].con,theme:list[j].theme,num:list[j].num})
                            }
                        }))
                    })(i,this)
                }
            }))
        },function(){
            res.render("debate/group",{userInformation:req.session.debateLogin,themes:themes,debatingList:debatingList})
        })()
    },
    tmpLoginController:function(req,res){
        res.render('debate/tmpLogin', { title: 'Express' });
    },
    tmpLoginPostController:function(req,res){

        var members = [
            {username:"syoui",password:"syoui",group:"miyoshi"},
            {username:"villa",password:"villa",group:"miyoshi"}
            ]

       //var groups = [{groupname:"miyoshi",detail:{name:"三好研究室"}},{groupname:"okamoto",detail:{}},{groupname:"nakagomi",detail:{}}]


        var _username = req.body.username;
        var _password = req.body.password;

        var _isLogin = 0;
        for(var i=0;i<members.length;i++){
            if(_username == members[i].username && _password == members[i].password){
                _isLogin = 1;
                req.session.debateLogin = {username:members[i].username,password:members[i].password,group:members[i].group}
            }
        }

        if(_isLogin == 0){
            res.end(JSON.stringify({error:1,msg:"username or password not correct"}))
            return;
        }

        steps(function(){
            mongo.createIfNotExists("userStatus",this.hold(function(result){

            }))
        },function(){
            mongo.find("userStatus",{username:req.session.debateLogin.username,group:req.session.debateLogin.group},{},this.hold(function(result){
                    // user status
                    //   -1 logout
                    //    0 login
                    //    1 entering
                    //    2 debating

                    if(result.length>0){
                            mongo.update("userStatus",{username:req.session.debateLogin.username,group:req.session.debateLogin.group},{$set:{status:0}},{},this.hold(function(){

                            }))
                    }else{
                            mongo.insert("userStatus",{username:req.session.debateLogin.username,group:req.session.debateLogin.group,status:0},{},this.hold(function(){

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