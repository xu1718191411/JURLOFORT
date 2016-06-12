/**
 *
 * Created by xuzhongwei on 4/6/16.
 */



$(".proState").click(function(){
    var i = $(".proState").index(this)
    var top = $(".resultPro")[i].offsetTop
    $("#right").animate({scrollTop:top},1000)
    })

$(".conState").click(function(){
    var i = $(".conState").index(this)
    var top = $(".resultCon")[i].offsetTop
    $("#right").animate({scrollTop:top},1000)
    })

$(".proDState").click(function(){
    var i = $(".proDState").index(this)
    var top = $(".resultDPro")[i].offsetTop
    $("#right").animate({scrollTop:top},1000)
    })

$(".conDState").click(function(){
    var i = $(".conDState").index(this)
    var top = $(".resultDCon")[i].offsetTop
    $("#right").animate({scrollTop:top},1000)
    })


$("#resultConfirm").click(function(){

    var arr = $("#analysisResult").find("input[type=checkbox]")

    for(var i=0;i<arr.length;i++){
        if($(arr[i]).prop("checked")){
            //有ずれる
        }else{
            //满意评判的结果
            addResultToRightMapBox()
            $("#analysisResult").hide()
            $("#wait").show()
        }
    }


})

function addEvidence(that){
    var _html = ($(that).parents(".warrant").find(".evidence:last").prop('outerHTML'));
    $(that).parents(".warrant").find(".evidence:last").after(_html);
    $(that).parents(".warrant").find(".evidence:last").after().find(".remove:hidden").show();
    $(that).parents(".warrant").find(".evidence:last").find(".addWarrant:first").remove();
    window.scrollTo(0,document.body.scrollHeight)
    return false;
    }

function addWarrant(that){
    var _html = ($(that).parents(".claim").find(".warrant:last").prop('outerHTML'));
    $(that).parents(".claim").find(".warrant:last").after(_html);
    $(that).parents(".claim").find(".warrant:last").after().find(".remove").eq(0).show()
    $(that).parents(".claim").find(".warrant:last").after().find(".evidence").not(":eq(0)").remove()
    //$(that).parents(".claim").find(".warrant:last").find(".addClaim").remove();
    $(that).parents(".claim").find(".warrant:last").find(".addClaim").hide();
    $(that).hide();
    window.scrollTo(0,document.body.scrollHeight)
    return false;
    }

function addClaim(that){
    var _html = ($(that).parents(".claim:last").prop('outerHTML'));
    $(that).parents(".claim:last").after(_html);
    $(".claim:last").find(".warrant").not(":last").remove();
    $(".claim:last").find(".warrant:last").find(".addClaim:hidden").show();
    $(".claim:last").find(".remove").eq(0).show();
    $(that).hide();
    window.scrollTo(0,document.body.scrollHeight)
    return false;
    }

function _remove(that){
    var identity;
    if($(that).parents('.evidence').length>0){
    identity = 1
    }else if($(that).parents('.warrant').length>0){
    identity = 2
    }else{
    identity = 3
    }


    switch(identity){
    case 1:
    $(that).parents('.evidence').remove();
    break;
    case 2:
    $(that).parents('.claim').find(".warrant:eq(-2)").find('.addWarrant:hidden').show();
    $(that).parents('.warrant').remove();
    break;
    case 3:
    $(that).parents('.claim').remove();
    $(".claim:last").find(".addClaim:hidden").show();
    break;
    default:

    break;
    }

    return false;
    }


function analysisResultComesFromOpposiote(){
    boundaryN = 1
    dissentObj = [{"claimDissnet":"","warrant":[{"evidenceDissent":[null]}]},{"claimDissnet":"","warrant":[{"evidenceDissent":[null]}]}]
    var _objF = [{"claimTxt":"勉強用の時間が減少しても，学業が疎かにならない","warrant":[{"warrantTxt":"大切にするから，時間の効率がよくなって，勉強の効果も上がる","evidence":[{"evidenceTxt":"勉強用の時間が少なければ，その時間を大切することになる"}]}]},{"claimTxt":"アルバイトを通じて勉強もできる","warrant":[{"warrantTxt":"アルバイトで得られた観察力，考え力のような力は学校での勉強も役たつのではないでしょうか","evidence":[{"evidenceTxt":"周りのものを見たり，考えたりすることができる"}]}]}]
    _obj = _objF
    var _str = ""
    for(var i=0;i<_objF.length;i++){
        if(i<boundaryN){
            //如果是对前几位異議説明的分析的话
            _str += "<div class='row'>異議説明分"+(i+1)+"分析結果</div>"
        }else{
            //如果是对后几位オリジナル意見的分析的话
            _str += "<div class='row'>オリジナル意見分析結果</div>"
        }

        var claimDissentStr = parseInt(dissentObj[i]['claimDissent'])==1?"異議":"&nbsp;"


        _str += '<div id="claimSample">'+
            '<div class="row">'+
            '<div class="col-sm-1">'+
            '主張'+
            '</div>'+
            '<div class="col-sm-8">'+ _objF[i].claimTxt+
            '</div><div class="col-sm-1">'+claimDissentStr+'</div>'+
            '<div class="col-sm-1"><input type="checkbox" value="1"> ずれる</div>'+
            '</div>'

        for(var j=0;j<_objF[i]['warrant'].length;j++){
            var warrantDissentStr = parseInt(dissentObj[i]['warrant'][j]['warrantDissent'])==1?"異議":"&nbsp;"
            _str += '<div id="warrantSample">'+
                '<div class="row">'+
                '<div class="col-sm-1">'+
                '論拠'+
                '</div>'+
                '<div class="col-sm-7">'+_objF[i]['warrant'][j]['warrantTxt']+
                '</div><div class="col-sm-2">'+warrantDissentStr+'</div>'+
                '<div class="col-sm-1"><input type="checkbox" value="1"> ずれる</div>'+
                '</div>'


            for(var k=0;k<_objF[i]['warrant'][j]['evidence'].length;k++){
                var evidenceDissentStr = parseInt(dissentObj[i]['warrant'][j]['evidenceDissent'][k])==1?"異議":"&nbsp;"
                _str +=   '<div id="evidenceSample">'+
                    '<div class="row">'+
                    '<div class="col-sm-1">'+
                    '根拠'+
                    '</div>'+
                    '<div class="col-sm-6">'+_objF[i]['warrant'][j]['evidence'][k]['evidenceTxt']+
                    '</div><div class="col-sm-3">'+evidenceDissentStr+'</div>'+
                    '<div class="col-sm-1"><input type="checkbox" value="1"> ずれる</div>'+
                    '</div>'+
                    '</div><!-- evidenceSample -->'
            }

            _str += '</div><!-- warrantSample  -->'
        }

        _str += '</div><!-- claimSample -->'
    }


    $($("#analysisResult").find("#resultConfirm")[0]).before(_str)
}


analysisResultComesFromOpposiote()

function _submit(){

    //重新规划制限時間
    initialTimeCount()

    //boundaryN = 1
    //这是一个全局变量
    //boundaryN代表.claim的前多少位是異議説明,这里的boundaryN要从后端取数据所以在此以1为例子

    _obj = []
    //这是一个全局变量
    //var dissentObj = [{"claimDissent":1,"warrant":[{"warrantDissent":1,"evidenceDissent":[1]}]}]
    dissentObj = []

    var _claim = $("#form1").find(".down").eq(0).find(".claim");

    for(var i=0;i<_claim.length;i++){
    var __obj = {"claimTxt":"","warrant":[]}
    __obj.claimTxt = $(_claim[i]).find(".claimTxt").val();

    var __dissentObj = {"claimDissnet":"","warrant":[]}
    __dissentObj.claimDissent = $(_claim[i]).find(".claimTxt").next().find("input:checked").val()

    var _warrant = $(_claim[i]).find(".warrant");

    for(var j=0;j<_warrant.length;j++){
    var ___obj = {"warrantTxt":"","evidence":[]}
    ___obj.warrantTxt = $(_warrant[j]).find(".warrantTxt").val();

    var ___dissentObj = {"warrantDissent":"","evidenceDissent":[]}
    ___dissentObj.warrantDissent = $(_warrant[j]).find(".warrantTxt").next().find("input:checked").val()



    var _evidence = $(_warrant[j]).find(".evidence");

    for(var k=0;k<_evidence.length;k++){
    ___obj.evidence.push({"evidenceTxt":$(_evidence[k]).find(".evidenceTxt").val()});
    ___dissentObj.evidenceDissent.push($(_evidence[k]).find(".evidenceTxt").next().find("input:checked").val())

    }

    __obj.warrant.push(___obj);
    __dissentObj.warrant.push(___dissentObj)

    }

    _obj.push(__obj);
    dissentObj.push(__dissentObj)



    console.log(_obj);
    console.log("--------")
    console.log(dissentObj)
    }


    var i = 0;
    //这个数组里面放了分段数据，比如说有g0 .claim .claim ,g1 .claim ,g2 .claim ,c0 .claim .claim
    //那么fenduanArr的值为 [2,1,1,2]
    //或者比如说 g0 .claim .claim c0 .claim
    //那么fenduanArr的值为 [2,1]
    //或者比如说 c0 .claim
    //那么fenduanArr的值为 [1]
    var fenduanArr = [];
    while($("#g"+i).length>0){
        var j = i + 1
        if($("#g"+j).length>0){
            fenduanArr.push($(".down").find("#g"+j).eq(0).prevAll(".claim").length - $(".down").find("#g"+i).eq(0).prevAll(".claim").length)
        }else{
            fenduanArr.push($(".down").find("#c0").eq(0).prevAll(".claim").length - $(".down").find("#g"+i).eq(0).prevAll(".claim").length)
        }
        i++;
    }

    fenduanArr.push(_obj.length - $(".down").find("#c0").eq(0).prevAll(".claim").length)

    console.log("fenduanArr is")
    console.log(fenduanArr)

    socket.emit("makeAnalysis",{_obj:_obj,dissentObj:dissentObj,fenduanArr:fenduanArr})



    }

//把分析的结果，包括对異議説明分的分析和对オリジナル意見的分心放到右上方的討論ロジックマップ里面去
function addResultToRightMapBox(fenduanArr){

    //boundaryN这个变量是从服务器段取得，代表对方有多少个異議説明


    console.log("fenduanArr is the following ")
    console.log(fenduanArr)


    if(boundaryN<1){

    //test1(0,$("#c0").prevAll(".claim").length)
    //test2($("#c0").prevAll(".claim").length,_obj.length)
    test2(0,fenduanArr[0])
    }else{

    for(var i=0;i<boundaryN;i++){


    var a = 0;
    var b = 0;
    for(var s =0;s<i;s++){
        a += fenduanArr[s]
    }

    for(var s =0;s<i+1;s++){
        b += fenduanArr[s]
    }

        console.log("a is " + a)
        console.log("b is " + b)

    if(i==boundaryN-1){
        test1(a,fenduanArr.length-1)
    //test1($("#g"+i).prevAll(".claim").length,$("#c0").prevAll(".claim").length)

    }else{
        test1(a,b)
        //test1($("#g"+i).prevAll(".claim").length,$("#g"+(i+1)).prevAll(".claim").length)
    }

    }

    var c = 0;

    for(var s=0;s<fenduanArr.length-1;s++){
        c += fenduanArr[s]
    }
        console.log("c is "+c)
    //test2($("#c0").prevAll(".claim").length,_obj.length)
    test2(c,_obj.length)
    }

}


function test1(_start,_end){

    if(window.status==0){
        var keyword = "Con"
    }else{
        var keyword = "Pro"
    }

    $($("#right").find("#rightContainer")[0]).append($($("#copy").find(".resultD"+keyword)[0]).prop("outerHTML"))
    for(var i=_start;i<_end;i++){
    //再从copy的盒子里面取出放入claim的框架
    var claimKJ = $("#copy").find(".resultD"+keyword).eq(0).find(".resultD"+keyword+"A2").eq(0).children(".row").eq(0)
    //然后再copy容器存放claim的盒子里放入需要放入的claim文字

    if(parseInt(dissentObj[i]['claimDissent'])==1){
    claimKJ.children("div").eq(1).html("<span class='glyphicon glyphicon-question-sign'></span>"+_obj[i]['claimTxt'])
    }else{
    claimKJ.children("div").eq(1).text(_obj[i]['claimTxt'])
    }

        console.log(claimKJ.prop("outerHTML"))

    //然后把copy容器里已经拼装好的claimdiv段拿过来放到相应的位置里面
    $("#right").find(".resultD"+keyword).eq(-1).find(".resultD"+keyword+"A1").eq(0).append(claimKJ.prop("outerHTML"))
    //这里添加異議説明的ロジックマップ
        console.log($("#right").find(".resultD"+keyword).eq(-1).find(".resultD"+keyword+"A1").eq(0))

    for(var j=0;j<_obj[i]['warrant'].length;j++){
    var warrantKJ = $("#copy").find(".resultD"+keyword).eq(0).find(".resultD"+keyword+"A2").eq(0).children(".row").eq(1)

    if(parseInt(dissentObj[i]['warrant'][j]['warrantDissent'])==1){
    warrantKJ.children("div").eq(2).html("<span class='glyphicon glyphicon-question-sign'></span>"+_obj[i]['warrant'][j]['warrantTxt'])
    }else{
    warrantKJ.children("div").eq(2).text(_obj[i]['warrant'][j]['warrantTxt'])
    }

    $("#right").find(".resultD"+keyword).eq(-1).find(".resultD"+keyword+"A1").eq(0).append(warrantKJ.prop("outerHTML"))

    for(var k=0;k<_obj[i]['warrant'][j]['evidence'].length;k++){
    var evidenceKJ = $("#copy").find(".resultD"+keyword).eq(0).find(".resultD"+keyword+"A2").eq(0).children(".row").eq(2)

    if(parseInt(dissentObj[i]['warrant'][j]['evidenceDissent'][k])==1){
    evidenceKJ.children("div").eq(2).html("<span class='glyphicon glyphicon-question-sign'></span>"+_obj[i]['warrant'][j]['evidence'][k]['evidenceTxt'])
    }else{
    evidenceKJ.children("div").eq(2).text(_obj[i]['warrant'][j]['evidence'][k]['evidenceTxt'])
    }


    $("#right").find(".resultD"+keyword).eq(-1).find(".resultD"+keyword+"A1").eq(0).append(evidenceKJ.prop("outerHTML"))
    }
    }
    }
    }

function test2(_start,_end){

    if(window.status==0){
        var keyword = "Con"
    }else{
        var keyword = "Pro"
    }

    $($("#right").find("#rightContainer")[0]).append($($("#copy").find(".result"+keyword)[0]).prop("outerHTML"))

    for(var i=_start;i<_end;i++){

    //再从copy的盒子里面取出放入claim的框架
    var claimKJ = $("#copy").find(".result"+keyword).eq(0).find(".result"+keyword+"A2").eq(0).children(".row").eq(0)
    //然后再copy容器存放claim的盒子里放入需要放入的claim文字

    if(parseInt(dissentObj[i]['claimDissent']) == 1){
    claimKJ.children("div").eq(1).html("<span class='glyphicon glyphicon-question-sign'></span>"+_obj[i]['claimTxt'])
    }else{
    claimKJ.children("div").eq(1).text(_obj[i]['claimTxt'])
    }


    //然后把copy容器里已经拼装好的claimdiv段拿过来放到相应的为治理
    $("#right").find(".result"+keyword).eq(-1).find(".result"+keyword+"A1").eq(0).append(claimKJ.prop("outerHTML"))
    //这里添加異議説明的ロジックマップ


    for(var j=0;j<_obj[i]['warrant'].length;j++){
    var warrantKJ = $("#copy").find(".result"+keyword).eq(0).find(".result"+keyword+"A2").eq(0).children(".row").eq(1)



    if(parseInt(dissentObj[i]['warrant'][j]['warrantDissent'])==1){
    warrantKJ.children("div").eq(2).html("<span class='glyphicon glyphicon-question-sign'></span>"+_obj[i]['warrant'][j]['warrantTxt'])
    }else{
    warrantKJ.children("div").eq(2).text(_obj[i]['warrant'][j]['warrantTxt'])
    }
    $("#right").find(".result"+keyword).eq(-1).find(".result"+keyword+"A1").eq(0).append(warrantKJ.prop("outerHTML"))

    for(var k=0;k<_obj[i]['warrant'][j]['evidence'].length;k++){
    var evidenceKJ = $("#copy").find(".result"+keyword).eq(0).find(".result"+keyword+"A2").eq(0).children(".row").eq(2)



    if(parseInt(dissentObj[i]['warrant'][j]['evidenceDissent'][k])){
    evidenceKJ.children("div").eq(2).html("<span class='glyphicon glyphicon-question-sign'></span>"+_obj[i]['warrant'][j]['evidence'][k]['evidenceTxt'])
    }else{
    evidenceKJ.children("div").eq(2).text(_obj[i]['warrant'][j]['evidence'][k]['evidenceTxt'])
    }

    $("#right").find(".result"+keyword).eq(-1).find(".result"+keyword+"A1").eq(0).append(evidenceKJ.prop("outerHTML"))
    }
    }
    }
    }

function showNextStep(){


    $("#wait").hide()
    //var dissentObj = [{"claimDissent":1,"warrant":[{"warrantDissent":1,"evidenceDissent":[1]}]}]

    $("#form2").show()

    $("#form2 #area").html("")

    var dissentStatement = $(".dissentStatement").prop('outerHTML');
    var originalStatement = $(".originalStatement").prop('outerHTML');

    var dissentTxtArr = []

    for(var i=0;i<dissentObj.length;i++){
    if(parseInt(dissentObj[i]['claimDissent'])==1){$("#form2 #area").append(dissentStatement);dissentTxtArr.push([i,-1,-1])}
    for(var j=0;j<dissentObj[i]['warrant'].length;j++){
    if(parseInt(dissentObj[i]['warrant'][j]['warrantDissent'])==1){$("#form2 #area").append(dissentStatement);dissentTxtArr.push([i,j,-1])}
    for(var k=0;k<dissentObj[i]['warrant'][j]['evidenceDissent'].length;k++){
    if(parseInt(dissentObj[i]['warrant'][j]['evidenceDissent'][k])==1){$("#form2 #area").append(dissentStatement);dissentTxtArr.push([i,j,k])}
    }
    }
    }

    //在非最后一个每一个textarea盒子上面标明这里要解释的文字是针对哪个異議的解释
    addDissentTextToEachBox(dissentTxtArr)


    $("#form2 #area").append(originalStatement)

    $("#form2").find(".dissentStatement,.originalStatement").css("display","block")

    }

//给每个異議説明分析form标明具体是针对哪个異議的
function addDissentTextToEachBox(dissentTxtArr){
    var textArr = []
    for(var i=0;i<dissentTxtArr.length;i++){
    if(dissentTxtArr[i][2] == -1 && dissentTxtArr[i][1] == -1){
    //claimDissent
    textArr.push(_obj[dissentTxtArr[i][0]]['claimTxt'])
    }else if(dissentTxtArr[i][2] == -1){
    //warrantDissent
    textArr.push(_obj[dissentTxtArr[i][0]]['warrant'][dissentTxtArr[i][1]]['warrantTxt'])
    }else{
    //evidenceDissent
    textArr.push(_obj[dissentTxtArr[i][0]]['warrant'][dissentTxtArr[i][1]]['evidence'][dissentTxtArr[i][2]]['evidenceTxt'])
    }
    }


    for(var i=0;i<textArr.length;i++){
    $("#form2 #area").find(".stateContent").eq(i).text(textArr[i])
    }
    console.log(textArr)
    }

