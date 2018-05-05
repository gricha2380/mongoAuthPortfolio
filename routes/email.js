const express = require('express');
const router = express.Router();
const User = require('../models/user')
// const mid = require('../middleware');
const fakeData = require('../middleware/fakeData');
let sendEmail = require('../middleware/sendEmail').sendEmail;
const nodemailer = require('nodemailer'); // email & text message
const formatDate = require('../middleware/formatDate').formatDate;

const superagent = require('superagent'); 

let coinAPI = "https://api.coinmarketcap.com/v1/ticker/"; // e.g.: https://api.coinmarketcap.com/v1/ticker/Ethereum
let stockAPI = {
    "start": "https://api.iextrading.com/1.0/stock/",
    "end": "/delayed-quote"
} // e.g.: https://api.iextrading.com/1.0/stock/aapl/delayed-quote

router.post('/', (req, res, next) => {
    let data = {
        user: User.info,
        totalValue: {
            portfolioValue: 0, portfolioGrowth: 0, portfolioGains: 0, stockValue: 0, stockGrowth: 0, stockGains: 0, cryptoValue: 0, cryptoGrowth: 0, cryptoGains: 0
        },
        snapshots: {},
        chartpoints: []
    }
    let userDeliver;
    data.assets = data.user.toObject();

    let recipient = User.info.email;
    let emailData = {};
    let promises = [];
    // console.log("recipient", recipient)
    // console.log("assets", data.assets.assets)
    
    for (let a in data.assets.assets) {
        if (data.assets.assets[a].type=='stock') {
            promises.push(superagent.get(stockAPI.start+data.assets.assets[a].symbol+stockAPI.end).then((res) => {    
                data.assets.assets[a].price = res.body.delayedPrice;
                res.body.low ? data.assets.assets[a].todayGain = res.body.delayedPrice - res.body.low : data.assets.assets[a].todayGain = 0;
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
                data.assets.assets[a].todayGain = parseInt(res.body[0].percent_change_24h) * parseInt(res.body[0].price_usd);
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
        // data = JSON.stringify(data);
        emailData.portfolio = data.assets.assets;
        // console.log('this is emailData portfolio right before send', emailData.portfolio)
        sendEmail(recipient, emailData, data.totalValue, userDeliver)
    }).then(()=> {
        return res.status(200).send({'response':'email sent!'});
    }).catch(console.error);
});

module.exports = router;