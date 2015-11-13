/**
 * Created by xuzhongwei on 15/11/12.
 */

var mongo = require("../model/mongo.js");


var checkSession = function(req,res){
    req.session = req.session || {}

    console.log(req.session)
    if(!req.session.user){
        res.redirect(302,'/chat/login')
    }

}


module.exports = {
    loginController: function(req,res){
        res.render('chat/login', { title: 'Express' });
    },
    indexController: function(req,res){
        checkSession(req,res);
        res.render('chat/index', { title: 'Express' });
    },
    stateMentController: function(req,res){
        res.render('chat/statement', { title: 'Express' });
    },
    loginPostController: function(req,res){
         username = req.body.username;
         password = req.body.password;

        mongo.find("birds",{username:username,password:password},{},function(doc){
            if(doc.length>0){
                req.session.user = doc[0]
                res.redirect(302, "/chat/");
            }else{

            }
        })
    }
}