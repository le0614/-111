var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/index',async function(req, res, next) {
  res.send({
    code:"200",
  });
});

module.exports = router;    