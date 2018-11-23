const express = require('express');
const router = express.Router();

router.post('/:id', async (req, res) => {
    let db = res.app.locals.db;
    let id = req.params.id;
    let group = req.body.group;

    await db.collection('nodes').updateOne(
        {id},
        {$set: {id, group}},
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

    await db.collection('nodes').deleteOne(
        {id}
    );

    res.app.locals.simulation.update();

    res.status(200).json({
        error: false
    });
});

module.exports = router;