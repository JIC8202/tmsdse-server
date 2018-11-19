const assert = require('assert');
const async = require('async');
const cors = require('cors');
const d3 = require('d3-force');
const express = require('express');
const fs = require('fs');
const https = require('https');
const MongoClient = require('mongodb').MongoClient;

const credentials = {
    key: fs.readFileSync('sslcert/privkey.pem', 'utf8'),
    cert: fs.readFileSync('sslcert/fullchain.pem', 'utf8')
};

const url = process.argv[2];

var db;
var data;

MongoClient.connect(url, { useNewUrlParser: true }, function(err, c) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = c.db();

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
        const simulation = d3.forceSimulation(result.nodes)
        .force("link", d3.forceLink().links(result.links).distance(40).id(d => d.id));

        // calculate degree
        result.nodes.forEach(d => {
            d.degree = 0;
        });
        result.links.forEach(d => {
            d.target.degree++;
            d.source.degree++;
        });

        simulation.force("collide", d3.forceCollide(nodeSize))
        .force("charge", d3.forceManyBody())
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .on("end", () => {
            console.log("simulation ended");

            // remove object references
            result.links.forEach(link => {
                link.source = link.source.index;
                link.target = link.target.index;
            });
            data = result;
        });
    });
});

function nodeSize(d) {
    return Math.sqrt(d.degree) + 5;
}

var app = express();
app.use(cors()); // enable cross-origin requests

app.get('/data', function (req, res) {
    res.send(data);
});

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(443);
