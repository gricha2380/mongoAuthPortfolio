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
    
    data.assets = data.user.toObject(); // turn into a real object
    
    // promises.push(getAssets().then(asset => {
        for (let a in data.assets.assets) {
            if (data.assets.assets[a].type=='stock') {
                promises.push(stock.getInfo(data.assets.assets[a].symbol.toLowerCase())
                .then((res) => {
                    data.assets.assets[a].price = res.price;
                    data.assets.assets[a].priceChangePercent = res.priceChangePercent;
                    data.assets.assets[a].priceChange = res.priceChange;
                }).catch(console.error))
            }
            if (data.assets.assets[a].type=='crypto') {
                promises.push(superagent.get(coinAPI+data.assets.assets[a].name)
                .then((res) => {    
                    data.assets.assets[a].price = res.body[0].price_usd;
                    data.assets.assets[a].priceChangePercent = res.body[0].percent_change_24h;
                    data.assets.assets[a].priceChange = parseFloat(data.assets.assets[a].priceChangePercent * (data.assets.assets[a].price * .01));
                }).catch(console.error))
            }
        }
        Promise.all(promises).then(function(results) {
            console.log('processed data', data)
            data = JSON.stringify(data);
            if (req.body.refresh) res.send(data.totalValue, data.snapshots)
            else {return res.render('portfolio', {data, partials : { menuPartial : './partials/nav'} })}
        });
    // })
    // .catch(console.error));
});

module.exports = router;