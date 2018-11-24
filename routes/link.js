const express = require('express');
const router = express.Router();

const Action = require('../actions');

router.post('/:source/:target', async (req, res) => {
    let db = res.app.locals.db;
    let source = req.params.source;
    let target = req.params.target;

    db.collection('links').replaceOne(
        {source, target},
        {source, target},
        {upsert: true}
    );

    db.collection('dlinks').replaceOne(
        {source, target},
        {source, target, action: Action.UPDATE},
        {upsert: true}
    );

    res.app.locals.simulation.update();

    res.status(200).json({
        error: false
    });
});

router.delete('/:source/:target', async (req, res) => {
    let db = res.app.locals.db;
    let source = req.params.source;
    let target = req.params.target;

    db.collection('links').deleteOne(
        {source, target}
    );

    db.collection('dlinks').replaceOne(
        {source, target},
        {source, target, action: Action.DELETE},
        {upsert: true}
    );

    res.app.locals.simulation.update();

    res.status(200).json({
        error: false
    });
});

module.exports = router;