/**
 * Created by xuzhongwei on 2016/11/17.
 */


var mongo = require("../model/mongo.js");
var mongodb = require("mongodb");
var fs = require("fs");
var path = require("path")
var im = require('imagemagick');
var steps = require('ocsteps');


module.exports = {
    pasonaTechAyatakaEventPostController:function(req,res){

        console.log(1111111111)
        var name = req.body.name
        var mail = req.body.mail
        var msg = req.body.msg
        var time = changeDate(Date.parse(new Date()))

        var ip = req.connection.remoteAddress

        console.log(req)

        if(!name || !mail || !msg){
            req.end(JSON.stringify({error:1,msg:"illegal data"}))
            return
        }

        mongo.insert("ayataka",{name:name,mail:mail,msg:msg,time:time,ip:ip},{},function(result){
            console.log(result)
            res.end(JSON.stringify({err:0,data:{name:name,mail:mail}}))
        })
    }
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

function changeDate(str){
    var now_date, now_date_format;
    now_date = new Date(parseInt(str));
    now_date_format = now_date.getFullYear();

    if (parseInt(now_date.getMonth()) < 9) {
        now_date_format += "-" + "0" + (parseInt(now_date.getMonth()) + 1);
    } else {
        now_date_format += "-" + (parseInt(now_date.getMonth()) + 1);
    }
    if (parseInt(now_date.getDate()) < 9) {
        now_date_format += "-" + "0" + (parseInt(now_date.getDate()) + 1);
    } else {
        now_date_format += "-" + (parseInt(now_date.getDate()) + 1);
    }

    if (parseInt(now_date.getHours()) < 9) {
        now_date_format += " " + "0" + (parseInt(now_date.getHours()));
    } else {
        now_date_format += " " + (parseInt(now_date.getHours()));
    }


    if (parseInt(now_date.getMinutes()) < 9) {
        now_date_format += ":" + "0" + (parseInt(now_date.getMinutes()));
    } else {
        now_date_format += ":" + (parseInt(now_date.getMinutes()));
    }

    if (parseInt(now_date.getSeconds()) < 9) {
        now_date_format += ":" + "0" + (parseInt(now_date.getSeconds()));
    } else {
        now_date_format += ":" + (parseInt(now_date.getSeconds()));
    }

    return now_date_format;

}