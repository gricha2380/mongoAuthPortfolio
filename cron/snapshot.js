const superagent = require('superagent');
// let url = "http://localhost:3000"
let url = "https://portfolioapp2380.herokuapp.com"

// let updateHistorical = () => {
//     let info = {"email":"demo","password":"demo"}
//     // processLogin(info);
//     superagent.get(`${url}/cron/historical`).then((res) => { console.log(`Snapshot run`, res) }).catch(console.error)
// }
// updateHistorical();

// module.exports.updateHistorical = updateHistorical;

const https = require('https');
https.get(`${url}/cron/historical`).catch(console.error);