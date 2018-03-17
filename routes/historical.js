const express = require('express');
const router = express.Router();
const User = require('../models/user')
const mid = require('../middleware');

router.get('/', mid.requiresLogin, (req, res, next) => {
    let data = {
        user: User.info,
        snapshots: [],
        chartpoints: []
    }
    let promises = [];
    
    data.assets = data.user.toObject(); // turn into a real object
    //parse from: data.assets.snapshot
        Promise.all(promises).then(function(results) {
            data = JSON.stringify(data);
            if (req.body.refresh) res.send(data)
            else {return res.render('historical', {data, partials : { menuPartial : './partials/nav'} })}
        });
});