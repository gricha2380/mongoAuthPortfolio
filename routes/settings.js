const express = require('express');
const router = express.Router();
const User = require('../models/user');
const login = require('../middleware/login');
const bcrypt = require('bcrypt');

// ROOT LEVEL
router.get('/', login.requiresLogin, (req, res, next) => {
  let data = {
    user: User.info
}
  data = JSON.stringify(data);
  return res.render('settings', { data, partials : { menuPartial : './partials/nav'} });
});

// EMAIL ROUTE
router.patch('/update/email', (req, res, next) => {
    let rb = req.body;
    console.log("inside update email route", rb)
    
    if (!rb.email) {
        return res.status(400).send("No email found");
    } 
    else {
        console.log("request body is...",rb)
        let statusMessage = "Email Address Saved!";
        let item = {
            "email": rb.email
        }
        let update  = item;
        let options = { new: true }; 
        let query = { _id:User.info._id }; 
        console.log('findNupdate',query, update, options, "old info:",User.info.email)
        User.findOneAndUpdate(query, update, options, (err, asset)=>{ 
            if (err) throw err;
            console.log(`${item.email} email address updated...`);
            return res.status(200).send({email:item.email,message:statusMessage,status:200});
        });
    }
});

// PASSWORD ROUTE
router.patch('/update/password', (req, res, next) => {
    let rb = req.body;
    console.log("inside update password route", rb)
    
    let hashPass = (pass) => {
        bcrypt.hash(pass, 10, function (err,hash) {
            if (err) {return next(err);}
            console.log("input",pass)
            console.log("hashed output",hash)
            return hash;
            next();
        })
    }
    
    let hashNewPass = (pass) => {
        bcrypt.hash(pass, 10, function (err,hash) {
            if (err) {return next(err);}
            // console.log("hashing new password")
            // console.log("input",pass)
            console.log("hashed output",hash)
            let statusMessage = "Password Updated!";
            let item = {
                "password": hash
            }
            let update = item;
            let options = { new: true }; 
            let query = { _id:User.info._id }; 
            console.log('findNupdate',query, update, options, "old info:",User.info.password)
            // return res.status(200).send();
            User.findOneAndUpdate(query, update, options, (err, asset)=>{ 
                if (err) throw err;
                console.log(`${item.password} password updated...`);
                return res.status(200).send({password:item.password.length,message:statusMessage,status:200});
            });
        })
    }

    let currentPasswordFromRequestHashed = hashPass(rb.currentPassword);
    let currentPasswordHashed;
    let newPassword = rb.newPassword;
    let currentPasswordFromRequest = rb.newPassword;
    console.log("new password unhashed", newPassword)
    let newPasswordHashed = hashPass(rb.newPassword);

    let comparePass = (newPassword, currentPasswordHashed) => {
        bcrypt.compare(rb.currentPassword, currentPasswordHashed, function(err, match) {
            if(match) {
                console.log("Passwords match");
                hashNewPass(rb.newPassword)

            } else {
                console.log("Password does not match!!")
                let statusMessage = "Password does not match!";
                return res.status(400).send({password:item.password.length,message:statusMessage,status:400});
            } 
            });
    }

    if (!rb.newPassword || !rb.currentPassword) {
        let statusMessage = "No password found!";
        return res.status(400).send({password:item.password.length,message:statusMessage,status:400});
    }
    // note: check confirm password on client side...
    else {
        User.findById(User.info._id).then((e)=>{
            if (!e) console.log("User not found")
            console.log("Current hashed password", e.password);
            comparePass(newPassword, e.password);
        }).then(e=>{
            console.log("request body is...",rb);

        })
    
    }
});


// TEXT MESSAGE ROUTE
router.patch('/update/text', (req, res, next) => {
    let rb = req.body;
    console.log("inside update text message route", rb)
    
    if (!rb.textStatus || !rb.textFrequency || !rb.textPhone || !rb.textCarrier) {
        let statusMessage = "No text status found!";
        return res.status(400).send({textStatus:rb.textStatus,message:statusMessage,status:400});
    } 
    else {
        console.log("request body is...",rb)
        let statusMessage = "text settings saved!";
        let item = {
            "textDelivery": rb.textStatus,
            "textFrequency": rb.textFrequency,
            "phone": rb.textPhone,
            "carrier": rb.textCarrier
        }
        let update  = item;
        let options = { new: true }; 
        let query = { _id:User.info._id }; 
        console.log('findNupdate',query, update, options, "old info:",User.info.text)
        User.findOneAndUpdate(query, update, options, (err, asset)=>{ 
            if (err) throw err;
            console.log(`text status updated...`,item);
            return res.status(200).send({phone:item.phone,textStatus:item.textDelivery,carrier:item.carrier,message:statusMessage,status:200});
        });
    }
});

module.exports = router;