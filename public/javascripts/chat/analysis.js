/**
 *
 * Created by xuzhongwei on 15/11/29.
 */

function analysis(){
    this.num = 1;
}

analysis.prototype.receiveFromIframe = function(data,dissentObj){
    //var json = JSON.stringify(data[0]);

    var json = {
        "name": "My Analysis",
        "children": []
    }

    for(var i in data){
        json.children.push(data[i])
    }

    //console.log(JSON.stringify(json));

    return json
}

analysis.prototype.receive = function(){
    document.getElementById("d3Iframe").contentWindow.d3Load("con");
    //switchShow("s1","s0");
    //switchShow("s2","s3");
}

analysis.prototype.send = function(){
    document.getElementById("d3Iframe").contentWindow.d3Load("pro");
    switchShow(".s1",".s0");
    switchShow(".s3",".s2");
}

analysis.prototype.click = function(d,i){
    $("#toScale").click();
}

analysis.prototype.saveDissent = function(){
    var title = $("#myModalTitle").text();
    var val = $("#myModalContent").val();
    document.getElementById("statementIframe").contentWindow.addDissent(title,val);
    $("#myModalClose").click();
    $("#myModalContent").val("");
}

analysis.prototype.buildDissentInput = function(obj){
    document.getElementById("analysisIframe").contentWindow.buildDissentInput(obj);
}

var switchShow = function(s1,s2){
    $(s1).show();
    $(s2).hide();
}