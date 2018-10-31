var express = require('express');
var cors = require('cors');
var fs = require('fs');

var app = express();
app.use(cors()); // enable cross-origin requests

var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

app.get('/data', function (req, res) {
  res.send(data);
});

app.listen(3000);