"user strict";

var express = require('express')
var router = express.Router()
var ccxt = require('ccxt')
var models  = require('../models')
var botdao = require('../core/dao/bot-dao')
var botlist = require('../core/realtime/bot').botlist
// const runbot = require('../core/realtime') 
// var symbol = require('../models/symbol');

//models
// const {createbot} = require('../../models/bot')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/checkLicense', function(req, res, next){
  // var result = {
  //   isValidUser: false
  // };
  // res.send(result);
  
  res.send("checkLicense");
});

//Orders on symbol "BTC/USDT"
router.post("/getOrder", async function(req, res, next){
  var exchangeId = 'binance'
  , exchangeClass = ccxt[exchangeId]
  , exchange = new exchangeClass ({
    'apiKey': 'SzvDW7ssPQUTTpYBu4C2oKl858fVJ7uPysxmtlNku8S1xTnRfaonUNspMeEFfkxU',
    'secret': 'Jn8TkGyKGeT79BIr9ne12vEqOe18eenYkGfcKRhnyLNnLzaPn1hYZYZu6Z2goKVx',
    'timeout': 30000,
    'enableRateLimit': true,
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
});

//get Symbols
router.post("/getsymbol", function(req, res, next){
  /*
  data.
  */
});

//new Bot configuration
router.post("/newbot", async (req, res, next) =>{
  let data = req.body
  /*
  data.name
  data.licensekey
  data.apikey
  data.symbol
  data.actualprice
  data.entryprice
  data.increase
  data.amount2invest
  data.equivalent
  data.trading
  data.arrival
  data.sale
  data.presale
  data.gain
  */
  // let result = botdao.save(data)

  //--------------------------------------------------------------------------------------
  //create deposit
  // let exchangeId = 'binance'
  // , exchangeClass = ccxt[exchangeId]
  // , exchange = new exchangeClass ({
  //   'apiKey': data.apikey,
  //   'secret': data.secretkey,
  //   'timeout': 30000,
  //   'enableRateLimit': true,
  //   'test': true
  // })
  // let response = undefined
  // const currencyCode = data.symbol.split('/')[0]
  // const amount = data.amountinvest
  // const market = data.symbol
  // //fetch deposit address
  // try {
  //   if (exchange.has['fetchDepositAddress']) {
  //     console.log('fetch')
  //     response = await exchange.fetchDepositAddress (currencyCode)
  //   }else if (exchange.has['createDepositAddress']){
  //     console.log('create')
  //     response = await exchange.createDepositAddress (currencyCode)
  //   }
  //   console.log (
  //     'In order to deposit ' + amount + ' ' + currencyCode + ' to ' + exchange.id + 
  //     ', please send your ' + amount + ' ' + currencyCode + ' to the address provided by the ' + 
  //     exchange.id + ' exchange for depositing: ' + response['address'] + (response['tag'] || ''))
  // } catch (e) {
  //   console.log('error')
  //   console.log (e.constructor.name, e.message)
  // }
  //--------------------------------------------------------------------------------------
  botlist.push(data)
  res.send("Successfully added!")
})

//getbot cofiguration
router.post('/getbot', (req, res, next) => {
  //data.licensekey
  let data = req.body
  let result = botdao.read(data)
  res.send(result)
})

//delete bot cofiguration
router.post('/deletebot', (req, res, next) => {
})

//new api key
router.post('/newapikey', (req, res, next)=>{
  var data = req.body;
  /*
  data.name
  data.exchangehouse
  data.licensekey
  data.apikey
  data.secretkey 
  */
  models.key.create(data).then( ()=>{
    res.send(data)
  })
})

//get api key list
router.post('/getapikeys', (req, res, next)=>{
  var data = req.body;
  /*
  data.licensekey
  */
  models.key.findAll({ where: {licensekey: data.licensekey} }).then( result => {
    // console.log(result);
    if(result.length==0){
      res.send("Invalid User!")
    }
    else{
      res.send(result);
    }
  })
})

//delete api key not completed
router.post('/deleteapikey', (req, res, next)=>{
  var data = req.body
  /*
  data.licensekey,
  data.apikey
  */
  models.key.findAndCountAll({ where: {licensekey: data.licensekey, apikey: data.apikey} }).then( result => {
    res.send(result)
    if (result.count === 0) {
      reject("deleted")
    }
    else {
      result.rows[0].destroy();
    }
  })
})

router.post('/queryaccountbalance', async (req,res,next)=>{
  let result
  let data = req.body
  let exchangeId = 'binance'
  , exchangeClass = ccxt[exchangeId]
  , exchange = new exchangeClass ({
    'apiKey': data.apikey,
    'secret': data.secretkey,
    'timeout': 30000,
    'enableRateLimit': true,
    'verbose' : true,
    'options': {
        'adjustForTimeDifference': true,
    }
  })
  await exchange.load_markets()
  if(exchange.has['fetchBalance']){
    // let sleep = (ms) => new Promise (resolve => setTimeout (resolve, ms));
    result = await exchange.fetchBalance()
  }
  // res.send(data)
  // console.log("_________________________________________________")
  // console.log(data)
  // console.log("_________________________________________________")
  res.send(result.info)
})
router.post('/getactualprice', async (req, res, next) => {
  let result
  let data = req.body
  console.log(data)
  let exchangeId = 'binance'
  , exchangeClass = ccxt[exchangeId]
  , exchange = new exchangeClass ({
    'apiKey': data.apikey,
    'secret': data.secretkey,
    'timeout': 30000,
    'enableRateLimit': true,
    'verbose' : true,
    'options': {
        'adjustForTimeDifference': true,
    }
  })
  await exchange.load_markets()
  if (exchange.has['fetchTrades']) {
    let since = exchange.milliseconds () - 60000 // -1 day from now
    let allTrades = []
    while (since < exchange.milliseconds ()) {
      const symbol = 'BTC/USDT' // change for your symbol
      const limit = 20 // change for your limit
      const trades = await exchange.fetchTrades (symbol, since, limit)
      if (trades.length) {
        since = trades[trades.length - 1]
        allTrades.push (trades)
        let max = trades[0].info.p;
        console.log("max: "+max); 
        res.send(max)
      } else {
        res.send("no data")
        break
      }
    }
  }
})
module.exports = router;