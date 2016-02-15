/**
 * Created by xuzhongwei on 2/9/16.
 */

var mongo = require("../model/mongo.js");
var mongodb = require("mongodb");
var steps = require('ocsteps');

module.exports = {
    indexController: function(req,res){

        steps(function(){

            var _id = req.query._id;
            console.log(1110)
            console.log(_id);
            mongo.find("ClassMates",{_id:new mongodb.ObjectID(_id)},{},function(doc){
                var content = doc[0];
                var timeLine = content.timeLine || {}

                res.render('timeLine/index', {content:content,contentTimeLines:eval(timeLine)});
            })

        })();

    }

}
