const ccxt = require('ccxt')

var botlist = []
const runbot = () => {
    console.log('=============================================runbot=============================================')
    setInterval( async () => {
        botlist.forEach(async bot => {
            let exchangeId = 'binance'
            , exchangeClass = ccxt[exchangeId]
            , exchange = new exchangeClass ({
                'apiKey': bot.apikey,
                'secret': bot.secretkey,
                'timeout': 30000,
                'enableRateLimit': true,
                'verbose' : true,
                'options': {
                    'adjustForTimeDifference': true,
                }
            })
            let pe = bot.entryprice
            let psa = pe-2*pe/100
            let ph = 0
            let pin, ps
            const symbol = bot.symbol // change for your symbol.
            const type = 'limit'
            let arrivaltime

            await exchange.load_markets()
            // console.log(bot.apikey, bot.secretkey)
            console.log('************************************************')
            if (exchange.has['fetchOrders']) {
                //convert second to milisecond
                if(bot.arrivaltime[ bot.arrivaltime.length - 1 ]=='s') {
                    arrivaltime = parseInt(bot.arrival)*1000
                } else if (bot.arrivaltime[bot.arrival.length-1]=='m') {
                    arrivaltime = parseInt(bot.arrival)*60*1000
                }
                console.log(arrivaltime)
                let since = exchange.milliseconds () - arrivaltime // -1 s from now
                // alternatively, fetch from a certain starting datetime
                // let since = exchange.parse8601 ('2018-01-01T00:00:00Z')
                let allTrades = []
                // console.log(since)
                while (since < exchange.milliseconds ()) {
                    const limit = 20 // change for your limit
                    const trades = await exchange.fetchTrades(symbol, since, limit)
                    console.log('*************order*************')
                    console.log(trades)
                    console.log('*************end*************')
                    if (trades.length) {
                        // console.log("*****************************")
                        // console.log(trades)
                        // console.log("*****************************")
                        since = trades[trades.length - 1]
                        // allTrades.push (trades)
                        pin = since.price
                        trades.forEach(element => {
                            if(element.price >= ph){
                                ph = element.price
                            }
                        })
                    } else {
                        break
                    }
                }
            }
            ps = ph - 2*pe/100
            console.log('psa:' + psa)
            console.log('ps:' + ps)
            console.log('pe: ' + pe)
            console.log('pin:' + pin) 
            console.log('ph:' + ph)
            if(psa > pin || pin < ps){
                //createorder
                const amount = bot.amount2invest
                const side = 'sell'
                console.log('createorder')
                const order = await exchange.createOrder(symbol, type, side, amount, ps).then(result => {
                    console.log('order:', result)
                }).catch(err => {
                    console.log('error')
                    console.log(err)
                    throw err
                })
            }
        })
    }, 15000)
}
module.exports = { runbot, botlist }