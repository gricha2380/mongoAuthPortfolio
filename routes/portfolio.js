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
    console.log('here is user stuff',User)
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
            // console.log('processed data', data)
            data = JSON.stringify(data);
            if (req.body.refresh) res.send(data.totalValue, data.snapshots)
            else {return res.render('portfolio', {data, partials : { menuPartial : './partials/nav'} })}
        });
    // })
    // .catch(console.error));
});

// find asset
router.get('/edit/:id', (req, res) =>{
    console.log('here is the id',req.params.id)
    req.params.id = Number(req.params.id);
    let promises = [];
    let data = {
        user: User.info
    }
    data.assets = data.user.toObject(); // turn into a real object
    let current = data.assets.assets;
    console.log('dater assets length',current.length);
    for(let i=0;i<current.length;i++){
        console.log('the id:',current[i].id, typeof current[i].id, typeof req.params.id)
        if(Number(current[i].id)==Number(req.params.id)) {
            console.log('yeehaw',current[i])
            res.send(current[i])
        }
    }
})

// edit asset
router.post('/edit/:id', (req, res) =>{
    let rb = req.body;
    if (!rb.name || !rb.symbol || !rb.type || !rb.purchasePrice || !rb.quantity || !rb.exchange) {
        response.status(400).send(JSON.stringify(request.body));
    } else {
        // let db;
        let item = {
            "name": rb.name,
            "symbol": rb.symbol,
            "type": rb.type,
            "purchasePrice": rb.purchasePrice,
            "quantity": rb.quantity,
            "exchange" : rb.exchange
        }
        // db.update(item);
        mongoose.connect('mongodb://mustBeFunny:mu*85fadwdd@ds263988.mlab.com:63988/portfolioapp2380')
        let db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));

        db.collection('users') // to do
        .findOneAndUpdate({id: rb.id}, {
          $set: item
        }, {
          sort: {_id: -1},
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)
          console.log('updated record', result)
          res.send(result)
        })
        // res.send(`${rb.name} asset updated`)
    }
})

// new asset
router.post('/add/:id', (req, res) =>{
    let rb = req.body;
    if (!rb.name || !rb.symbol || !rb.type || !rb.purchasePrice || !rb.quantity || !rb.exchange || !rb.id) {
        response.status(400).send(JSON.stringify(request.body));
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

        db.child(request.body.id).set(item);
        response.send(`${request.body.name} asset created`)
    }
})

module.exports = router;

// edit post scratch pad...
// User.findById(req.session.userId)
//     .exec((error, user)=>{
//       if (error) {
//         return next(error);
//       } else {
//         return res.render('profile', {title: 'Profile', name: user.name, favorite: user.favoriteBook})
//       }
//     })