const express = require('express');
const router = express.Router();
const User = require('../models/user')
const mid = require('../middleware');

router.get('/', (req, res, next) => {
    return res.redirect('/overview')
});

module.exports = router;