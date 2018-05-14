const express = require('express');
const router = express.Router();
const User = require('../models/user')
// const mid = require('../middleware');
const login = require('../middleware/login');
const formatDate = require('../middleware/formatDate').formatDate;
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
            portfolioValue: 0, portfolioGrowth: 0, portfolioGains: 0, stockValue: 0, stockGrowth: 0, stockGains: 0, cryptoValue: 0, cryptoGrowth: 0, cryptoGains: 0
        },
        snapshots: {}
    }
    let promises = [];
    data.assets = data.user.toObject(); // turn into a real object
    data.snapshots = data.assets.snapshots;
    // console.log("I expect snapshots now", data.snapshots);
        Promise.all(promises).then( (results) => {
            data = JSON.stringify(data);
            // console.log("snapshots before send", data)
            if (req.body.refresh) res.send(data)
            else {return res.render('historical', {data, partials : { menuPartial : './partials/nav'} })}
        });
});

router.put('/save', (req, res, next) => {
    // console.log('save route entered')
    let rb = req.body;
    let data = {
        user: User.info,
        totalValue: {
            portfolioValue: 0, portfolioGrowth: 0, portfolioGains: 0, stockValue: 0, stockGrowth: 0, stockGains: 0, cryptoValue: 0, cryptoGrowth: 0, cryptoGains: 0,
            portfolioValue: 0, portfolioGrowth: 0, portfolioGains: 0, stockValue: 0, stockGrowth: 0,stockGains: 0, stockCount: 0, cryptoValue: 0, cryptoGrowth: 0, cryptoGains: 0, cryptoCount: 0, stockCount: 0
        }
    }
    data.assets = data.user.toObject();
    let promises = [];
    
    for (let a in data.assets.assets) {
        if (data.assets.assets[a].type=='stock') {
            promises.push(superagent.get(stockAPI.start+data.assets.assets[a].symbol+stockAPI.end).then((res) => {  
                data.totalValue.stockCount++;  
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
                data.totalValue.cryptoCount++;
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

    Promise.all(promises).then( (results) => {
        // console.log('inside saveSnapshot')
        let item = {
            "date": formatDate('slash'),
            "unix": Date.now(),
            "cryptoCount": data.totalValue.cryptoCount,
            "cryptoGains": data.totalValue.cryptoGains,
            "cryptoValue": data.totalValue.cryptoValue,
            "portfolioGains": data.totalValue.portfolioGains,
            "portfolioValue": data.totalValue.portfolioValue,
            "stockCount": data.totalValue.stockCount,
            "stockGains": data.totalValue.stockGains,
            "stockValue": data.totalValue.stockValue
        }
        item.portfolioGrowth = (item.portfolioValue/(item.portfolioValue - item.portfolioGains)-1)*100;
        item.cryptoGrowth = (item.cryptoValue/(item.cryptoValue - item.cryptoGains)-1)*100;
        item.stockGrowth = (item.stockValue/(item.stockValue - item.stockGains)-1)*100;
        
        // console.log("what's in item now?",item)
        let query   = { _id: User.info._id }; 
        let update  = { $push: {snapshots: item}}; 
        let options = { new: true }; 
        User.findOneAndUpdate(query, update, options, (err, asset)=>{ 
            if (err) throw err;
            console.log(`${item.date} new snapshot added...`,asset)
            res.send(`${item.date} snapshot created`)
        });

    });
});

module.exports = router;