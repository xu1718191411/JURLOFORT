/**
 *
 * Created by xuzhongwei on 3/19/16.
 */

var express = require('express');
var router = express.Router();
var lifeController = require('../controller/funcky.js');

var multer  = require('multer')
var upload = multer({dest: './uploads/'})




router.get('/',lifeController.indexController);

module.exports = router;
