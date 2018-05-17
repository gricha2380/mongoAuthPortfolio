let runStats = (assets, totalValues) =>{
    let portfolioStats = {
        crypto:{
            total: 0, growth:0, gains:0
        },
        stock:{
            total: 0,growth:0,gains:0
        },
        total:totalValues,
        exchanges:totalValues.exchanges,
        exchangesSorted:[],
        topMovers: {
            today: {
                dollarWinners:[],
                dollarLosers:[],
                percentWinners:[],
                percentLosers:[]
            },
            total : {
                dollarWinners:[],
                dollarLosers:[],
                percentWinners:[],
                percentLosers:[]
            }
        },
        listLength: assets.length > 4 ? listLength = 5 : listLength = assets.length -1
    }

    console.log("asset length",assets.length)
    for (let exchange in portfolioStats.exchanges) {
        portfolioStats.exchangesSorted.push([exchange, portfolioStats.exchanges[exchange]]);
    }

    portfolioStats.exchangesSorted.sort((a, b) => b[1] - a[1]);

    // console.log("portfoliostats", portfolioStats)
    
    //daily dollar winners
    let todayGainUp = assets.sort((a,b) => {return parseFloat(b.todayGain) - parseFloat(a.todayGain) });
    console.log("todaygainup",todayGainUp)
    for (let i=0;i<=portfolioStats.listLength;i++) {
        document.querySelector(`#changeDollarWinner${i+1}`).innerHTML = 
        `<div id="changeDollarWinner${i+1}"><span class="symbol">${todayGainUp[i].symbol}</span><span class="value"> ${parseFloat(todayGainUp[i].todayGain).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</span></div>`
    }
    
    //daily dollar losers
    let todayGainDown = assets.sort((a,b) => {return parseFloat(a.todayGain) - parseFloat(b.todayGain) });
    for (let i=0;i<=portfolioStats.listLength;i++) {
        document.querySelector(`#changeDollarLoser${i+1}`).innerHTML = 
        `<div id="changeDollarLoser${i+1}"><span class="symbol">${todayGainDown[i].symbol}</span><span class="value"> ${parseFloat(todayGainDown[i].todayGain).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</span></div>`
    }
    
    //total dollar winners
    let totalGainUp = assets.sort((a,b) => {return parseFloat(b.totalGain) - parseFloat(a.totalGain) });
    for (let i=0;i<=portfolioStats.listLength;i++) {
        document.querySelector(`#dollarWinner${i+1}`).innerHTML = 
        `<div id="dollarWinner${i+1}"><span class="symbol">${totalGainUp[i].symbol}</span><span class="value"> ${parseFloat(totalGainUp[i].totalGain).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</span></div>`
    }
    
    //total dollar losers
    let totalGainDown = assets.sort((a,b) => {return parseFloat(a.totalGain) - parseFloat(b.totalGain) });
    for (let i=0;i<=portfolioStats.listLength;i++) {
        document.querySelector(`#dollarLoser${i+1}`).innerHTML = 
        `<div id="dollarLoser${i+1}"><span class="symbol">${totalGainDown[i].symbol}</span><span class="value"> ${parseFloat(totalGainDown[i].totalGain).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</span></div>`
    }

    //total percent losers
    let totalGrowthDown = assets.sort((a,b) => {return parseFloat(a.totalGrowth) - parseFloat(b.totalGrowth) });
    for (let i=0;i<=portfolioStats.listLength;i++) {
        document.querySelector(`#percentLoser${i+1}`).innerHTML = 
        `<div id="percentLoser${i+1}"><span class="symbol">${totalGrowthDown[i].symbol}</span><span class="value"> ${((parseFloat(totalGrowthDown[i].totalGrowth))).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}%</span></div>`
    }

    //total percent winners
    let totalGrowthUp = assets.sort((a,b) => {return parseFloat(b.totalGrowth) - parseFloat(a.totalGrowth) });
    for (let i=0;i<=portfolioStats.listLength;i++) {
        document.querySelector(`#percentWinner${i+1}`).innerHTML = 
        `<div id="percentWinner${i+1}"><span class="symbol">${totalGrowthUp[i].symbol}</span><span class="value"> ${((parseFloat(totalGrowthUp[i].totalGrowth))).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}%</span></div>`
    }

    //daily percent losers
    let todayGrowthDown = assets.sort((a,b) => {return parseFloat(a.todayPercent) - parseFloat(b.todayPercent) });
    for (let i=0;i<=portfolioStats.listLength;i++) {
        console.log("growth down calculation",(todayGrowthDown[i].todayPercent))
        document.querySelector(`#changePercentLoser${i+1}`).innerHTML = 
        `<div id="changePercentLoser${i+1}"><span class="symbol">${todayGrowthDown[i].symbol}</span><span class="value"> ${((parseFloat(todayGrowthDown[i].todayPercent))).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}%</span></div>`
    }
    
    //daily percent winners
    let todayGrowthUp = assets.sort((a,b) => {return parseFloat(b.todayPercent) - parseFloat(a.todayPercent) });
    for (let i=0;i<=portfolioStats.listLength;i++) {
        document.querySelector(`#changePercentWinner${i+1}`).innerHTML = 
        `<div id="changePercentWinner${i+1}"><span class="symbol">${todayGrowthUp[i].symbol}</span><span class="value"> ${((parseFloat(todayGrowthUp[i].todayPercent))*100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}%</span></div>`
    }

    //portfolio calculations
    document.querySelector('#portfolioTotal').innerHTML = `$${portfolioStats.total.portfolioValue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
    document.querySelector('#portfolioChange').innerHTML = `<span class='textNetural'></span>$${parseFloat(portfolioStats.total.portfolioGains).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} <span class='textNetural'>/</span> ${parseFloat(portfolioStats.total.portfolioGrowth).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}%<span class='textNetural'></span>`;

    let ofPortfolio = `of portfolio`;
    //stock calculations
    document.querySelector('#stockTotal').innerHTML = `$${portfolioStats.total.stockValue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
    document.querySelector('#stockChange').innerHTML = `<span class='textNetural'></span>$${parseFloat(portfolioStats.total.stockGains).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} <span class='textNetural'>/</span> ${parseFloat(portfolioStats.total.stockGrowth).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}%<span class='textNetural'></span>`;
    document.querySelector('#stockPercent').innerHTML = `${Math.round(parseFloat((portfolioStats.total.stockValue/portfolioStats.total.portfolioValue)*100))}% ${ofPortfolio}`;

    //crypto calculations
    document.querySelector('#cryptoTotal').innerHTML = `$${portfolioStats.total.cryptoValue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
    document.querySelector('#cryptoChange').innerHTML = `<span class='textNetural'></span>$${parseFloat(portfolioStats.total.cryptoGains).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} <span class='textNetural'>/</span> ${parseFloat(portfolioStats.total.cryptoGrowth).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}%<span class='textNetural'></span>`;
    document.querySelector('#cryptoPercent').innerHTML = `${Math.round(parseFloat((portfolioStats.total.cryptoValue/portfolioStats.total.portfolioValue)*100))}% ${ofPortfolio}`

    // exchange list
    portfolioStats.exchangesSorted.forEach((exchange,i) => {
        // console.log("exchange list item",exchange)
        document.querySelector('#exchangeHolder').innerHTML += `<div class='exchangeRow grid'><span class='exchange'>${exchange[0]}</span><span class='value'>$${exchange[1].toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</span><span class='value'>${((exchange[1] / portfolioStats.total.portfolioValue)*100).toFixed(2)}%</span></div>`;
        exchangePoints.push([exchange[0],exchange[1]])
    });
    
}