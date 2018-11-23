const cors = require('cors');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const Simulation = require('./simulation');

const dataRoute = require('./routes/data');
const linkRoute = require('./routes/link');
const nodeRoute = require('./routes/node');

const url = process.argv[2];

module.exports = async function() {
    var app = express();
    app.use(cors()); // enable cross-origin requests

    app.use('/data', dataRoute);
    app.use('/link', linkRoute);
    app.use('/node', nodeRoute);

    let client = await MongoClient.connect(url, {useNewUrlParser: true});
    console.log('Connected to MongoDB');
    let db = client.db();
    app.locals.db = db;

    let simulation = new Simulation(app);
    app.locals.simulation = simulation;
    await simulation.update();

    return app;
};