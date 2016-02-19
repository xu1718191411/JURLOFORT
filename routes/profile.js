/**
 *
 * Created by xuzhongwei on 2/19/16.
 */

var express = require('express');
var router = express.Router();
var profileController = require('../controller/profile.js');


router.get('/',profileController.indexController);

module.exports = router;
