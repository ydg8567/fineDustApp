const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const server = require('./servers/server');

const indexRouter = require('./servers/router/index');
const infoRouter = require('./servers/router/info');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/info', infoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// tcp ip server
server.listen(3002, function() {
  console.log('Server listening: ' + JSON.stringify(server.address()));
  server.on('close', function(){
      console.log('Server Terminated');
  });
  server.on('error', function(err){
      console.log('Server Error: ', JSON.stringify(err));
  });
});

module.exports = app;
