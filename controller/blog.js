/**
 *
 * Created by xuzhongwei on 2/4/16.
 */


var mongo = require("../model/mongo.js");
var mongodb = require("mongodb");
var steps = require("ocsteps");
var tools = require("./tool.js");
var isEmpty = tools.isEmpty

module.exports = {
    testController: function(req, res) {
        res.render('blog/test', {})
    },
    indexController: function(req, res) {

        mongo.find("Articles", {}, {}, function(doc) {
            console.log(doc);
            //res.render('blog/index', {});
            req.session = req.session || {};
            res.render('blog/index', { contents: doc, loginSession: req.session.loginSession });
        })


    },
    detailController: function(req, res) {
        var _id = req.query._id;
        mongo.find("Articles", { _id: new mongodb.ObjectID(_id) }, {}, function(doc) {
            console.log(doc);
            var content = doc[0];
            req.session = req.session || {};
            res.render('blog/detail', { content: content, loginSession: req.session.loginSession })
        })
    },
    signUpController: function(req, res) {
        res.render("blog/signup", {})
    },
    loginController: function(req, res) {

        mongo.connect(function(doc) {
            console.log(doc);
        })

        res.render("blog/login", {})
    },
    registerController: function(req, res) {
        console.log(req.body);
        var name = req.body.name;
        var _class = req.body.class;

        steps(function() {
            mongo.find("ClassMates", { name: name, class: _class }, {}, this.hold(function(doc) {

                if (doc.length == 0) {
                    res.end("{error:1,msg:'不存在这位同学'}");
                } else {
                    return doc[0];
                }
            }))
        }, function(content) {
            console.log(111);
            console.log(content);

            var _profile = content.profile || {};
            _profile.sex = req.body.sex;
            _profile.profile = req.body.profile;
            _profile.mail = req.body.mail;

            mongo.update("ClassMates", { name: content.name, class: content.class }, { $set: { profile: _profile } }, this.hold(function(doc) {
                return content;
            }))

        }, function(content) {
            var tablesName = ["UserInfo17", "UserInfoBro", "UserInfo38"];
            mongo.insert(tablesName[parseInt(req.body.class) - 1], { name: content.name, class: content.class, password: req.body.password }, {}, this.hold(function(doc) {
                console.log(doc);
                if (parseInt(doc.result.ok) == 1 && parseInt(doc.result.n) > 0) {
                    req.session.loginSession = { login: 1, name: content.name, class: content.class }
                    res.end("{error:0,msg:'注册成功'}");
                }
            }))
        })()

    },
    LogoutController: function(req, res) {
        delete req.session.loginSession;
        res.redirect('/blog');
    },
    checkLoginController: function(req, res) {
        console.log(req.body);
        var tablesName = ["UserInfo17", "UserInfoBro", "UserInfo38"];

        mongo.createIfNotExists(tablesName[parseInt(req.body.class) - 1], function(doc) {
            mongo.find(tablesName[parseInt(req.body.class) - 1], { name: req.body.name, class: req.body.class, password: req.body.password }, {}, function(doc) {
                console.log("gggggggg " + tablesName[parseInt(req.body.class) - 1])
                console.log(doc);
                doc = doc || {}
                if (doc.length == 0) {
                    res.end("{error:1,msg:'错误的密码或者名字'}");
                } else {
                    req.session.loginSession = { login: 1, name: req.body.name, class: req.body.class }
                    res.end("{error:0,msg:'登陆成功'}");
                }
            })

        });
    },
    AllTimeLineController: function(req, res) {
        if (isEmpty(req.session.loginSession)) {
            res.redirect("/blog/login")
        }
        var _class = req.session.loginSession.class;
        var tablesName = ["UserInfo17", "UserInfoBro", "UserInfo38"];

        this.renderObj = []
        steps(
            function() {
                mongo.find(tablesName[parseInt(_class) - 1], { class: _class }, {}, this.hold(function(doc) {
                    return doc;
                }))
            },
            function(doc) {

                for (var i in doc) {

                    (function(j, dot, that) {
                        mongo.find("ClassMates", { name: dot.name, class: dot.class }, {}, that.hold(function(docs) {
                            docs[0].profile = docs[0].profile || {}
                            docs[0].profile = docs[0].profile || {};
                            doc[j].profile = docs[0].profile.profile;
                            doc[j]._profile = docs[0].profile;
                            doc[j].__id = docs[0]._id;
                            return doc;
                        }))

                    })(i, doc[i], this)
                }

            },
            function(doc) {
                res.render("blog/allTimeLine", { content: doc, classNumber: req.session.loginSession.class, nameTxt: req.session.loginSession.name })
            })();
    },
    newEventsController: function(req, res) {
        if (isEmpty(req.session.loginSession)) {
            res.redirect("/blog/login")
        }

        var _class = req.session.loginSession.class;
        var tablesName = ["UserInfo17", "UserInfoBro", "UserInfo38"];


        steps(function() {
            mongo.find("ClassMates", { class: _class, }, { name: 1, timeLine: 1 }, this.hold(function(doc) {

                doc = eval(doc) || []
                var resArr = []
                for (var i in doc) {
                    var _resArr = eval(doc[i].timeLine) || []
                    for (var j in _resArr) {
                        if (parseInt(_resArr[j].anonymity) == 2 || parseInt(_resArr[j].display) == 2) {

                            _resArr[j].start = tools.ampt(_resArr[j].start)
                            _resArr[j].targetName = _resArr[j].targetname ? _resArr[j].targetname.replace("-thumb", "") : ""
                            resArr.push({ __id: doc[i]._id, name: doc[i].name, from: _resArr[j].from, content: _resArr[j] })
                        }
                    }
                }

                console.log(resArr)
                return resArr;
            }))
        }, function(resArr) {
            res.render("blog/newEvents", { classNumber: req.session.loginSession.class, nameTxt: req.session.loginSession.name, resArr: resArr });
        })()


    },
    saveTxtDataController: function(req, res) {

        steps(function() {
            req.session = req.session || {}

            if (!req.session._id) {
                res.end("no _id;");
            }
        }, function() {
            mongo.update("ClassMates", { _id: new mongodb.ObjectID(req.session._id) }, { $set: { timeLine: req.body.dataSet } }, function(doc) {
                console.log("updating")
                console.log(doc);
                res.end("{err:0,doc:" + doc + "}")
            })
        })()
    },
    historySaveTxtDataController: function(req, res) {

        req.session = req.session || {}
        if (isEmpty(req.session.loginSession)) {
            res.end("{err:1,msg:'not login'}")
        }
        var from = { fromName: req.session.loginSession.name, fromClass: req.session.loginSession.class }
        var ToUserid = req.session._id
        var content = req.body.content;
        var contentDetail = req.body.contentDetail;
        var anonymity = req.body.anonymity;
        var targetname = req.body.targetname;
        var date = Date.parse(new Date());
        var toUserName;
        var toUserClass;

        var insertObj = {};
        insertObj.from = from;
        insertObj.content = content;
        insertObj.contentDetail = contentDetail;
        insertObj.anonymity = anonymity;
        insertObj.targetname = targetname;
        insertObj.date = date;
        insertObj.randomStr = randomString(6);



        steps(function() {
            mongo.find("ClassMates", { _id: new mongodb.ObjectID(req.session._id) }, {}, this.hold(function(doc) {
                if (doc.length < 1) {
                    res.end("{err:1,msg:'We do not know who you want to comment to'}");
                    this.terminate();
                } else {
                    return doc[0]
                }
            }))
        }, function(content) {
            toUserName = content.name;
            toUserClass = content.class;
            insertObj.toUserName = toUserName;
            insertObj.toUserClass = toUserClass;



            mongo.createIfNotExists("historyList" + from.fromClass, this.hold(function(res) {
                if (parseInt(res) > 0) {
                    console.log("create table" + "historyList" + from.fromClass);
                } else {
                    console.log("table " + "historyList" + from.fromClass + " already exists")
                }
            }))

        }, function() {
            mongo.insert("historyList" + from.fromClass, insertObj, {}, function(doc) {
                if (parseInt(doc.insertedCount) > 0) {
                    console.log(doc.insertedIds[0]['id'])
                    res.end("{err:0,msg:'" + insertObj.randomStr + "'}")
                }
            })

        })()
    },
    updateHistorySaveTxtDataController: function(req, res) {
        req.session = req.session || {}
        if (isEmpty(req.session.loginSession)) {
            res.end("{err:1,msg:'not login'}")
        }
        var updateObj = {}
        var content = req.body.content;
        var contentDetail = req.body.contentDetail;
        var anonymity = req.body.anonymity;
        var targetname = req.body.targetname;
        var date = Date.parse(new Date());

        updateObj.content = content;
        updateObj.contentDetail = contentDetail;
        updateObj.anonymity = anonymity;
        updateObj.targetname = targetname;
        updateObj.date = date;

        var historyRandom = req.body.historyRandom;

        steps(function() {
            mongo.createIfNotExists("historyList" + req.body["from[class]"], this.hold(function(doc) {

            }))
        }, function() {
            mongo.update("historyList" + req.body["from[class]"], { randomStr: historyRandom }, { $set: { content: content, contentDetail: contentDetail, anonymity: anonymity, targetname: targetname, date: date } }, this.hold(function(doc) {
                res.end("{err:0,msg:'ok'}")
            }))
        })()


    },
    deleteHistorySaveTxtDataController: function(req, res) {
        req.session = req.session || {}
        if (isEmpty(req.session.loginSession)) {
            res.end("{err:1,msg:'not login'}")
        }

        steps(function() {
            mongo.createIfNotExists("historyList" + req.body["from[class]"], this.hold(function(doc) {

            }))
        }, function() {
            mongo.remove("historyList" + req.body["from[class]"], { randomStr: req.body.historyRandom }, {}, this.hold(function(doc) {
                console.log(doc.result.n)

                res.end("{err:0,msg:'ok'}")

            }))
        })()
    }
}



function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}