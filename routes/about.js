const express = require('express');
const router = express.Router();
const User = require('../models/user')
const mid = require('../middleware');

router.get('/', (req, res, next) => {
  let data = {
    user: User.info
}
  data = JSON.stringify(data);
  return res.render('about', { data, partials : { menuPartial : './partials/nav'} });
});

module.exports = router;