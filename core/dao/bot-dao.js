const models = require('../../models')

var obj = []

const save = data => {
  /*
  data.name
  data.licensekey
  data.apikey
  data.symbol
  data.actualprice
  data.entryprice
  data.increase
  data.amountinvested
  data.equivalent
  data.tradingtime
  data.arrivaltime
  data.salesprice
  data.presaleprice
  data.gain
  */

  models.key.findOne({ where: {apikey: data.apikey} }).then(keydata => {
    models.Symbol.findOne({ where: {symbolname: data.symbol} }).then( symboldata => {
      data.apikey = keydata.id
      data.symbol = symboldata.id
      models.Bot.upsert(data).then( value =>{
          console.log(value)
          return 'insert complete'
      }).catch( err => {
          console.log(err)
          throw err
      })
    }).catch(err => {
        console.log(err)
        throw err
    })
  }).catch(err => {
      console.log(err)
      throw err
  })
}
const read = (data) => {
    /*
    data.symbol
    data.apikey
    data.secretkey
    */
   let result
   models.Bot.findOne({ where: {licensekey: data.licensekey} }).then(botdata => {
       result = botdata
       result.symbol = botdata.symbol.symbolname
       result.apikey = botdata.apikey.apikey
       return result
   }).catch(err => {
      console.log(err)
      throw err
  })
}
const runbot = () => {

}
module.exports = { save, read, runbot }