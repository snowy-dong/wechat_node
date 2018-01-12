const request = require('request');
var express = require('express');
var sign = require('../module/sign');
var config = require('../config/config')
var router = express.Router();
router.get('/', function (req, res, next) {
  getAccessToken().then(function (data) {
    return getTicket(JSON.parse(data).access_token).then((data) => {
      let resp = JSON.parse(data)
      let signs = sign(resp.ticket, config.url)
      signs.appId = config.appId
      res.json(signs)
    }).catch((err) => {
      console.log('err:' + err)
    })
  })
});

function getAccessToken() {
  var options = {
    method: 'GET',
    url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.appId + '&secret=' + config.secret,
  };
  return new Promise((resolve, reject) => {
    request(options, function (err, res, body) {
      if (res) {
        resolve(body);
      } else {
        reject(err);
      }
    });
  })
}

function getTicket(ACCESS_TOKEN) {
  var options = {
    method: 'GET',
    url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + ACCESS_TOKEN + '&type=jsapi',
  };
  return new Promise((resolve, reject) => {
    request(options, function (err, res, body) {
      if (res) {
        resolve(body);
      } else {
        reject(err);
      }
    });
  })
}
module.exports = router;