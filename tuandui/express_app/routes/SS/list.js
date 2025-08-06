var express = require('express');
var router = express.Router();

var {DatesModule} = require('../../databases/date')

/* GET users listing. */
router.get('/index',async function(req, res, next) {
  const find = await DatesModule.find()
  res.send({
    code:"200",
    date:find
  });
});

module.exports = router;    