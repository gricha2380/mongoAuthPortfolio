const express = require('express');
const router = express.Router();
const User = require('../models/user')
const mid = require('../middleware');

router.get('/', mid.requiresLogin, (req, res, next) => {
    console.log('inside overview route')
    let data = {
        user: User.info,
        title: 'Overview',
        totalValue: {
            
        }
    }
    let totalValue = {};
    return res.render('overview', { title: 'Overview', user:User.info, partials : { menuPartial : './partials/nav'} });
});

module.exports = router;