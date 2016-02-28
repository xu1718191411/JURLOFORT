/**
 * Created by xuzhongwei on 2/9/16.
 */

var express = require('express');
var router = express.Router();
var timeLineController = require('../controller/timeLine.js');

var multer  = require('multer')
var upload = multer({dest: './upload/'})



/* GET users listing. */


router.get('/',timeLineController.indexController);
router.get('/add',timeLineController.addController);
router.post('/upload',upload.array('files', 1),timeLineController.uploadController);

module.exports = router;

