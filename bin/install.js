/**
 *
 * Created by xuzhongwei on 6/20/16.
 */

var mongo = require("../model/mongo.js");
var Steps = require('ocsteps');

function initialDatabase(that){
    var database = ["LatestAnalysisMsg","LatestStatementMsg","analysisLog","debateMembers","debateStatus","statementLog","themes","userStatus"]
    var members = [
        {
            "username": "miyoshi",
            "password": "miyoshi",
            "type": 0,
            "group": "miyoshi"
        },
        {
            "username": "syoui",
            "password": "syoui",
            "type": 1,
            "group": "miyoshi"
        }

    ]


    var fn = function(_i,_this){
        _this.step(function(){
            console.log(_i)
            console.log(database[_i])


            mongo.createIfNotExists(database[_i],_this.hold(function(_res){
                    console.log(_res)
                    console.log(database[_i])
                    if(_res == 0 && database[_i] == "debateMembers"){
                            for(var s=0;s<members.length;s++){
                                (function(_s,__this){
                                    __this.step(function(){
                                        mongo.insert(database[_i],members[_s],{},function(){

                                        })
                                    })
                                })(s,_this)
                            }
                    }
            }))
        })
    }


    for(var i=0;i<database.length;i++){
        console.log(1111)
        fn(i,that)

    }


}

var obj = {}
obj.initialDatabase = initialDatabase
module.exports = obj
