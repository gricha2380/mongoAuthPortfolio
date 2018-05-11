const express = require('express');
const router = express.Router();
const User = require('../models/user');
const login = require('../middleware/login');

router.get('/', login.requiresLogin, (req, res, next) => {
  let data = {
    user: User.info
}
  data = JSON.stringify(data);
  // make sure I'm sending the info the page needs
  return res.render('settings', { data, partials : { menuPartial : './partials/nav'} });
});

router.patch('/update/email', (req, res, next) => {
    let rb = req.body;
    console.log("inside update email route", rb)
    
    if (!rb.email) {
        return res.status(400).send("No email found");
    } 
    else {
        console.log("request body is...",rb)
        res.statusMessage = "Email Address Saved!";
        return res.status(200).send('maybe work');
        // console.log("id is...",req.params.id)
        // let item = {
        //     "name": rb.name,
        //     "symbol": rb.symbol,
        //     "type": rb.type,
        //     "purchasePrice": rb.purchasePrice,
        //     "quantity": rb.quantity,
        //     "exchange": rb.exchange
        // }

        // experimental example, updating nested asset array
        // console.log("what's in item now?",item)
        // User.update(
        //     { "assets.id": Number(req.params.id) },
        //     { $set:  { 
        //         "assets.$.name": item.name,
        //         "assets.$.symbol": item.symbol,
        //         "assets.$.type": item.type,
        //         "assets.$.purchasePrice": item.purchasePrice,
        //         "assets.$.quantity": item.quantity,
        //         "assets.$.exchange": item.exchange
        //     }},
        //     (err, result) => {
        //     if (err) {
        //         console.log("error:",err);
        //     } else {
        //         // console.log("success, asset updated", result);
        //         res.send(`${rb.name} asset updated`);
        //     }
        // })
    }
});

module.exports = router;