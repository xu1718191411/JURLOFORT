/**
 * Created by xuzhongwei on 2016/07/12.
 */



var mongo = require("../model/mongo.js");
var tool = require("./tool.js");
var steps = require('ocsteps');

module.exports = {
    indexController:function(req,res){

    },
    loginController:function(req,res){
        res.render("_debate/login",{})
    },
    loginPostController:function(req,res){

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
    groupController:function(req,res){
        var themes = []
        var debatingList = []
        var finishList = []
        if(tool.isEmpty(req.session.debateLogin)){
            res.redirect("login")
            return;
        }

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
            res.render("_debate/group",{userInformation:req.session.debateLogin,themes:themes,debatingList:debatingList,finishList:finishList})
        })()
    },
    getThemeListController:function(req,res){
        steps(function(){
            mongo.find("themes",{},{},this.hold(function(_res){
                    res.end(JSON.stringify(_res))
            }))
        })()
    },
    createNewRoomController:function(req,res){
        var position = req.body.position
        var num = req.body.num

        var rNum = Math.round(Math.random()*10000)
        if(position == 1){
            var newRoom = {pro:req.session.debateLogin.username,num:num,rNum:rNum,finishi:0,setting:0,group:req.session.debateLogin.group}
        }else{
            var newRoom = {con:req.session.debateLogin.username,num:num,rNum:rNum,finishi:0,setting:0,group:req.session.debateLogin.group}
        }

        steps(function(){
            mongo.insert("debateStatus",newRoom,{},this.hold(function(_res){
                req.session.debateLogin.num = num
                req.session.debateLogin.rNum = rNum
                res.end(JSON.stringify({err:0,msg:"successfully"}))
            }))
        })()
    },
    chatController:function(req,res){
        res.render("_debate/chat",{})
    },
    getDebateInformationController:function(req,res){
        mongo.find("debateStatus",{num:req.session.debateLogin.num,rNum:req.session.debateLogin.rNum},{},function(_res){
                res.end(JSON.stringify(_res[0]))
        })
    }
}