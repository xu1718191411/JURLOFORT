/**
 *
 * Created by xuzhongwei on 12/3/15.
 */


exports.getCurrentDate = function(){
    var Dates = new Date();
    var str = Dates.getFullYear()+"年"+Dates.getMonth()+"月"+Dates.getDate()+"日"
    return str;
};

exports.utc2Jtc = utc2Jtc
exports.changeDate = changeDate
exports.ampt = ampt
exports.isEmpty = isEmpty




function utc2Jtc(date){
    var d = Date.parse(date)+9*60*60*1000;
    return changeDate(d);
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
