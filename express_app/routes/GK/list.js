var express = require('express');
var router = express.Router();
const DateModule = require('../../databases/date')

/* GET users listing. */
router.get('/index',async function(req, res, next) {
  const {username,password} = req.query
  const find = await DateModule.userModule.find({username:username,password:password})
  res.send({
    code:"200",
    data:find
  });
});


router.post('/addUser',async function(req, res, next) {
  const {user,password} = req.body
  DateModule.userModule.create({username:user,password:password})
  res.send({
    code:"200"
  });
});


// 上传图片
router.post('/upload', function(req, res, next) {
    // 1. 确保上传目录存在
    const uploadDir = path.join(__dirname, '../../../public/upload');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    let form = new multiparty.Form();
    form.uploadDir = uploadDir;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).send({ errno: 1, msg: '上传失败', error: err });
        }
        const filePath = files.file[0].path;
        // 2. 只返回相对路径
        const relativePath = '/upload/' + path.basename(filePath);
        res.send({
            errno: 0,
            path: 'http://localhost:3000' + relativePath
        });
    });
});

module.exports = router;