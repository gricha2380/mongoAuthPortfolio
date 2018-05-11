const express = require('express');
const router = express.Router();
const User = require('../models/user')

router.get('/', (req, res, next) => {
    return res.render('register', { title:'Create Account'});
});

router.post('/', (req, res, next) => {
    console.log('requst register', req.body)
    if (req.body.email && req.body.name && req.body.password && req.body.confirmPassword) {
      // confirm passwords match
      let userData = {
        email: req.body.email.toLowerCase(),
        name: req.body.name.toLowerCase(),
        password: req.body.password,
        carrier: req.body.carrier,
        phone: req.body.phone,
        assets: [],
        snapshots: []
      }
      console.log('userData',userData)
      console.log('user password', userData.password)
  
      User.create(userData, (error, user) => {
        if (error) {
          return next(error)
        } else {
          req.session.userId = user._id;
          return res.redirect('/overview')
        }
      })
  
      if (req.body.password !== req.body.confirmPassword) {
        let err = new Error('Passwords do not match')
        err.status=400;
        return next(err)  
      }
      return 
    } else {
      let err = new Error('All fields are required')
      err.status=400;
      return next(err)
    }
  });

module.exports = router;