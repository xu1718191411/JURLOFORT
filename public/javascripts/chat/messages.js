/**
 *
 * Created by xuzhongwei on 15/11/28.
 */


function messages(){
    this.num = 0;
}

messages.prototype.receive = function (msg,pos){
    this.num++;
    writeContent("._s0","Formal Statement<br/>"+msg.textContent,"html");
    var str = "<p>Dissent Items</p>";
    if(msg.dissentContentsArr.length>1){
        for(var i=0;i<msg.dissentContentsArr.length;i++){
            str += "<p>"+(i+1)+"."+msg.dissentContentsArr[i].content+"</p>";
        }


        writeContent(".__s0",str,"html");
    }

    if(pos==2){
            $("#normalAnalyzeItem").html("normalAnalyze Item<br/>"+msg.textContent);
    }

    var string = assemble(this.num,msg.textContent,pos);
    output(string);
}

var assemble = function(num,msg,pos){
    var _class = parseInt(pos)==1?"chat-list_list_item":"chat-list_list_item2";
    var string = '<li class='+_class+'>'+
        '<span>'+num+'.</span>'+msg+'</li>';
    return string;
}

var output = function(string){
    $("#recM").append(string);
    //switchShow(".s0",".s1");
    //switchShow(".s2",".s3");
}

var switchShow = function(s1,s2){
    $(s1).show();
    $(s2).hide();
}

var writeContent = function(id,string,type){
    type = type || "text";
    if(type=="text"){
        $(id).text(string);
    }else{
        $(id).html(string);
    }

}


