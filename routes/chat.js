var express = require('express');
var router = express.Router();
var chatController = require('../controller/chat.js');

console.log(chatController.indexController.toString());


/* GET users listing. */


router.get('/',chatController.indexController);

router.get('/login',chatController.loginController)

router.post('/loginPost',chatController.loginPostController)

router.get('/statement',chatController.stateMentController)

module.exports = router;
