const express = require('express');
const router = express.Router();
const User = require('../models/user')
const mid = require('../middleware');
const fakeData = require('../middleware/fakeData');
//import getSnapshots()... & getAssets()

const superagent = require('superagent'); 

let coinAPI = "https://api.coinmarketcap.com/v1/ticker/";
let stockAPI = {
    "start": "https://api.iextrading.com/1.0/stock/",
    "end": "/delayed-quote"
} // e.g.: https://api.iextrading.com/1.0/stock/aapl/delayed-quote

router.get('/', mid.requiresLogin, (req, res, next) => {
    let data = {
        user: User.info,
        totalValue: {
            portfolioValue: 0, portfolioGrowth: 0, portfolioGains: 0, stockValue: 0, stockGrowth: 0, stockGains: 0, cryptoValue: 0, cryptoGrowth: 0, cryptoGains: 0
        },
        snapshots: {},
        chartpoints: []
    }
    
    data.assets = data.user.toObject();
    // data.assets = User.info.assets;
    // console.log('asset spitout info', data.assets)
    // console.log('asset spitout info', User.info)
    // data.totalValue = fakeData.totalValue
    // data.user.snapshots = fakeData.snapshots
    
    let promises = [];
    
    for (let a in data.assets.assets) {
        if (data.assets.assets[a].type=='stock') {
            promises.push(superagent.get(stockAPI.start+data.assets.assets[a].symbol+stockAPI.end).then((res) => {    
                data.assets.assets[a].price = res.body.delayedPrice;
                data.totalValue.portfolioValue += (data.assets.assets[a].quantity * data.assets.assets[a].price);
                data.totalValue.portfolioGrowth += (data.assets.assets[a].price / data.assets.assets[a].purchasePrice) - 1;
                data.totalValue.portfolioGains += (data.assets.assets[a].price - data.assets.assets[a].purchasePrice) * data.assets.assets[a].quantity;
                data.totalValue.stockValue += (data.assets.assets[a].quantity * data.assets.assets[a].price);
                data.totalValue.stockGrowth += (data.assets.assets[a].price / data.assets.assets[a].purchasePrice) - 1;
                data.totalValue.stockGains += (data.assets.assets[a].price - data.assets.assets[a].purchasePrice) * data.assets.assets[a].quantity;
            }).catch(console.error))
        }
        if (data.assets.assets[a].type=='crypto') {
            promises.push(superagent.get(coinAPI+data.assets.assets[a].name).then((res) => {    
                data.assets.assets[a].price = res.body[0].price_usd;
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
        data = JSON.stringify(data);
        if (req.body.refresh) res.send(data.totalValue, data.snapshots)
        else {return res.render('overview', {data, partials : { menuPartial : './partials/nav'} })}
    });
});

module.exports = router;