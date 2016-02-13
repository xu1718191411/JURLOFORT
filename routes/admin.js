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


router.get('/',adminController.indexController);
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
router.get('/personTimeLine',adminController.personTimeLineController);
router.post('/saveTxtData',adminController.saveTxtDataController);


module.exports = router;
