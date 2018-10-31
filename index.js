var express = require('express');
var fs = require('fs');

var app = express();

var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

app.get('/data', function (req, res) {
  res.send(data);
});

app.listen(3000);