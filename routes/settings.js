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
        let statusMessage = "Email Address Saved!";
        // return res.status(200).send(); // for testing without saving

        let item = {
            "email": rb.email
        }
        let update  = item;
        let options = { new: true }; 
        let query = { _id:User.info._id }; 
        console.log('findNupdate',query, update, options, "old info:",User.info.email)
        // return res.status(200).send();
        User.findOneAndUpdate(query, update, options, (err, asset)=>{ 
            if (err) throw err;
            console.log(`${item.email} email address updated...`);
            return res.status(200).send({email:item.email,message:statusMessage,status:200});
        });
    }
});

module.exports = router;