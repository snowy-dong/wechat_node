var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);

var index = require('./routes/index');
var order = require('./routes/order');
var getConfig = require('./routes/getConfig')


var app = express();

// 设置 views 文件夹为存放视图文件的目录，即存放模板文件的地方，dirname 为全局变量，存储当前正在执行的脚本所在的目录。
app.set('views', path.join(__dirname, 'views'));

// 设置视图模板引擎为 jade
app.set('view engine', 'jade');

// 加载日志中间件
app.use(logger('dev'));

// 加载解析 json 的中间件。
app.use(bodyParser.json());

// 加载解析 urlencoded 请求体的中间件。
app.use(bodyParser.urlencoded({
  extended: false
}));

// 加载解析 xml 请求体的中间件。
app.use(bodyParser.xml({
  limit: '1MB', // Reject payload bigger than 1 MB
  xmlParseOptions: {
    normalize: true, // Trim whitespace inside text nodes
    normalizeTags: true, // Transform tags to lowercase
    explicitArray: false // Only put nodes in array if >1
  }
}));
// 加载解析 cookie 的中间件。
app.use(cookieParser());

// 设置 public 文件夹为存放静态文件的目录。
app.use(express.static(path.join(__dirname, 'public')));

// 路由控制。
app.use('/', index);
app.use('/order', order)
app.use('/getConfig', getConfig)

//设置跨域访问
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// 捕获404错误，并转发到错误处理器。
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 开发环境下的错误处理器，将错误信息渲染 error 模板并显示到浏览器中。
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;