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

router.get('/', mid.requiresLogin, (req, res, next) => {
    let data = {
        user: User.info,
        totalValue: {
            portfolioValue: 45, portfolioGrowth: 45, portfolioGains: 45, stockValue: 45, stockGrowth: 45, stockGains: 45, cryptoValue: 45, cryptoGrowth: 45, cryptoGains: 45
        },
        snapshots: [],
        chartpoints: []
    }
    let promises = [];
    
    // promises.push(getSnapshots().then(snap => {
    //     data.snapshots.push(snap)
    // }))
    // data.snapshots = data.user.info.snapshots;
    
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
    // console.log('type of for assets', typeof data.assets)
    // console.log('unparsed assets again', data.assets.assets[0]);
    // console.log('exchange WILL WORK', data.assets.assets[0].exchange);

    // promises.push(getAssets().then(asset => {
        for (let a in data.assets.assets) {
            if (data.assets.assets[a].type=='stock') {
                promises.push(stock.getInfo(data.assets.assets[a].symbol.toLowerCase())
                .then((res) => {
                    data.assets.assets[a].price = res.price;
                    data.totalValue.portfolioValue += (data.assets.assets[a].quantity * data.assets.assets[a].price);
                    data.totalValue.portfolioGrowth += (data.assets.assets[a].price / data.assets.assets[a].purchasePrice) - 1;
                    data.totalValue.portfolioGains += (data.assets.assets[a].price - data.assets.assets[a].purchasePrice) * data.assets.assets[a].quantity;
                    data.totalValue.stockValue += (data.assets.assets[a].quantity * data.assets.assets[a].price);
                    data.totalValue.stockGrowth += (data.assets.assets[a].price / data.assets.assets[a].purchasePrice) - 1;
                    data.totalValue.stockGains += (data.assets.assets[a].price - data.assets.assets[a].purchasePrice) * data.assets.assets[a].quantity;
                }).catch(console.error))
            }
            if (data.assets.assets[a].type=='crypto') {
                promises.push(superagent.get(coinAPI+data.assets.assets[a].name)
                .then((res) => {    
                    data.assets.assets[a].price = res.body[0].price_usd,
                    data.totalValue.portfolioValue += (data.assets.assets[a].quantity * data.assets.assets[a].price);
                    data.totalValue.portfolioGrowth += (data.assets.assets[a].price / data.assets.assets[a].purchasePrice) - 1;
                    data.totalValue.portfolioGains += (data.assets.assets[a].price - data.assets.assets[a].purchasePrice) * data.assets.assets[a].quantity;
                    data.totalValue.cryptoValue += (data.assets.assets[a].quantity * data.assets.assets[a].price);
                    data.totalValue.cryptoGrowth += (data.assets.assets[a].price / data.assets.assets[a].purchasePrice) - 1;
                    data.totalValue.cryptoGains += (data.assets.assets[a].price - data.assets.assets[a].purchasePrice) * data.assets.assets[a].quantity;
                }).catch(console.error))
            }
        }
        Promise.all(promises).then(function(results) {
            // data.snapshots = JSON.stringify(data.snapshots);
            console.log('processed data', data)
            data = JSON.stringify(data);
            if (req.body.refresh) res.send(data.totalValue, data.snapshots)
            else {return res.render('overview', {data, partials : { menuPartial : './partials/nav'} })}
        });
    // })
    // .catch(console.error));
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