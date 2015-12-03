/**
 *
 * Created by xuzhongwei on 11/30/15.
 */

function statusAdjust(){
    this.num = 0;
}

statusAdjust.prototype.adjust = function(pos,status){
    switch(status){
        case "proSendClaim":
            if(pos=="pro"){
                switchShow(".s0",".s1");
                close([".s2",".s3"]);
            }else{
                switchShow(".s0",".s1");
                switchShow(".s2",".s3");
            }
            break;
        case "conSendAnalysis":
            if(pos=="pro"){
                switchShow(".s1",".s0");
                close([".s2",".s3"]);
            }else{
                switchShow(".s1",".s0");
                switchShow(".s3",".s2");
            }
            break;
        case "conSendClaim":
            if(pos=="pro"){
                switchShow(".s0",".s1");
                switchShow(".s2",".s3");

            }else{
                switchShow(".s0",".s1");
                close([".s2",".s3"]);
            }
            break;
        case "proSendAnalysis":
            if(pos=="pro"){
                switchShow(".s1",".s0");
                switchShow(".s3",".s2");

            }else{
                switchShow(".s1",".s0");
                close([".s2",".s3"]);
            }
            break;
    }
}


var switchShow = function(s1,s2){
    $(s1).show();
    $(s2).hide();
}

var close = function(arr){
    for(var i in arr){
        $(arr[i]).hide();
    }
}

var open = function(arr){
    for(var i in arr){
        $(arr[i]).show();
    }
}