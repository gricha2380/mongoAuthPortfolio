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

    data.snapshots = [
        {
          "cryptoCount" : 1,
          "cryptoGains" : 25736.54,
          "cryptoGrowth" : 3.8585517241379312,
          "cryptoValue" : 32406.54,
          "date" : "01/13/2018",
          "portfolioGains" : 32198.3,
          "portfolioGrowth" : 2.221921402644542,
          "portfolioValue" : 42693.29999999999,
          "stockCount" : 5,
          "stockGains" : 6461.76,
          "stockGrowth" : 1.8945953383458647,
          "stockValue" : 10286.76,
          "unix" : 1515993998141
        },
        {
            "cryptoCount" : 1,
            "cryptoGains" : 23806.839999999997,
            "cryptoGrowth" : 356.92413793103447,
            "cryptoValue" : 30476.839999999997,
            "date" : "01/15/2018",
            "portfolioGains" : 29579.329999999998,
            "portfolioGrowth" : 220.1322989740361,
            "portfolioValue" : 39774.329999999994,
            "stockCount" : 6,
            "stockGains" : 5772.49,
            "stockGrowth" : 197.3336591478697,
            "stockValue" : 9297.49,
            "unix" : 1515993868864
          }
    ]
    
    
    data.assets = data.user.toObject(); // turn into a real object
    //parse from: data.assets.snapshot
        Promise.all(promises).then(function(results) {
            data = JSON.stringify(data);
            if (req.body.refresh) res.send(data)
            else {return res.render('historical', {data, partials : { menuPartial : './partials/nav'} })}
        });
});

module.exports = router;