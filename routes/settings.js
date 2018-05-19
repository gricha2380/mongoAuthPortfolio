const express = require('express');
const router = express.Router();
const User = require('../models/user');
const login = require('../middleware/login');
const bcrypt = require('bcrypt');

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

router.patch('/update/password', (req, res, next) => {
    let rb = req.body;
    console.log("inside update email route", rb)
    
    let currentPasswordHashed;
    let newPasswordHashed;

    User.findById(User.info._id).then((e)=>{
        if (!e) console.log("No data received")
        checkPassword(e.password);

    })

    let checkPassword = (value) => {
        currentPasswordHashed = value;
        //hash req.body.oldPassword
        //hash req.body.newPassword
    }

    let hashPass = (pass) => {
        bcrypt.hash(pass, 10, function (err,hash) {
            if (err) {
                return next(err);
            }
            console.log("old pass",pass)
            console.log("hashed pass",hash)
            return hash;
            next();
        })
    }

    if (!rb.newPassword) {
        return res.status(400).send("No password found");
    }
    // note: check confirm password on client side...
    else if (rb.oldPassword == currentPasswordHashed) {
        console.log("request body is...",rb)
        let statusMessage = "Password Updated!";

        let item = {
            "password": rb.password
        }
        let update  = item;
        let options = { new: true }; 
        let query = { _id:User.info._id }; 
        console.log('findNupdate',query, update, options, "old info:",User.info.password)
        // return res.status(200).send();
        User.findOneAndUpdate(query, update, options, (err, asset)=>{ 
            if (err) throw err;
            console.log(`${item.password} password updated...`);
            return res.status(200).send({password:item.password.length,message:statusMessage,status:200});
        });
    }
    else {
        return res.status(400).send("Password error");
    }
});

module.exports = router;