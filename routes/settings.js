const express = require('express');
const router = express.Router();
const User = require('../models/user');
const login = require('../middleware/login');

router.get('/', login.requiresLogin, (req, res, next) => {
  let data = {
    user: User.info
}
  data = JSON.stringify(data);
  return res.render('settings', { data, partials : { menuPartial : './partials/nav'} });
});

module.exports = router;