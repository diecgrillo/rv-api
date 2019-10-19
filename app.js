var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var rvGoalParamRouter = require('./routes/rv-goal-param');
var rvGoalRangeParamRouter = require('./routes/rv-goal-range-param');
var rvRemunerationPointRouter = require('./routes/rv-remuneration-point');
var rvTaskRouter = require('./routes/rv-task');
var rvAgentTaskResultRouter = require('./routes/rv-agent-task-result');
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/rv-goal-params', rvGoalParamRouter);
app.use('/rv-goal-range-params', rvGoalRangeParamRouter);
app.use('/rv-remuneration-points', rvRemunerationPointRouter);
app.use('/rv-tasks', rvTaskRouter);
app.use('/rv-agent-task-results', rvAgentTaskResultRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, 'Not Found'));
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

module.exports = app;
