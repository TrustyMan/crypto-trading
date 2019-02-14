const ccxt = require('ccxt')
const models = require('../../models')
const orderdao = require('../dao/order-dao')

let readBTCUSDT = async () => {
    let exchangeId = 'binance'
    , exchangeClass = ccxt[exchangeId]
    , exchange = new exchangeClass ({
        'apiKey': 'SzvDW7ssPQUTTpYBu4C2oKl858fVJ7uPysxmtlNku8S1xTnRfaonUNspMeEFfkxU',
        'secret': 'Jn8TkGyKGeT79BIr9ne12vEqOe18eenYkGfcKRhnyLNnLzaPn1hYZYZu6Z2goKVx',
        'timeout': 30000,
        'enableRateLimit': true,
        'test': true
    })
    await exchange.load_markets()
    setInterval( async () => {
        if (exchange.has['fetchTrades']) {
            let since = exchange.milliseconds () - 1000 // -1 s from now
            // alternatively, fetch from a certain starting datetime
            // let since = exchange.parse8601 ('2018-01-01T00:00:00Z')
            let allTrades = []
            console.log(since)
            while (since < exchange.milliseconds ()) {
                const symbol = 'BTC/USDT' // change for your symbol
                const limit = 20 // change for your limit
                const trades = await exchange.fetchTrades (symbol, since, limit)
                if (trades.length) {
                    // console.log("*****************************")
                    // console.log(trades)
                    // console.log("*****************************")
                    since = trades[trades.length - 1]
                    // allTrades.push (trades)
                    trades.forEach(element => {
                        let data = {
                            timestamp       : element.timestamp,
                            symbolname      : element.symbol,
                            side            : element.side,
                            price           : element.price,
                            amount          : element.amount,
                        }
                        orderdao.save(data)
                    })
                } else {
                    break
                }
            }
        }
    }, 1000)
}

module.exports = { readBTCUSDT }