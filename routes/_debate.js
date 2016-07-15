/**
 * Created by xuzhongwei on 2016/07/12.
 */


var express = require('express');
var router = express.Router();
var _debateController = require('../controller/_debate.js');


/* GET users listing. */


router.get('/',_debateController.indexController);
router.get('/login',_debateController.loginController);
router.post('/loginPost',_debateController.loginPostController);

router.get('/group',_debateController.groupController)
router.post('/getThemeList',_debateController.getThemeListController)
router.post('/getDebatingList',_debateController.getDebatingListController)
router.post('/createNewRoom',_debateController.createNewRoomController)
router.post('/participateRoom',_debateController.participateRoomController)
router.get("/chat",_debateController.chatController)
router.post('/getDebateInformation',_debateController.getDebateInformationController)
module.exports = router;