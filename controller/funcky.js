/**
 *
 * Created by xuzhongwei on 3/19/16.
 */


var mongo = require("../model/mongo.js");
var mongodb = require("mongodb");
var steps = require("ocsteps");
var tools = require('./tool.js')
module.exports = {
    indexController: function (req, res) {
        var VRArrs = []
        var AIArrs = []
        var IoTArrs = []

        steps(function(){
            mongo.find("Funckies",{},{},this.hold(function(doc){
                    for(var i=0;i<doc.length;i++){
                        if(doc[i].category=="1"){
                            VRArrs.push(doc[i])
                        }else if(doc[i].category=="2"){
                            AIArrs.push(doc[i])
                        }else if(doc[i].category=="3"){
                            IoTArrs.push(doc[i])
                        }else{

                        }
                    }
            }))
        },function(){
            res.render("funcky/index",{loginSession:req.session.loginSession,VRArrs:VRArrs,AIArrs:AIArrs,IoTArrs:IoTArrs})
        })()

    }
}