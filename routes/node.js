const express = require('express');
const router = express.Router();

const Action = require('../actions');

router.post('/:id', async (req, res) => {
    let db = res.app.locals.db;
    let id = req.params.id;
    let group = req.body.group;

    db.collection('nodes').replaceOne(
        {id},
        {id, group},
        {upsert: true}
    );

    db.collection('dnodes').replaceOne(
        {id},
        {id, group, action: Action.UPDATE},
        {upsert: true}
    );

    res.app.locals.simulation.update();

    res.status(200).json({
        error: false
    });
});

router.delete('/:id', async (req, res) => {
    let db = res.app.locals.db;
    let id = req.params.id;

    db.collection('nodes').deleteOne(
        {id}
    );

    db.collection('dnodes').replaceOne(
        {id},
        {id, action: Action.DELETE},
        {upsert: true}
    );

    res.app.locals.simulation.update();

    res.status(200).json({
        error: false
    });
});

module.exports = router;