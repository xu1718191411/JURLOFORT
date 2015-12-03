/**
 * Created by xuzhongwei on 15/11/12.
 */

var mongo = require("../model/mongo.js");
var tool = require("./tool.js");


var checkSession = function(req,res){
    req.session = req.session || {}

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
        var username = req.session.user.username;
        var support = req.session.user.support;

        res.render('chat/index', {username:username,support:support,CurrentDate:tool.getCurrentDate()});
    },
    stateMentController: function(req,res){
        res.render('chat/statement', { title: 'Express' });
    },
    analyzeController: function(req,res){
        res.render('chat/analyze', { title: 'Express' });
    },
    _analyzeController: function(req,res){
        res.render('chat/_analyze', { title: 'Express' });
    },
    loginPostController: function(req,res){
         username = req.body.username;
         password = req.body.password;

        mongo.find("birds",{username:username,password:password},{},function(doc){
            if(doc.length>0){
                var support;
                var support = doc[0].username=="syoui"?support="pro":"con";
                req.session.user = doc[0];
                req.session.user.support = support;
                res.redirect(302, "/chat/");
            }else{

            }
        })
    }
}