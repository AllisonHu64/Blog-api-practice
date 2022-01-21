const mysql = require('mysql2');
const { MYSQL_CONF } = require('../conf/db')

// create connection
const con = mysql.createConnection(MYSQL_CONF)

con.connect();

// handle sql query
function exec(sql){
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err){
                console.error(err);
                reject(err);
                return;
            }
            resolve(result);
        })
    })

    return promise;
}

module.exports = {
    exec,
    escape: mysql.escape
}