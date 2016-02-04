/**
 *
 * Created by xuzhongwei on 2/1/16.
 */


var express = require('express');
var router = express.Router();
var adminController = require('../controller/admin.js');




/* GET users listing. */


router.get('/',adminController.indexController);
router.get('/form',adminController.formController);
router.post('/post',adminController.postController);
router.get('/list',adminController.listController);
router.get('/del',adminController.delController);
router.get('/edit',adminController.editController);
router.post('/update',adminController.updateController);

module.exports = router;
