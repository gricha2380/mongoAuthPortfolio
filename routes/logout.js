const express = require('express');
const router = express.Router();
const User = require('../models/user')

router.get('/', (req,res, next)=> {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return next(err)
        } else {
          User.info = null;
          return res.redirect('/')
        }
      })
    }
  })

module.exports = router;