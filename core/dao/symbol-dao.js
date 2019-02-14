var ccxt = require('ccxt');
const savesymbols = async () => {
    var exchangeId = 'binance'
    , exchangeClass = ccxt[exchangeId]
    , exchange = new exchangeClass ({
        'apiKey': 'SzvDW7ssPQUTTpYBu4C2oKl858fVJ7uPysxmtlNku8S1xTnRfaonUNspMeEFfkxU',
        'secret': 'Jn8TkGyKGeT79BIr9ne12vEqOe18eenYkGfcKRhnyLNnLzaPn1hYZYZu6Z2goKVx',
        'timeout': 30000,
        'enableRateLimit': true,
        'test': true
    });
    var result;
    await exchange.load_markets();
    var delay = 2000; // milliseconds = seconds * 1000
    try {
        result = await exchange.fetchOrderBook('BTC/USDT');
        await new Promise(function (resolve) {
            return setTimeout(resolve, delay);
        }); // rate limit
        res.send(result);
    }
    catch(error){
        console.log('Error caught here');
        console.log(error);
    }
    const {getSymbols} = require('../../models/symbol')

    var result = ()=>{
        getSymbols().then(function(symbols){
            var len = symbols.length
            console.log(len)
            for(var i = 0; i < len; i++){
                console.log(i, symbols[i].symbolName)
                console.log(typeof symbols[i].symbolName)
            }
        })
    }
}
  module.exports = {result}