const express = require('express');
const router = express.Router();

router.post('/:source/:target', async (req, res) => {
    let db = res.app.locals.db;
    let source = req.params.source;
    let target = req.params.target;

    await db.collection('links').updateOne(
        {source, target},
        {$set: {source, target}},
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

    await db.collection('links').deleteOne(
        {source, target}
    );

    res.app.locals.simulation.update();

    res.status(200).json({
        error: false
    });
});

module.exports = router;