const { mongo } = require('mongoose')
const mongoose = require('../databases/database')

const DatesRouple = new mongoose.Schema({
    imgs:String
})
const DatesModule = mongoose.model('datebas',DatesRouple,'datebas')


module.exports = {
    DatesModule
}