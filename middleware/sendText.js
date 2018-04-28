const nodemailer = require('nodemailer'); // email & text message
const formatDate = require('../middleware/formatDate').formatDate;
// const tableTemp = require('../middleware/tableTemp'); // use for dummy email data

let sendText = (recipient, data, totalValue) => {
    
    let userEmail = process.env.portfolioUserEmail;
    let userPassword = process.env.portfolioUserPassword;
    
    
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.portfolioUserEmail,
            pass: process.env.portfolioUserPassword
        }
    });
    
    let mailOptions = {
        from: '"Portfolio App 2.0" <gregor@gregorrichardson.com>',
        to: recipient,
        subject: 'Portfolio Update',
        text: 
        `${formatDate('word')}\n\nPortfolio Value: $${totalValue.portfolioValue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}\n($${totalValue.portfolioGains.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}/${totalValue.portfolioGrowth.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}%)`
    };
    
    transporter.sendMail(mailOptions, (error, info) =>{
        if (error) {
            console.log(error);
        } else {
            console.log(`Success. SMS sent to ${recipient}`, info);
            // return res.status(200).send({'response':'SMS sent!'});
        }
    });
}

module.exports.sendText = sendText;