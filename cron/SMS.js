const superagent = require('superagent');
let url = "https://portfolioapp2380.herokuapp.com"

const https = require('https');
https.get(`${url}/cron/SMS`);