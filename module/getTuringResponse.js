const request = require('request');

function getTuringResponse(info) {
  if (typeof info !== 'string') {
    info = info.toString();
  }
  var options = {
    method: 'POST',
    url: 'http://www.tuling123.com/openapi/api',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      key: 'your key',
      info: info,
      userid: '123456'
    }
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
module.exports = getTuringResponse;