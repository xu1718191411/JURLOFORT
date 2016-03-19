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
        res.render("funcky/index",{loginSession:req.session.loginSession})
    }
}