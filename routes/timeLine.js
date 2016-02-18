/**
 * Created by xuzhongwei on 2/9/16.
 */

var express = require('express');
var router = express.Router();
var timeLineController = require('../controller/timeLine.js');




/* GET users listing. */


router.get('/',timeLineController.indexController);
router.get('/add',timeLineController.addController);

module.exports = router;

