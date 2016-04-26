var express = require('express');
var router = express.Router();
var debateController = require('../controller/debate.js');



/* GET users listing. */


router.get('/',debateController.indexController);
router.get('/tmpLogin',debateController.tmpLoginController);

router.post('/tmpLoginPost',debateController.tmpLoginPostController);

module.exports = router;
