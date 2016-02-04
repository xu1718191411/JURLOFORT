/**
 *
 * Created by xuzhongwei on 12/3/15.
 */
var fs = require("fs");
var Steps = require("ocsteps") ;

function claimFile(){

}

claimFile.prototype.write = function(msg,support,order){

    var filePath = '/Users/xuzhongwei/Dropbox/research_project/home/public/data/d3/'+support+"Claim.json"



    Steps(function(){
            fs.exists(filePath, this.hold(function (exists) {
                    if(!exists){
                        return false;
                    }else{
                        fs.readFile(filePath, this.hold(function (err, data) {
                            if (err) throw err;
                            if(JSON.parse(JSON.stringify(data)).data.length<1){
                                return false;
                            }else{
                                return data;
                            }
                        }));
                    }
            }));
    },
    function(res){
            console.log("res is ")
            console.log(res);

            arrString = !res?[]:JSON.parse(res);

            console.log(msg)
            msg.order = order;

            arrString.push(msg);
            console.log("arrString")
            console.log(arrString);

            fs.writeFile(filePath, JSON.stringify(arrString), function (err) {
                if (err) throw err;
                console.log('It\'s saved!');
            });

    })()


}


module.exports = new claimFile();