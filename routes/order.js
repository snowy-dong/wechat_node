var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  // res.send('test.html');
  console.log(req.path.substr(1))
  fs.readFile("views/test.html" + req.path.substr(1), function (err, data) {
    // body
    if (err) {
      console.log(err);
      //404：NOT FOUND
      res.writeHead(404, {
        "Content-Type": "text/html"
      });
    } else {
      //200：OK
      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      res.write(data.toString());
    }
    res.end();
  });
});

module.exports = router;