/**
 *
 * Created by xuzhongwei on 2/1/16.
 */


var express = require('express');
var router = express.Router();
var adminController = require('../controller/admin.js');

var multer  = require('multer')
var upload = multer({dest: './uploads/'})


/* GET users listing. */

router.get(/[^\/login]/,checkAdminLogin);

router.post(/[^\/login]/,checkAdminPostLogin);

router.get('/',adminController.indexController);
router.get('/login',adminController.loginController);
router.post('/login',adminController.loginPostController);
router.get('/form',adminController.formController);
router.post('/post',adminController.postController);
router.get('/list',adminController.listController);
router.get('/del',adminController.delController);
router.get('/edit',adminController.editController);
router.post('/update',adminController.updateController);
router.post('/upload',upload.array('files', 1),adminController.uploadController);
router.get('/timeLine',adminController.timeLineController);
router.post('/postClassMate',adminController.postClassMateController);
router.get('/editClassMate',adminController.editClassMateController);
router.post('/updateClassMate',adminController.updateClassMateController);
router.get('/delClassMate',adminController.delClassMateController);
router.get('/personTimeLine',adminController.personTimeLineController);
router.post('/saveTxtData',adminController.saveTxtDataController);
router.get('/logout',adminController.logoutController)

function checkAdminLogin(req,res,next){

    console.log(1111111111111);
    console.log(req.url);
    console.log(2222222222)
    var adminSession = req.session || {}
    if(adminSession.adminLogin!=1){
        res.redirect('/admin/login');
    }else{
        next();
    }

}

function checkAdminPostLogin(req,res,next){
    var adminSession = req.session || {}

    if(adminSession.adminLogin!=1){
        res.end('{err:1,msg:"illegal"}');
    }else{
        next();
    }
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}


module.exports = router;
