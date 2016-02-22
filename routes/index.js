var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

  res.redirect('/static/static/index.html')
  //res.render('index', { title: 'Express' });
});

module.exports = router;
