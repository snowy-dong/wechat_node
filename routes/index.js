var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var getTuringResponse = require('./getTuringResponse')
var autoReply = require('./autoReply')
var token = "snowy"; //此处需要你自己修改！
/* GET home page. */
router.get('/', function (req, res, next) {
  var signature = req.query.signature;
  var timestamp = req.query.timestamp;
  var nonce = req.query.nonce;
  var echostr = req.query.echostr;

  /*  加密/校验流程如下： */
  //1. 将token、timestamp、nonce三个参数进行字典序排序
  var array = new Array(token, timestamp, nonce);
  array.sort();
  var str = array.toString().replace(/,/g, "");

  //2. 将三个参数字符串拼接成一个字符串进行sha1加密
  var sha1Code = crypto.createHash("sha1");
  var code = sha1Code.update(str, 'utf-8').digest("hex");

  //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  if (code === signature) {
    res.send(echostr)
  } else {
    res.send("error");
  }
});
router.post('/', function (req, res) {

  res.writeHead(200, {
    'Content-Type': 'application/xml'
  });

  // var data = req.body.xml;
  // var resMsg = '<xml>' +
  //   '<ToUserName><![CDATA[' + data.fromusername + ']]></ToUserName>' +
  //   '<FromUserName><![CDATA[' + data.tousername + ']]></FromUserName>' +
  //   '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
  //   '<MsgType><![CDATA[text]]></MsgType>' +
  //   '<Content><![CDATA[' + data.content + ']]></Content>' +
  //   '</xml>';
  // res.end(resMsg);
  var content = req.body.xml.content;

  getTuringResponse(encodeURI(content)).then(function (data) {
    var response = JSON.parse(data);
    var resMsg = autoReply(req.body.xml, response.text);
    res.end(resMsg);
  })
});

module.exports = router;