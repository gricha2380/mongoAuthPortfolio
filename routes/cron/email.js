const express = require('express');
const router = express.Router();
const User = require('../../models/user')
const formatDate = require('../../middleware/formatDate').formatDate;
let sendEmail = require('../../middleware/sendEmail').sendEmail;
const superagent = require('superagent'); 

// const mongoose = require('mongoose');
// mongoose.connect(process.env.mongoPortfolioAppURL)
// mongoose.set('debug', true);

let coinAPI = "https://api.coinmarketcap.com/v1/ticker/"; // e.g.: https://api.coinmarketcap.com/v1/ticker/Ethereum
let stockAPI = {
    "start": "https://api.iextrading.com/1.0/stock/",
    "end": "/delayed-quote"
} // e.g.: https://api.iextrading.com/1.0/stock/aapl/delayed-quote


router.get('/', (req, res, next) => {
    // protect against hammering: create table for today's date. If current day > saved day then run
console.log("getting started")
    let assetHolder=[], promises=[];
    let data = {
        totalValue: {
            portfolioValue: 0, portfolioGrowth: 0, portfolioGains: 0, stockValue: 0, stockGrowth: 0, stockGains: 0, cryptoValue: 0, cryptoGrowth: 0, cryptoGains: 0, cryptoCount: 0, stockCount: 0
        },
        assets:[],
        emailData: {}
    }

    User.find({}, 'assets', (err, portfolio) => {
        if(err){
          console.log(err);
        } else{          
            portfolio.forEach((p,i,arr)=>{
                console.log("looking for email delivery")
                User.findById(p._id, 'emailDelivery email', (err,info)=>{
                    console.log("Delivery setting is...", info.emailDelivery)
                    console.log("recieptit is... ",info.email)
                    data.recipient = info.email
                    if (info.emailDelivery) processDelivery();
                    else res.send("Delivery setting false") // browser test
                })
                let processDelivery = ()=>{
                    console.log("starting delovery process")
                    // data.recipient = p.email;
                    console.log("what my name is",p._id)
                    let id = p._id;
                    console.log("how many assets",p.assets.length)
                    data.assets=p.assets;
                    console.log("what hold data asset", data.assets)

                    p.assets.forEach((asset,index) => {
                        if (asset.type=='stock') {
                            console.log('its a stock!',data.assets[index].name)
                            promises.push(superagent.get(stockAPI.start+data.assets[index].symbol+stockAPI.end).then((res) => {  
                                data.totalValue.stockCount++;  
                                data.assets[index].price = res.body.delayedPrice;
                                res.body.low ? data.assets[index].todayGain = res.body.delayedPrice - res.body.low : data.assets[index].todayGain = 0;
                                data.totalValue.portfolioValue += (data.assets[index].quantity * data.assets[index].price);
                                data.totalValue.portfolioGrowth += (data.assets[index].price / data.assets[index].purchasePrice) - 1;
                                data.totalValue.portfolioGains += (data.assets[index].price - data.assets[index].purchasePrice) * data.assets[index].quantity;
                                data.totalValue.stockValue += (data.assets[index].quantity * data.assets[index].price);
                                data.totalValue.stockGrowth += (data.assets[index].price / data.assets[index].purchasePrice) - 1;
                                data.totalValue.stockGains += (data.assets[index].price - data.assets[index].purchasePrice) * data.assets[index].quantity;
                                // console.log("what I know...",data.assets[index])
                            }).catch(console.error))
                        }
                        if (asset.type=='crypto') {
                            console.log('its a crypto!', data.assets[index].name)
                            promises.push(superagent.get(coinAPI+data.assets[index].name).then((res) => {
                                data.totalValue.cryptoCount++;  
                                data.assets[index].price = res.body[0].price_usd;
                                data.assets[index].todayGain = parseInt(res.body[0].percent_change_24h) * parseInt(res.body[0].price_usd);
                                data.totalValue.portfolioValue += (data.assets[index].quantity * data.assets[index].price);
                                data.totalValue.portfolioGrowth += (data.assets[index].price / data.assets[index].purchasePrice) - 1;
                                data.totalValue.portfolioGains += (data.assets[index].price - data.assets[index].purchasePrice) * data.assets[index].quantity;
                                data.totalValue.cryptoValue += (data.assets[index].quantity * data.assets[index].price);
                                data.totalValue.cryptoGrowth += (data.assets[index].price / data.assets[index].purchasePrice) - 1;
                                data.totalValue.cryptoGains += (data.assets[index].price - data.assets[index].purchasePrice) * data.assets[index].quantity;
                                // console.log("what I know...",data.assets[index])
                            }).catch(console.error))
                        }
                    })
                    Promise.all(promises).then((results) => {
                        data.emailData.portfolio = data.assets;
                        // console.log('this is emailData portfolio right before send', emailData.portfolio)
                        sendEmail(data.recipient, data.emailData, data.totalValue)
                        res.json({"email sent": data}) // browser test
                    }).catch(console.error);
                }

            })
        } // end else
    })

})

module.exports = router;