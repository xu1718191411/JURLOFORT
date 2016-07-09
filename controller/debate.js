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
        var timeLimit
        var systemTimes

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

                console.log(req.session)
            mongo.find("userStatus",{username:req.session.debateLogin.username,group:req.session.debateLogin.group},{},this.hold(function(result){
                    if(result.length>0){
                        mongo.update("userStatus",{username:req.session.debateLogin.username,group:req.session.debateLogin.group},{$set:{status:1,num:req.session.debateLogin.num,rNum:req.session.debateLogin.rNum}},this.hold(function(result){

                        }))
                    }else{
                        mongo.insert("userStatus",{username:req.session.debateLogin.username,group:req.session.debateLogin.group,status:1,num:req.session.debateLogin.num,rNum:req.session.debateLogin.rNum},{},this.hold(function(result){

                        }))
                    }
            }))


        },function(){

            console.log( {num:req.session.debateLogin.num,rNum:req.session.debateLogin.rNum,group:req.session.debateLogin.group})

            mongo.find("debateStatus",{num:req.session.debateLogin.num,rNum:req.session.debateLogin.rNum,group:req.session.debateLogin.group},{},this.hold(function(result){
                proPrepare = result[0].proPrepare
                conPrepare = result[0].conPrepare
                pro = result[0].pro
                con = result[0].con
                timeLimit = result[0].timeLimit
                systemTimes = result[0].themeTimes
            }))

        },function(){
            mongo.find("themes",{num:req.session.debateLogin.num},{},this.hold(function(list){
                var theme = list[0];
                return theme
            }))
        },function(theme){
            res.render('debate/index', { userInformation:  req.session.debateLogin, theme : theme ,proPrepare:proPrepare, conPrepare:conPrepare,pro:pro,con:con,timeLimit:timeLimit,systemTimes:systemTimes});
        })()


    },
    groupController: function(req,res){

        var themes = []
        var debatingList = []
        var finishList = []
        if(tool.isEmpty(req.session.debateLogin)){
            res.redirect("tmpLogin")
            return;
        }

        console.log(req.session.debateLogin)

        steps(function(){

            mongo.find("debateStatus",{group:req.session.debateLogin.group,finishi:0,setting:1},{},this.hold(function(result){

                for(var i=0;i<result.length;i++){

                    (function(k,that){
                        mongo.find("themes",{num:result[k].num},{},that.hold(function(_result){
                            if(_result.length>0){
                                debatingList.push({num:result[k].num,rNum:result[k].rNum,theme:_result[0].theme,con:result[k].con,pro:result[k].pro,status:result[k].status})
                            }
                        }))
                    })(i,this)

                }
            }))

        },function(){

            mongo.find("debateStatus",{group:req.session.debateLogin.group,finishi:1,setting:1},{},this.hold(function(result){

                for(var i=0;i<result.length;i++){

                    (function(k,that){
                        mongo.find("themes",{num:result[k].num},{},that.hold(function(_result){
                            if(_result.length>0){
                                finishList.push({num:result[k].num,rNum:result[k].rNum,theme:_result[0].theme,con:result[k].con,pro:result[k].pro,status:result[k].status})
                            }
                        }))
                    })(i,this)

                }
            }))

        },function(){

            mongo.find("themes",{group:req.session.debateLogin.group},{},this.hold(function(list){

                console.log("debatingList is the following.....")
                console.log(debatingList)
                themes = list
            }))
        },function(){
            res.render("debate/group",{userInformation:req.session.debateLogin,themes:themes,debatingList:debatingList,finishList:finishList})
        })()
    },
    reviewController:function(req,res){
        res.render("debate/review",{})
    },
    reviewDataController:function(req,res){
        mongo.find("themes",{},{},function(list){
            res.end(JSON.stringify(list))
        })
    },
    tmpLoginController:function(req,res){
        res.render('debate/tmpLogin', { title: 'Express' });
    },
    tmpLoginPostController:function(req,res){

       //var groups = [{groupname:"miyoshi",detail:{name:"三好研究室"}},{groupname:"okamoto",detail:{}},{groupname:"nakagomi",detail:{}}]


        var _username = req.body.username;
        var _password = req.body.password;

        var _isLogin = 0;

        steps(
        function(){
            mongo.find("debateMembers",{username:_username,password:_password},{},this.hold(function(result){
                    if(result.length<=0){res.end(JSON.stringify({error:1,msg:"username or password not correct"}));this.terminate();}
                    req.session.debateLogin = {username:result[0].username,password:result[0].password,type:result[0].type,group:result[0].group}

            }))
        },
        function(){
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
        },function(){
                    res.end(JSON.stringify({error:0,msg:"successful"}))
        })()
    },
    logoutController:function(req,res){
            delete req.session.debateLogin
            res.redirect("/debate/tmpLogin");
    },
    preparePostController:function(req,res){
        if(tool.isEmpty(req.session.debateLogin)){
           res.end(JSON.stringify({error:1,msg:"illegal session"}))
        }

        var _position = req.session.debateLogin.position
        var _update = parseInt(_position)==1?{proPrepare:1}:{conPrepare:1}


        console.log(req.session.debateLogin)
        steps(function(){
            mongo.update("debateStatus",{num:req.session.debateLogin.num,rNum:req.session.debateLogin.rNum,group:req.session.debateLogin.group},{$set:_update},{},function(result){
                    res.end(JSON.stringify({error:0,msg:_position+" has prepared"}))
            })
        })()

    }


}