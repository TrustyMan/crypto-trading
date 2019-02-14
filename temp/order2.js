'use strict';
var db = require('../db');

var getOrder = function getOrder(symbolName) {
    return new Promise(function (resolve, reject) {
        db.query('SELECT * from tbl_orderbook WHERE symbolName='+symbolName, function (error, results, fields) {
            if (error) {
                console.log(error);
                reject();
            } else {
                resolve(results[0]);
            }
        });
    });
};
var saveOrder = function saveOrder(data) {
    return new Promise(function (resolve, reject) {
        db.query('INSERT INTO tbl_orderbook (symbolName, exchangeFrom, exchangeTo, buy_or_sell, price, amount) VALUES ('+data.symbolName+','+data.exchangeFrom+','+data.exchangeTo+','+data.buy_or_sell+','+data.price+','+data.price+','+data.amount+')', function (error, results, fields) {
            if (error) {
                console.log(error);
                reject();
            } else {
                resolve(results[0]);
            }
        });
    });
}

// The code below export the above functios so it can be used in other files.
module.exports = {
    getAllUser
};