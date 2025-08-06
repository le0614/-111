const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://gravelshaper5693:kRM7Fykyq4hdF6HJ@cluster0.s3zanjo.mongodb.net/TuandModules").then(() => {
    console.log("连接成功");
  }).catch((err) => {
    console.log("连接失败");
  });
module.exports = mongoose
