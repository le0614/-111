const { mongo } = require('mongoose')
const mongoose = require('./database')
const { text } = require('body-parser')

const DatesRouple = new mongoose.Schema({
    imgs:String
})
const DatesModule = mongoose.model('datebas',DatesRouple,'datebas')

const MessageSheam = new mongoose.Schema({
    content:String,//发送的消息内容
    messageType:{
    type:String,
    default:"小区活动"
    },
    startTime:{
        type:Date,
        default:Date.now()
    },
    textname:String,//消息标头
})
const MessageModule = mongoose.model('mesage',MessageSheam,'mesage')

const propertySheam = new mongoose.Schema({
    name:{//用户
        type:mongoose.Schema.Types.ObjectId,
        ref:'property'
    },
    startTime:{ //缴费时间
        type:Date,
        default:Date.now()
    },
    many:Number,//缴费金额

})
const propertyModule = mongoose.model('property',propertySheam,'property')


module.exports = {
    DatesModule,
    MessageModule
}