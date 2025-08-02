var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
<<<<<<< HEAD

// 导入数据库连接
const mongoose = require('./databases/database');

// 导入路由
=======
const server = http.createServer(app);




>>>>>>> 6de242476fe4188b2e99517766013dbb059211fa
var gk = require('./routes/GK/list')
var ljl = require('./routes/LJL/list')
var ss = require('./routes/SS/list')
var lxl = require('./routes/LXL/list')
<<<<<<< HEAD
var chat = require('./routes/chat/index')
var notifications = require('./routes/notifications/index')
=======
>>>>>>> 6de242476fe4188b2e99517766013dbb059211fa

var app = express();
var cors = require( 'cors' );

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use( cors() )
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload',express.static(path.join(__dirname,'upload')));
app.use('/uploads', express.static(path.join(__dirname, 'routes', 'uploads')));


app.use('/gk', gk)
app.use('/ljl', ljl)
app.use('/ss', ss)
app.use('/lxl', lxl)
<<<<<<< HEAD
app.use('/api', chat)
app.use('/api/notifications', notifications)
=======
>>>>>>> 6de242476fe4188b2e99517766013dbb059211fa

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send({
    code: err.status || 500,
    msg: err.message,
    stack: err.stack
  });
  res.render('error');
});




module.exports = app;
