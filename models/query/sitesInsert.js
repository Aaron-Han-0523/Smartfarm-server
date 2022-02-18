var sitesInsert = function (sitesDatas, index_sid, uid,connections) {
  //마이바티스
  const mybatisMapper = require("mybatis-mapper"); //매핑할 마이바티스
  mybatisMapper.createMapper(["./models/mybatis/sqlMapper.xml"]);

  // sql
  var db_config = require("../../config/mysql_config.js");
  var connection = db_config.connect(connections);
  var format = { language: "sql", indent: "  " };

  //sites table에 insert
  console.log("sites insertsss!");
  let site_name = sitesDatas["sname"];
  let site_address = 'sitesDatas[""]';
  let site_gps_latitude = sitesDatas["gps_x"];
  let site_gps_longitude = sitesDatas["gps_y"];
  let site_th_sensor_count =
    sitesDatas["temp_ss_cnt"] +
    sitesDatas["humid_ss_cnt"] +
    sitesDatas["exttemp_ss_cnt"];
  let site_soil_sensor_count =
    sitesDatas["soiltemp_ss_cnt"] + sitesDatas["soilhumid_ss_cnt"];
  let site_side_motor_count = sitesDatas["motor_cnt"];
  let site_top_motor_count = sitesDatas["motor_cnt"];
  let site_actuator_count = 'sitesDatas["actuator_cnt"]';
  let site_pump_count = sitesDatas["pump_cnt"];
  let site_valve_count = sitesDatas["valve_cnt"];
  let site_cctv_count = 'sitesDatas["cctv_cnt"]';
  let site_set_alarm_enable = sitesDatas["alarm_en"];
  let site_set_alarm_high = sitesDatas["alarm_high_temp"];
  let site_set_alarm_low = sitesDatas["alarm_low_temp"];
  let site_set_alarm_timer = sitesDatas["watering_timer"];

  var sitesInsertParams = {
    sid: index_sid,
    uid: uid,
    site_name: site_name,
    site_address: site_address,
    site_gps_latitude: site_gps_latitude,
    site_gps_longitude: site_gps_longitude,
    site_th_sensor_count: site_th_sensor_count,
    site_soil_sensor_count: site_soil_sensor_count,
    site_side_motor_count: site_side_motor_count,
    site_top_motor_count: site_top_motor_count,
    site_actuator_count: site_actuator_count,
    site_pump_count: site_pump_count,
    site_valve_count: site_valve_count,
    site_cctv_count: site_cctv_count,
    site_set_alarm_enable: site_set_alarm_enable,
    site_set_alarm_high: site_set_alarm_high,
    site_set_alarm_low: site_set_alarm_low,
    site_set_alarm_timer: site_set_alarm_timer,
  };
  var sitesInsertQuery = mybatisMapper.getStatement(
    "mysql",
    "sitesInsertParameters",
    sitesInsertParams,
    format
  );
  console.log("sites insertsss! : " + sitesInsertQuery);
  connection.query(sitesInsertQuery, function test(error, results, fields) {
    if (error) {
      var sitesUpdateParams = sitesInsertParams;
      var sitesUpdateQuery = mybatisMapper.getStatement(
        "mysql",
        "sitesUpdateParameters",
        sitesUpdateParams,
        format
      );
      connection.query(sitesUpdateQuery, function test(error, results, fields) {
        if (error) throw error;
        console.log("evtresults" + results);
      });
    }
  });
};
module.exports = sitesInsert;
