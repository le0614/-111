const { mongo } = require('mongoose')
const mongoose = require('../databases/database')


const userRouple = new mongoose.Schema({
    username:String,
    password:String,
})
const userModule = mongoose.model('user',userRouple,'user')

const userInformationRouple = new mongoose.Schema({
    user:{ //用户信息
        ref: 'user',
        type: mongoose.Schema.Types.ObjectId
    },
    name:String, //名称
    sex:String, //性别
    desc:String, //个人评价
})
const userInformationModule = mongoose.model('userInformation',userInformationRouple,'userInformation')

const DatesRouple = new mongoose.Schema({
})
const DatesModule = mongoose.model('datebas',DatesRouple,'datebas')


const AIRouple=new mongoose.Schema({
    name:String,//ai模型的名称
    img:String,//模型图片
    content:String,//模型描述
})

const AIModule=mongoose.model('AImodel',AIRouple,"AImodel")

module.exports = {
    userModule,
    userInformationModule,
    DatesModule,
    AIModule
}