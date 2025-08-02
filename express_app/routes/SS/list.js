var express = require('express');
var router = express.Router();
var axios=require('axios')

const {AIModule}= require('../../databases/date')


router.post('/getdata',async function(req,res,next){
    const  apiKey = req.query.apiKey
    res.send({
        code:"200",
        message:"连接111成功",
        aaa:apiKey
    })
})

/* GET users listing. */
router.post('/index',async function(req, res, next) {
  const message = req.body.message;
    const apiKey = apiKey;  // 替换为实际的 API Key
    console.log(apiKey);
    console.log("Received message:", message);  // 打印收到的消息

    try {
        const response = await axios.post('http://127.0.0.1/v1/chat-messages', {
            inputs: {
                destination:"成都",
                data:"30",
                budget:"100000",
                type:"穷游",
                activity:"吃吃喝喝",
            },
            query:message,
            response_mode:"streaming",
            user:'aaa'
        }, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Dify response:", response.data);  // 打印 Dify 的响应

        res.json(response.data);  // 将 Dify 的响应返回给前端
    } catch (error) {
        console.error("Error contacting Dify API:", error);  // 打印错误信息
        res.status(500).json({ error: 'Failed to contact Dify API' });
    }
});

router.get('/getList',async function(req, res, next){
    data=await AIModule.find()
    res.send({
        code:"200",
        message:"获取成功",
        data
    })
})


module.exports = router;    