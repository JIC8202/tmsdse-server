const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let data = req.app.locals.data;
    if (data) {
        res.status(200).json({
            error: false,
            nodes: data.nodes,
            links: data.links
        });
    } else {
        res.status(503).json({
            error: true,
            message: 'Graph data is not available.'
        });
    }
});

module.exports = router;