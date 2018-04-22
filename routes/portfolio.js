const express = require('express');
const router = express.Router();
const User = require('../models/user')
const mid = require('../middleware');
const fakeData = require('../middleware/fakeData');
//import getSnapshots()... & getAssets()

const superagent = require('superagent'); // for performing backend AJAX calls

let coinAPI = "https://api.coinmarketcap.com/v1/ticker/"; // e.g.: https://api.coinmarketcap.com/v1/ticker/Ethereum
let stockAPI = {
    "start": "https://api.iextrading.com/1.0/stock/",
    "end": "/delayed-quote"
} // e.g.: https://api.iextrading.com/1.0/stock/aapl/delayed-quote

router.get('/', mid.requiresLogin, (req, res, next) => {
    // console.log("user id here!!",User.info._id)

    let data = {
        user: User.info,
        totalValue: {
            portfolioValue: 0, portfolioGrowth: 0, portfolioGains: 0, stockValue: 0, stockGrowth: 0, stockGains: 0, cryptoValue: 0, cryptoGrowth: 0, cryptoGains: 0
        },
        snapshots: [],
        chartpoints: []
    }
    
    data.assets = data.user.toObject();
    // data.totalValue = fakeData.totalValue
    // data.user.snapshots = fakeData.snapshots

    let promises = [];
    
    for (let a in data.assets.assets) {
        if (data.assets.assets[a].type=='stock') {
            promises.push(superagent.get(stockAPI.start+data.assets.assets[a].symbol+stockAPI.end).then((res) => {    
                data.assets.assets[a].price = res.body.delayedPrice;
                res.body.low ? data.assets.assets[a].todayPercent = res.body.delayedPrice / res.body.low : data.assets.assets[a].todayPercent = 0;
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
                data.assets.assets[a].todayPercent = res.body[0].percent_change_24h;
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
    Promise.all(promises).then(function(results) {
        data = JSON.stringify(data);
        if (req.body.refresh) res.send(data.totalValue, data.snapshots)
        else {return res.render('portfolio', {data, partials : { menuPartial : './partials/nav'} })}
    });
});

// find asset
router.get('/edit/:id', (req, res) =>{
    console.log('here is the id',req.params.id)
    req.params.id = Number(req.params.id);
    User.findOne( {"assets.id" : req.params.id}, 
        {assets:{$elemMatch: 
            {id: req.params.id}}}, 
            (err, obj) => {
                console.log("I found this...",obj); 
                res.send(obj)
            }
        );
})

// edit asset
router.post('/edit/:id', (req, res) =>{
    let rb = req.body;
    if (!rb.name || !rb.symbol || !rb.type || !rb.purchasePrice || !rb.quantity || !rb.exchange) {
        response.status(400).send(JSON.stringify(request.body));
    } else {
        console.log("id is...",req.params.id)
        let item = {
            "name": rb.name,
            "symbol": rb.symbol,
            "type": rb.type,
            "purchasePrice": rb.purchasePrice,
            "quantity": rb.quantity,
            "exchange" : rb.exchange
        }

        // experimental example, updating nested asset array
        console.log("what's in item now?",item)
        User.update(
            { "assets.id": Number(req.params.id) },
            { $set:  { 
                "assets.$.name": item.name,
                "assets.$.symbol": item.symbol,
                "assets.$.type": item.type,
                "assets.$.purchasePrice": item.purchasePrice,
                "assets.$.quantity": item.quantity,
                "assets.$.exchange": item.exchange
            }},
            (err, result) => {
            if (err) {
                console.log("error:",err);
            } else {
                console.log("success, asset updated", result);
                res.send(`${rb.name} asset updated`);
            }
        })
    }
})

// new asset
router.post('/add/:id', (req, res) =>{
    User.find({ '_id': User._id }, 'name age', function (err, athletes) {
        if (err) return handleError(err);
      })

    let rb = req.body;
    if (!rb.name || !rb.symbol || !rb.type || !rb.purchasePrice || !rb.quantity || !rb.exchange || !rb.id) {
        res.status(400).send(JSON.stringify(req.body));
    } else {
        let item = {
            "name": rb.name,
            "symbol": rb.symbol,
            "type": rb.type,
            "purchasePrice": rb.purchasePrice,
            "quantity": rb.quantity,
            "exchange" : rb.exchange,
            "id" : rb.id
        }

        db.child(res.body.id).set(item);
        res.send(`${req.body.name} asset created`)
    }
})

module.exports = router;