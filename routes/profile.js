/**
 *
 * Created by xuzhongwei on 2/19/16.
 */

var express = require('express');
var router = express.Router();
var profileController = require('../controller/profile.js');

var multer  = require('multer')
var upload = multer({dest: './uploads/'})


router.get("*",checkBlogLogin);

router.post("*",checkBlogPostLogin);


router.get('/',profileController.indexController);
router.post('/update',profileController.updateController);
router.post('/upload',upload.array('files', 1),profileController.uploadController);



function checkBlogLogin(req,res,next){

    var _session = req.session || {}
    _session.loginSession = _session.loginSession || {}
    if(_session.loginSession.login!=1){
        res.redirect('/blog/login');
    }else{
        next();
    }

}

function checkBlogPostLogin(req,res,next){

    var _session = req.session || {}
    _session.loginSession = _session.loginSession || {}
    if(_session.loginSession.login!=1){
        res.end('{err:1,msg:"illegal"}');
    }else{
        next();
    }
}

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return true;


}
module.exports = router;
