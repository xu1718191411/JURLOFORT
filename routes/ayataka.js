/**
 * Created by xuzhongwei on 2016/11/17.
 */
var express = require('express');
var router = express.Router();
var ayatakaController = require('../controller/ayataka.js');
router.post('/pasonaTechAyatakaEventPost',ayatakaController.pasonaTechAyatakaEventPostController);

module.exports = router;
