const express = require('express');
const router = express.Router();
const User = require('../models/user')

router.get('/', (req, res, next) => {
    return res.redirect('/overview')
});

module.exports = router;