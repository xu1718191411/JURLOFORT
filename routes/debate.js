var express = require('express');
var router = express.Router();
var debateController = require('../controller/debate.js');



/* GET users listing. */


router.get('/',debateController.indexController);
router.get('/tmpLogin',debateController.tmpLoginController);
router.get('/group',debateController.groupController);
router.get('/review',debateController.reviewController);
router.get('/reviewData',debateController.reviewDataController)

router.post('/tmpLoginPost',debateController.tmpLoginPostController);

router.post('/preparePost',debateController.preparePostController);

router.get('/logout',debateController.logoutController)
module.exports = router;
