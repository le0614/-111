var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const server = http.createServer(app);




var list = require('./routes/SS/list')

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


app.use('/list', list)
// app.use('/renlian', renlianRouter);

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
