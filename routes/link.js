const express = require('express');
const router = express.Router();

// TODO: use transactions for atomic checks
router.post('/:source/:target', (req, res) => {
    let db = res.app.locals.db;
    let source = req.params.source;
    let target = req.params.target;

    db.collection('links').updateOne(
        {source, target},
        {$set: {source, target}},
        {upsert: true}
    );

    res.status(200).json({
        error: false
    });
});

router.delete('/:source/:target', (req, res) => {
    let db = res.app.locals.db;
    let source = req.params.source;
    let target = req.params.target;

    db.collection('links').deleteOne(
        {source, target}
    );

    res.status(200).json({
        error: false
    });
});

module.exports = router;