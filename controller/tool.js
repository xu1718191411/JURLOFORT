/**
 *
 * Created by xuzhongwei on 12/3/15.
 */

var fs = require("fs");
var path = require("path")
var im = require('imagemagick');
var steps = require('ocsteps');

exports.getCurrentDate = function(){
    var Dates = new Date();
    var str = Dates.getFullYear()+"年"+Dates.getMonth()+"月"+Dates.getDate()+"日"
    return str;
};

exports.utc2Jtc = utc2Jtc
exports.changeDate = changeDate
exports.ampt = ampt
exports.isEmpty = isEmpty
exports.upload = upload



function utc2Jtc(date){
    var d = Date.parse(date)+9*60*60*1000;
    return changeDate(d);
}


function upload(req,res,_path,cb) {


    var file = req.files[0];


    var filename = file.filename;

    var target_path = path.join(__dirname, _path)
    var originalPath = path.join(__dirname, "../uploads")

    console.log(file);
    console.log(target_path)
    console.log(originalPath);
    var targetName = Math.random().toString(36).substring(2);

    steps(
    function(){
        fs.exists(target_path, this.hold(function(exists) {
           return exists;
        }));
    },
    function(_exists){
        if(!_exists){
            fs.mkdir(target_path,this.hold(function(_result){

            }))
        }
    },
    function(){
        fs.rename(originalPath + "/" + filename, target_path + '/' + targetName + ".jpg", this.hold(function (err) {
            if (err){
                throw err;
                cb(err,null)
            }

        }))
    },function(){
        im.resize({
            srcPath: target_path + '/' + targetName + ".jpg",
            dstPath: target_path + '/' + targetName + "-thumb.jpg",
            height: 450

        }, this.hold(function (err, stdout, stderr) {
            if (err){
                throw err;
                cb(err,null)
            }
            console.log('resized kittens.jpg to fit within 256x256px');
            cb(null,JSON.stringify({targetName: targetName + "-thumb.jpg"}))
        }))
    })()

}

function changeDate(str){
    var now_date, now_date_format;
    now_date = new Date(parseInt(str));
    now_date_format = now_date.getFullYear();

    if (parseInt(now_date.getMonth()) <= 9) {
        now_date_format += "-" + "0" + (parseInt(now_date.getMonth()));
    } else {
        now_date_format += "-" + (parseInt(now_date.getMonth()));
    }
    if (parseInt(now_date.getDate()) <= 9) {
        now_date_format += "-" + "0" + (parseInt(now_date.getDate()));
    } else {
        now_date_format += "-" + (parseInt(now_date.getDate()));
    }

    if (parseInt(now_date.getHours()) <= 9) {
        now_date_format += " " + "0" + (parseInt(now_date.getHours()));
    } else {
        now_date_format += " " + (parseInt(now_date.getHours()));
    }


    if (parseInt(now_date.getMinutes()) <= 9) {
        now_date_format += ":" + "0" + (parseInt(now_date.getMinutes()));
    } else {
        now_date_format += ":" + (parseInt(now_date.getMinutes()));
    }

    if (parseInt(now_date.getSeconds()) <= 9) {
        now_date_format += ":" + "0" + (parseInt(now_date.getSeconds()));
    } else {
        now_date_format += ":" + (parseInt(now_date.getSeconds()));
    }

    return now_date_format;

}

function ampt(timeStr){

    var patt = /([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])T([0-9][0-9]):([0-9][0-9]):([0-9][0-9])\.([0-9][0-9][0-9])Z/;
    var regRes = patt.exec(timeStr);

    if(!isEmpty(regRes)) {
        var d = new Date(regRes[1], regRes[2], regRes[3], regRes[4], regRes[5], regRes[6]);
        return utc2Jtc(d)
    }else{
        return null
    }
}


function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}
