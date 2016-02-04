/**
 *
 * Created by xuzhongwei on 15/11/29.
 */

function analysis(){
    this.num = 1;
}

analysis.prototype.receiveFromIframe = function(data,data2){
    //var json = JSON.stringify(data[0]);

    var json = {
        "name": "My Analysis",
        "children": [{
            "name":"NormalAnalysis",
            "children":[]
        },{
            "name":"DissentAnalysis",
            "children":[]
        }]
    }

    for(var i in data){
        json.children[0].children.push(data[i])
    }

    if(data2[0] != null){
        for(var j in data2){
            json.children[1].children.push({"name":"DissentExplain"+j,"children":data2[j]});
        }
    }else{
        json.children.splice(1,1);
    }


    console.log("receiveFromIframe");
    console.log(json);
    console.log("data is")
    console.log(data);

    //console.log(JSON.stringify(json));

    return json
}

analysis.prototype.receive = function(jsonFileName){
    document.getElementById("d3Iframe").contentWindow.d3Load("con",jsonFileName);
    //switchShow("s1","s0");
    //switchShow("s2","s3");
}

analysis.prototype.send = function(jsonFileName){
    document.getElementById("d3Iframe").contentWindow.d3Load("pro",jsonFileName);
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