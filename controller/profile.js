/**
 *
 * Created by xuzhongwei on 2/19/16.
 */


var mongo = require("../model/mongo.js");
var mongodb = require("mongodb");
var steps = require("ocsteps");


module.exports = {
    indexController: function (req, res) {
        steps(function(){
            var nameTxt = req.query.nameTxt;
            var classNumber = req.query.classNumber;
            console.log(nameTxt);
            console.log(classNumber);
            if(!nameTxt || !classNumber){
                  res.redirect('/blog');
                  this.terminate();
            }
        },function(){

                mongo.find("ClassMates",{class:req.query.classNumber,name:req.query.nameTxt},{},this.hold(function(doc){
                    console.log(doc);
                    return doc;
                }))

        },
        function(doc){
            res.render("profile/index",{content:doc[0]});
        })()
    }
}
