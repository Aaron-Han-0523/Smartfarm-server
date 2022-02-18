var evtInsert = function (evtDatas, index_sid,uid,connections) {
  //마이바티스
  const mybatisMapper = require("mybatis-mapper"); //매핑할 마이바티스
  mybatisMapper.createMapper(["./models/mybatis/sqlMapper.xml"]);

  // sql
  var db_config = require("../../config/mysql_config.js");
  var connection = db_config.connect(connections);
  var format = { language: "sql", indent: "  " };

  //events table에 insert
  console.log("evtsite_id" + index_sid);
  let time_stamp = evtDatas["t"];
  let event_saverity = evtDatas["ev"];
  let alarm_code = evtDatas["ec"];
  var evtInsertParams = {
    sid: index_sid,
    uid: uid,
    time_stamp: time_stamp,
    event_saverity: event_saverity,
    alarm_code: alarm_code,
  };
  var evtInsertQuery = mybatisMapper.getStatement(
    "mysql",
    "evtInsertParameters",
    evtInsertParams,
    format
  );
  console.log("evtInsertQuery : " + evtInsertQuery);
  connection.query(evtInsertQuery, function test(error, results, fields) {
    if (error) {
      var evtUpdateParams = evtInsertParams;
      var evtUpdateQuery = mybatisMapper.getStatement(
        "mysql",
        "evtUpdateParameters",
        evtUpdateParams,
        format
      );
      console.log("evtUpdateQuery : " + evtUpdateQuery);
      connection.query(evtUpdateQuery, function test(error, results, fields) {
        if (error) throw error;
        console.log("evtresults" + results);
      });
    }
  });
};
module.exports = evtInsert;
