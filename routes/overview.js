const express = require('express');
const router = express.Router();
const User = require('../models/user')
const mid = require('../middleware');
//import getSnapshots()... & getAssets()

const superagent = require('superagent'); // for performing backend AJAX calls
const nf = require('nasdaq-finance'); // stock API
const stock = new nf.default();
const coinTicker = require('coin-ticker'); // crypto API

let coinAPI = "https://api.coinmarketcap.com/v1/ticker/";

let fakeData = {
    totalValue: {
        portfolioValue: 33.50,
        portfolioGains: 22,
        portfolioGrowth: 12,
        stockGains: 22,
        stockGrowth: 88,
        stockValue: 83,
        cryptoGains: 23,
        cryptoGrowth: 34,
        cryptoValue: 33
    },
    snapshots: [
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
          },
        {
            "cryptoCount" : 1,
            "cryptoGains" : 23806.839999999997,
            "cryptoGrowth" : 356.92413793103447,
            "cryptoValue" : 30476.839999999997,
            "date" : "01/15/2018",
            "portfolioGains" : 29579.329999999998,
            "portfolioGrowth" : 221.1322989740361,
            "portfolioValue" : 40774.329999999994,
            "stockCount" : 6,
            "stockGains" : 5772.49,
            "stockGrowth" : 197.3336591478697,
            "stockValue" : 9297.49,
            "unix" : 1516108671000
          }
    ]
}


router.get('/', mid.requiresLogin, (req, res, next) => {
    let data = {
        user: User.info,
        totalValue: fakeData.totalValue,
        snapshots: fakeData.snapshots,
        chartpoints: []
    }
    data.assets = data.user.toObject();
    let promises = [];
    
    // promises.push(getSnapshots().then(snap => {
    //     data.snapshots.push(snap)
    // }))
    // data.snapshots = data.user.info.snapshots;


  console.log("assets here!", data.assets)
  console.log("overview here!")
  data = JSON.stringify(data);
  return res.render('overview', {data, partials : { menuPartial : './partials/nav'} });
});

// basic
// router.get('/', mid.requiresLogin, (req, res, next) => {
//     let data = {
//         user: User.info
//     }
//     data = JSON.stringify(data);
//     return res.render('overview', {data, partials : { menuPartial : './partials/nav'} });
// });

module.exports = router;