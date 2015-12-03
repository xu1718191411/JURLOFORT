/**
 * Created by xuzhongwei on 15/11/18.
 */
var express = require('express');
var router = express.Router();
var d3Controller = require('../controller/d3.js');


/* GET users listing. */

router.get('/',d3Controller.indexController);

router.get('/test',d3Controller.testController);

router.post('/writeJson',d3Controller.writeJsonController);


module.exports = router;
