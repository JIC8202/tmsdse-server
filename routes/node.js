const express = require('express');
const router = express.Router();

router.post('/:id', (req, res) => {
    let db = res.app.locals.db;
    let id = req.params.id;

    res.status(200).json({
        error: false
    });
});

router.delete('/:id', (req, res) => {
    let db = res.app.locals.db;
    let id = req.params.id;
    
    res.status(200).json({
        error: false
    });
});

module.exports = router;