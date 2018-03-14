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
        {"name" : "bob"}
    ]
    
    // data.assets = JSON.parse(data.user.assets);
    // data.assets = data.user.toObject(); // turn into a real object
    data.assets = data.user.toObject(); // turn into a real object
    console.log('type of for assets', typeof data.assets) // why isn't this an array?
    // console.log('unparsed assets', data.assets);
    console.log('unparsed assets again', data.assets.assets[0]);
    console.log('exchange WILL WORK', data.assets.assets[0].exchange);

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