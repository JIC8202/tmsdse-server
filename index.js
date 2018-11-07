const assert = require('assert');
const async = require('async');
const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

const url = process.argv[2];
const dbName = 'tmsdse';

var client;
var db;

MongoClient.connect(url, { useNewUrlParser: true }, function(err, c) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  client = c;
  db = c.db(dbName);
});

function getGraph(callback) {
  async.parallel({
    nodes: function(callback) {
      const nodes = db.collection('nodes');
      nodes.find({}).toArray(callback);
    },
    links: function(callback) {
      const links = db.collection('links');
      links.find({}).toArray(callback);
    }
  }, function(err, result) {
    result.links.forEach(link => {
      link.source = getNumericalID(link.source);
      link.target = getNumericalID(link.target);
    });
    callback(err, result);

    function getNumericalID(name) {
      for (let i = 0; i < result.nodes.length; i++) {
        if (result.nodes[i].id == name) return i;
      }
      return null;
    }
  });
}

var app = express();
app.use(cors()); // enable cross-origin requests

app.get('/data', function (req, res) {
  getGraph((err, graph) => {
    if (err) console.log(err);
    res.send(graph);
  })
});

app.listen(3000);