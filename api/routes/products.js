const express = require('express');
const router = express.Router();

router.get('/',(req, res, next) => {
    res.status(200).json({
        message: 'Handling get /products'
    });
});

router.post('/',(req, res, next) => {
    res.status(200).json({
        message: 'Handling post /products'
    });
});
module.exports = router;