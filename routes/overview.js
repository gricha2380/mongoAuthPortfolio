const express = require('express');
const router = express.Router();
const User = require('../models/user')
const mid = require('../middleware');
//import getSnapshots()... & getAssets()

let coinAPI = "https://api.coinmarketcap.com/v1/ticker/";

router.get('/', mid.requiresLogin, (req, res, next) => {
    let data = {
        user: User.info,
        totalValue: {
            portfolioValue: 0, portfolioGrowth: 0, portfolioGains: 0, stockValue: 0, stockGrowth: 0, stockGains: 0, cryptoValue: 0, cryptoGrowth: 0, cryptoGains: 0
        },
        snapshots: []
    }
    let promises = [];
    
    // promises.push(getSnapshots().then(snap => {
    //     data.snapshots.push(snap)
    // }))
    // data.snapshots = data.user.info.snapshots;
    data.snapshots = {           
        "-L2kvHeO-kNzIlHQ9TrH" : {
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
        }
    }
    
    data.assets = JSON.parse(data.user.assets);
    console.log('parsed assets', data.assets);

    // promises.push(getAssets().then(asset => {
        for (let a in data.assets) {
            if (data.assets[a].type=='stock') {
                promises.push(stock.getInfo(data.assets[a].symbol.toLowerCase())
                .then((res) => {
                    data.assets[a].price = res.price;
                    data.totalValue.portfolioValue += (data.assets[a].quantity * data.assets[a].price);
                    data.totalValue.portfolioGrowth += (data.assets[a].price / data.assets[a].purchasePrice) - 1;
                    data.totalValue.portfolioGains += (data.assets[a].price - data.assets[a].purchasePrice) * data.assets[a].quantity;
                    data.totalValue.stockValue += (data.assets[a].quantity * data.assets[a].price);
                    data.totalValue.stockGrowth += (data.assets[a].price / data.assets[a].purchasePrice) - 1;
                    data.totalValue.stockGains += (data.assets[a].price - data.assets[a].purchasePrice) * data.assets[a].quantity;
                }).catch(console.error))
            }
            if (data.assets[a].type=='crypto') {
                promises.push(superagent.get(coinAPI+data.assets[a].name)
                .then((res) => {    
                    data.assets[a].price = res.body[0].price_usd,
                    data.totalValue.portfolioValue += (data.assets[a].quantity * data.assets[a].price);
                    data.totalValue.portfolioGrowth += (data.assets[a].price / data.assets[a].purchasePrice) - 1;
                    data.totalValue.portfolioGains += (data.assets[a].price - data.assets[a].purchasePrice) * data.assets[a].quantity;
                    data.totalValue.cryptoValue += (data.assets[a].quantity * data.assets[a].price);
                    data.totalValue.cryptoGrowth += (data.assets[a].price / data.assets[a].purchasePrice) - 1;
                    data.totalValue.cryptoGains += (data.assets[a].price - data.assets[a].purchasePrice) * data.assets[a].quantity;
                }).catch(console.error))
            }
        }
        Promise.all(promises).then(function(results) {
            data.snapshots = JSON.stringify(data.snapshots);
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