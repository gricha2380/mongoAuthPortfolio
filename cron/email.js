const superagent = require('superagent');
// let url = "http://localhost:3000"
let url = "https://portfolioapp2380.herokuapp.com"

const https = require('https');
https.get(`${url}/cron/email`).catch(console.error);