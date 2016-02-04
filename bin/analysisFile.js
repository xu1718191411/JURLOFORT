/**
 *
 * Created by xuzhongwei on 15/12/06.
 */
var fs = require("fs");
var Steps = require("ocsteps") ;

function analysisFile(){

}


analysisFile.prototype.write = function(session,msg,io,socket){


    var b = session.user.support+"analysis";

    session[b] = session[b] || 0;

    session[b] = session[b] + 1;

    session.save();

    console.log(b+" is");
    console.log(session[b]);

    console.log("Analysis msg is");
    console.log(msg);

    Steps(
        function(){
            fs.writeFile('/Users/xuzhongwei/Dropbox/research_project/home/public/data/d3/'+b+session[b]+'.json', msg, this.hold(function (err) {
                if (err) throw err;
                console.log('It\'s saved!');
            }));
        },function(){
            session.nowStatus = session.user.support+"SendAnalysis";
            session.save();
            io.sockets.emit("checkStatus",session.nowStatus);
        },function(){
            var jsonObject = JSON.parse(msg);
            jsonObject.jsonFileName = b+session[b]+'.json';
            socket.broadcast.emit('receiveAnalysis',jsonObject);
            socket.emit('sendAnalysis',jsonObject);
        }
    )();
}

module.exports = new analysisFile();
