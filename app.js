const cors = require('cors');
const express = require('express');

const Simulation = require('./simulation');

const dataRoute = require('./routes/data');
const linkRoute = require('./routes/link');
const nodeRoute = require('./routes/node');

module.exports = function(db) {
    var app = express();

    // enable cross-origin requests
    app.use(cors());

    // accept json and urlencoded body formats
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use('/data', dataRoute);
    app.use('/link', linkRoute);
    app.use('/node', nodeRoute);

    app.locals.db = db;

    let simulation = new Simulation(app);
    app.locals.simulation = simulation;
    simulation.update();

    return app;
};
