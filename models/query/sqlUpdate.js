var sqlUpdate = function (ssdatas, index_sid,uid) {
  //마이바티스
  const mybatisMapper = require("mybatis-mapper"); //매핑할 마이바티스
  mybatisMapper.createMapper(["./models/mybatis/sqlMapper.xml"]);

  // sql
  var db_config = require( "../../config/mysql_config.js");
  var connection = db_config.connect();
  var format = { language: "sql", indent: "  " };


  // trends table에 데이터 보내기
  
    var keys = Object.keys(ssdatas);
    console.log("Connected!");
    for (let i = 2; i < keys.length; i++) {
      let sensor_id = keys[i].toString();
      let time_stamp = ssdatas["t"].toString();
      let value = ssdatas[keys[i]].toString();
      var params = {
        sensor_id: sensor_id,
        sid: index_sid,
        uid: uid,
        time_stamp: time_stamp,
        value: value,
      };
      var query = mybatisMapper.getStatement(
        "mysql",
        "sqlUpdateParameters",
        params,
        format
      );

      connection.query(query);
    }
    // console.log(results);
  


};
module.exports = sqlUpdate;
