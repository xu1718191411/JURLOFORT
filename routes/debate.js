var express = require('express');
var router = express.Router();
var debateController = require('../controller/debate.js');
var reviewController = require("../controller/review.js");


/* GET users listing. */


router.get('/',debateController.indexController);
router.get('/tmpLogin',debateController.tmpLoginController);
router.get('/group',debateController.groupController);

router.post('/tmpLoginPost',debateController.tmpLoginPostController);

router.post('/preparePost',debateController.preparePostController);

router.get('/logout',debateController.logoutController)


router.get("/review",reviewController.indexController)
router.get("/analysisTemplate",reviewController.analysisTemplateController)
router.get("/statementTemplate",reviewController.statementTemplateController)
router.get("/reviewData",reviewController.reviewDataController)
router.get("/getAnalysisData",reviewController.getAnalysisDataController)
router.get("/getStatementData",reviewController.getStatementDataController)

module.exports = router;
