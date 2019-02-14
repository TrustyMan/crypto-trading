"use strict";

var mysql = require("mysql");

var database_name   = 'winsshar';

function getMySqlClient() {
    var mysqlClient = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
    });

    mysqlClient.query('CREATE DATABASE IF NOT EXISTS ' + database_name, function(err) {
        if ( err && err.number != mysql.ERROR_DB_CREATE_EXISTS ) {
            throw err;
        }
        console.log('mysql database'+database_name+'created successfully!');
    });
    mysqlClient.query('USE ' + database_name);
    return mysqlClient;
}

exports.mysqlClient = getMySqlClient;