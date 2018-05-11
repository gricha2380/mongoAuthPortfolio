const nodemailer = require('nodemailer'); // email & text message
const formatDate = require('../middleware/formatDate').formatDate;
// const tableTemp = require('../middleware/tableTemp'); // use for dummy email data

let sendEmail = (recipient, data, totalValue) => {
    
    let userEmail = process.env.portfolioUserEmail;
    let userPassword = process.env.portfolioUserPassword;
    console.log(`survey recipent is ${recipient}`)
    console.log(`local env email address ${process.env.portfolioUserEmail}`)
    // console.log('probably data portfolio', data.portfolio);
    let table = {
        'start':'<table>',
        'end':'</table>',
        'rowStart':'<tr>',
        'rowEnd' : '</tr>',
        'tdStart':'<td>',
        'tdEnd':'</td>',
        'theadStart':'<thead>',
        'theadEnd':'</thead>',
        'tbodyStart':'<tbody>',
        'tbodyEnd':'</tbody>'
    }
    let p = `style="padding: .5rem 1rem;"`; 
    
    table.content = `<table style="border-collapse: collapse; margin: auto"><thead style="background-color: #1b1d25;color: #8d8e91;"><td ${p}>Symbol</td><td ${p}>Price</td><td ${p}>Price Paid</td><td ${p}>Qnty</td><td ${p}>Cost</td><td ${p}>Value</td><td ${p}>Growth</td><td ${p}> Gain</td><td ${p}>Gain 24hr</td></thead><tbody style="background: #efefef;">`;
    
    for (let x = 0; x < data.portfolio.length; x++) {
        if (data.portfolio[x]) {
            let price = parseFloat(data.portfolio[x].price);
            let pricePaid = parseFloat(data.portfolio[x].purchasePrice); 
            let quantity = parseFloat(data.portfolio[x].quantity);
            let marketValue = price * quantity;
            let cost = pricePaid * quantity;
            let value = quantity * price;
            let growth = (marketValue / cost) * 100;
            let gain = (price * quantity) - (pricePaid * quantity);
            let gain24 = parseFloat(data.portfolio[x].todayGain);
        
            table.content += `<tr><td ${p}><b>${data.portfolio[x].symbol.toUpperCase()}</b></td><td ${p}>$${price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</td><td ${p}>$${pricePaid.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</td><td ${p}>${quantity}</td><td ${p}>$${cost.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</td><td ${p}>$${value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</td><td ${p}>${growth.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}%</td><td ${p}>$${gain.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</td>`
            gain24 > 0 ? table.content += `<td ${p}><span style="color:green">$${gain24.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</span></td></tr>` : table.content += `<td ${p}><span style="color:red">$${gain24.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</span></td></tr>`;
        }
    }
    table.content += table.tbodyEnd + table.end;
    
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
        html: 
        `<div style="text-align: center; color: black">
        <h3 style="color: black">Portfolio Update</h3>
        <div style="color: black">${formatDate('full')}</div>
        <div style="color: black"><b>Portfolio Value: $${totalValue.portfolioValue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</b></div>
        <div>
        <span style="color: black">(</span>
        <span style="color: green">$${totalValue.portfolioGains.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</span>
        <span style="color: black">/</span>
        <span style="color: green">${totalValue.portfolioGrowth.toFixed(2)}%</span>
        <span style="color: black">)</span>
        </div>
        </div>
        
        <div style="margin: 50px auto">
        ${table.content}
        </div>
        <div style="text-align:center"><a href="https://portfolioapp2380.herokuapp.com">View Portfolio</a></div>
        `
    };
    
    transporter.sendMail(mailOptions, (error, info) =>{
        if (error) {
            console.log(error);
        } else {
            console.log(`Email sent: `,info);
            return res.status(200).send({'response':'email sent!'});
        }
    });
}

module.exports.sendEmail = sendEmail;