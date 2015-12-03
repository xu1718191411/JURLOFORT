/**
 *
 * Created by xuzhongwei on 12/3/15.
 */


exports.getCurrentDate = function(){
    var Dates = new Date();
    var str = Dates.getFullYear()+"年"+Dates.getMonth()+"月"+Dates.getDate()+"日"
    return str;
};


