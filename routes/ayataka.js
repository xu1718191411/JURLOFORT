/**
 * Created by xuzhongwei on 2016/11/17.
 */
var express = require('express');
var router = express.Router();
var ayatakaController = require('../controller/ayataka.js');

router.post('/pasonaTechAyatakaEventPost',ayatakaController.pasonaTechAyatakaEventPostController);
router.get("/admin",ayatakaController.adminController)
router.get("/login",ayatakaController.loginController)
router.post("/loginPost",ayatakaController.loginPostController)
module.exports = router;
