const models = require('../../models')

const save = data => {
    /*
    data.symbolname
    data.exchangefrom
    data.exchangeto
    data.buy_or_sell
    data.price
    data.amount
    */
    // console.log(data);
    // console.log(models.key);
    models.Symbol.findOne({ where: {symbolname: data.symbolname} }).then(symboldata => {
        data.symbolname = symboldata.id
        models.Order.upsert(data).catch( error => {
            console.log(error)
        })
    }).catch(error => {
        console.log(error)
        throw error
    })
}
const read = (symbol, timestamp) => {
    models.Symbol.findOne({ where: {symbolname: symbol} }).then(symbol => {
        models.Order.findAll({ where: {symbolname: symbol.id} }).then(orders =>{
            console.log(orders)
        }).catch(error => {
            console.log(error)
            throw error
        })
    }).catch(error => {
        console.log(error)
        throw error
    })
}
module.exports = { save, read }