var mysql = require("mysql");
 //config
 var config = require("./config.json");
 const environment = process.env.NODE_ENV || "development";
 const environmentConfig = config[environment];

var db_info = {
    host: environmentConfig.host,
    user: environmentConfig.username,
    password: environmentConfig.password,
    database: environmentConfig.database,
    multipleStatements: true,
  };

  module.exports = {
    init: function () {
        return mysql.createConnection(db_info);
    },
    connect: function(conn) {
        conn.connect(function(err) {
            if(err) console.error('mysql connection error : ' + err);
            else console.log('mysql is connected successfully!');
        });
    }
}