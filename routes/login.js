const express = require('express');
const router = express.Router();
const User = require('../models/user')
const mid = require('../middleware');

router.get('/', mid.loggedOut, (req, res, next) => {
    return res.render('login', {title: 'Log In'})
  })
  
router.post('/', (req, res, next)=> {
    if (req.body.email && req.body.password) {
        User.authenticate(req.body.email, req.body.password, (error, user) => {
        if (error || !user) {
            let err = new Error('Wrong username or password');
            err.status = 401;
            return next(err);
        } else {
            req.session.userId = user._id; // set session
            User.findById(user._id)
            .exec((error, user)=>{
                if (error) {
                return next(error);
                } else {
                User.info = {name:user.name}
                return res.redirect('/overview')
                }
            })
        }
        });
    } else {
        let err = new Error('You need email and password')
        err.status = 401;
        return next(err);
    }
})

module.exports = router;

