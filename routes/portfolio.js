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
    console.log("user id here!!",User.info._id)

    // let search = User.find({"name":"demo"});
    // console.log("search resilts",search)

    // get a user with ID of 1
    // User.findById(User.info._id, function(err, user) {
    //     if (err) throw err;
    
    //     // change the users location
    //     user.location = 'uk';
    
    //     // save the user
    //     user.save(function(err) {
    //     if (err) throw err;
    
    //     console.log('User successfully updated!');
    //     console.log(user)
    //     console.log(user.location)
    //     });
    
    // });
    // console.log('search results',search)
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
        // find mongo collection for 

        // db.update(item);
        // mongoose.connect(process.env.mongoPortfolioAppURL)
        // let db = mongoose.connection;
        // db.on('error', console.error.bind(console, 'connection error:'));

        // db.collection('users') // to do
        // .findOneAndUpdate({id: rb.id}, {
        //   $set: item
        // }, {
        //   sort: {_id: -1},
        //   upsert: true
        // }, (err, result) => {
        //   if (err) return res.send(err)
        //   console.log('updated record', result)
        //   res.send(result)
        // })
        // // res.send(`${rb.name} asset updated`)

        // User.findById(id, function (err, tank) {
        //     if (err) return handleError(err);
          
        //     tank.size = 'large';
        //     tank.save(function (err, updatedTank) {
        //       if (err) return handleError(err);
        //       res.send(updatedTank);
        //     });
        //   });
    }
})

// new asset
router.post('/add/:id', (req, res) =>{
    User.find({ '_id': User._id }, 'name age', function (err, athletes) {
        if (err) return handleError(err);
        // 'athletes' contains the list of athletes that match the criteria.
      })

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