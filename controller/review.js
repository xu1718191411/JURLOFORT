/**
 *
 * Created by xuzhongwei on 7/9/16.
 */

var mongo = require("../model/mongo.js");
var steps = require('ocsteps');

module.exports = {
    indexController:function(req,res){
        var num = req.query.num
        var rNum = req.query.rNum
        req.session.num = num
        req.session.rNum = rNum

        console.log("session is ...")
        console.log(req.session)

        res.render("review/index",{})
    },
    reviewDataController:function(req,res){
        mongo.find("themes",{},{},function(list){
            res.end(JSON.stringify(list))
        })
    },
    analysisTemplateController:function(req,res){
        res.render("review/template/analysisDataTemplate",{})
    },
    statementTemplateController:function(req,res){
        res.render("review/template/statementDataTemplate",{})
    },
    getAnalysisDataController:function(req,res){
        var num = parseInt(req.session.num)
        var rNum = parseInt(req.session.rNum)
        console.log(num)
        console.log(rNum)
        steps(function(){
            mongo.find("analysisLog",{num:num,rNum:rNum},{},this.hold(function(_res){
                res.end(JSON.stringify(_res))
            }))
        })()
    },
    getStatementDataController:function(req,res){
        var num = parseInt(req.session.num)
        var rNum = parseInt(req.session.rNum)
        console.log(num)
        console.log(rNum)
        steps(function(){
            mongo.find("statementLog",{num:num,rNum:rNum},{},this.hold(function(_res){
                res.end(JSON.stringify(_res))
            }))
        })()
    }
}

