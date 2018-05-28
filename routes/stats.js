const express = require('express');
const router = express.Router();
const User = require('../models/user')
const login = require('../middleware/login');
const fakeData = require('../middleware/fakeData');
//import getSnapshots()... & getAssets()

const superagent = require('superagent'); 

let coinAPI = "https://api.coinmarketcap.com/v1/ticker/"; // e.g.: https://api.coinmarketcap.com/v1/ticker/Ethereum
let stockAPI = {
    "start": "https://api.iextrading.com/1.0/stock/",
    "end": "/delayed-quote"
} // e.g.: https://api.iextrading.com/1.0/stock/aapl/delayed-quote

router.get('/', login.requiresLogin, (req, res, next) => {
    let data = {
        user: User.info,
        totalValue: {
            portfolioValue: 0, portfolioGrowth: 0, portfolioGains: 0, stockValue: 0, stockGrowth: 0, stockGains: 0, cryptoValue: 0, cryptoGrowth: 0, cryptoGains: 0, exchanges: {}
        },
        snapshots: {},
        chartpoints: []
    }
    
    User.findById(User.info._id).then((e)=>{
        if (!e) console.log("No data received")
        populateUser(e);
        processAssets();
    })

    let populateUser = (value) => {
        data.assets = value;
    }
    
    // data.totalValue = fakeData.totalValue
    // data.user.snapshots = fakeData.snapshots
    
    let processAssets = () => {
        let promises = [];
        
        for (let a in data.assets.assets) {
            if (data.assets.assets[a].type=='stock') {
                promises.push(superagent.get(stockAPI.start+data.assets.assets[a].symbol+stockAPI.end).then((res) => {    
                    data.assets.assets[a].price = res.body.delayedPrice;
                    res.body.low ? data.assets.assets[a].todayPercent = res.body.delayedPrice / res.body.low : data.assets.assets[a].todayPercent = 0;
                    res.body.low ? data.assets.assets[a].todayGain = (res.body.delayedPrice - res.body.low) * data.assets.assets[a].quantity : data.assets.assets[a].todayGain = 0;
                    data.totalValue.portfolioValue += (data.assets.assets[a].quantity * data.assets.assets[a].price);
                    data.totalValue.portfolioGrowth += (data.assets.assets[a].price / data.assets.assets[a].purchasePrice) - 1;
                    data.totalValue.portfolioGains += (data.assets.assets[a].price - data.assets.assets[a].purchasePrice) * data.assets.assets[a].quantity;
                    data.totalValue.stockValue += (data.assets.assets[a].quantity * data.assets.assets[a].price);
                    data.totalValue.stockGrowth += (data.assets.assets[a].price / data.assets.assets[a].purchasePrice) - 1;
                    data.totalValue.stockGains += (data.assets.assets[a].price - data.assets.assets[a].purchasePrice) * data.assets.assets[a].quantity;
                    
                    let exchangeHolder = data.assets.assets[a].exchange;
                    data.totalValue.exchanges[exchangeHolder] = (data.assets.assets[a].quantity * data.assets.assets[a].price);
                }).catch(console.error))
            }
            if (data.assets.assets[a].type=='crypto') {
                promises.push(superagent.get(coinAPI+data.assets.assets[a].name).then((res) => {    
                    data.assets.assets[a].price = res.body[0].price_usd;
                    data.assets.assets[a].todayPercent = parseInt(res.body[0].percent_change_24h) * .01;
                    data.assets.assets[a].todayGain =  (data.assets.assets[a].todayPercent * parseInt(res.body[0].price_usd)) * data.assets.assets[a].quantity;
                    data.totalValue.portfolioValue += (data.assets.assets[a].quantity * data.assets.assets[a].price);
                    data.totalValue.portfolioGrowth += (data.assets.assets[a].price / data.assets.assets[a].purchasePrice) - 1;
                    data.totalValue.portfolioGains += (data.assets.assets[a].price - data.assets.assets[a].purchasePrice) * data.assets.assets[a].quantity;
                    data.totalValue.cryptoValue += (data.assets.assets[a].quantity * data.assets.assets[a].price);
                    data.totalValue.cryptoGrowth += (data.assets.assets[a].price / data.assets.assets[a].purchasePrice) - 1;
                    data.totalValue.cryptoGains += (data.assets.assets[a].price - data.assets.assets[a].purchasePrice) * data.assets.assets[a].quantity;

                    let exchangeHolder = data.assets.assets[a].exchange;
                    data.totalValue.exchanges[exchangeHolder] = (data.assets.assets[a].quantity * data.assets.assets[a].price);
                }).catch(console.error))
            }
        }
        Promise.all(promises).then( (results) => {
            data = JSON.stringify(data);
            if (req.body.refresh) res.send(data.totalValue, data.snapshots)
            else {return res.render('stats', {data, partials : { menuPartial : './partials/nav'} })}
        });
    }
});

module.exports = router;