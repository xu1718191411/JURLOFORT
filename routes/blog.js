/**
 *
 * Created by xuzhongwei on 2/4/16.
 */

var express = require('express');
var router = express.Router();
var blogController = require('../controller/blog.js');




/* GET users listing. */


router.get('/',blogController.indexController);
router.get('/detail',blogController.detailController);
router.get('/signUp',blogController.signUpController);
router.get('/login',blogController.loginController);
router.post('/register',blogController.registerController);
router.post('/checkLogin',blogController.checkLoginController);
router.get('/AllTimeLine',blogController.AllTimeLineController);
module.exports = router;
