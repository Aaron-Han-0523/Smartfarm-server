var mechInsert = function (mech_datas, mech, index_sid, uid) {
  //마이바티스
  const mybatisMapper = require("mybatis-mapper"); //매핑할 마이바티스
  mybatisMapper.createMapper(["./models/mybatis/sqlMapper.xml"]);

  // sql
  var db_config = require("../../config/mysql_config.js");
  var connection = db_config.connect();
  var format = { language: "sql", indent: "  " };

  //각 장치 table에 insert/update
  console.log(mech + "Insert!");
  let cnt = 0;
  if (
    mech == "temp" ||
    mech == "humid" ||
    mech == "exttemp" ||
    mech == "soiltemp" ||
    mech == "soilhumid"
  ) {
    cnt =
      mech_datas[mech + "_ss_cnt"] == undefined
        ? 0
        : mech_datas[mech + "_ss_cnt"];
  } else {
    cnt =
      mech_datas[mech + "_cnt"] == undefined ? 0 : mech_datas[mech + "_cnt"];
  }

  console.log(mech + cnt + "Insert!");
  for (let index = 0; index < cnt; index++) {
    if (
      mech == "temp" ||
      mech == "humid" ||
      mech == "exttemp" ||
      mech == "soiltemp" ||
      mech == "soilhumid"
    ) {
      var sensor_name = mech_datas[mech + "_ss_name_" + (index + 1)];
      var ssInsertParams = {
        sensor_id: mech + "_" + (index + 1),
        sid: index_sid,
        uid: uid,
        sensor_type: 0,
        sensor_name: sensor_name,
      };
      var ssInsertQuery = mybatisMapper.getStatement(
        "mysql",
        "ssInsertParameters",
        ssInsertParams,
        format
      );
      console.log("ssInsertQuery : " + ssInsertQuery);
      connection.query(ssInsertQuery, function test(error, results, fields) {
        if (error) {
          var ssUpdateParams = ssInsertParams;
          var ssUpdateQuery = mybatisMapper.getStatement(
            "mysql",
            "ssUpdateParameters",
            ssUpdateParams,
            format
          );
          connection.query(
            ssUpdateQuery,
            function test(error, results, fields) {
              if (error) throw error;
              console.log("evtresults" + results);
            }
          );
        }
      });
    } else if (mech == "pump") {
      var pump_name = mech_datas[mech + "_name_" + (index + 1)];
      var pumpInsertParams = {
        pump_id: mech + "_" + (index + 1),
        sid: index_sid,
        uid: uid,
        pump_action: 0,
        pump_name: pump_name,
      };
      var pumpInsertQuery = mybatisMapper.getStatement(
        "mysql",
        "pumpInsertParameters",
        pumpInsertParams,
        format
      );

      connection.query(pumpInsertQuery, function test(error, results, fields) {
        if (error) {
          var pumpUpdateParams = {
            pump_id: mech + "_" + (index + 1),
            sid: index_sid,
            uid: uid,
            pump_name: mech_datas[mech + "_name_" + (index + 1)],
          };
          var pumpsUpdateQuery = mybatisMapper.getStatement(
            "mysql",
            "pumpUpdateParameters",
            pumpUpdateParams,
            format
          );
          connection.query(
            pumpsUpdateQuery,
            function test(error, results, fields) {
              if (error) throw error;
              console.log("evtresults" + results);
            }
          );
        }
      });
    } else if (mech == "motor") {
      var motor_name = mech_datas[mech + "_name_" + (index + 1)];
      var motor_type =
        motor_name.split("_")[1] == null
          ? motor_name.split(" ")[1]
          : motor_name.split("_")[1];
      var motorInsertParams = {
        motor_id: mech + "_" + (index + 1),
        sid: index_sid,
        uid: uid,
        motor_type: motor_type,
        motor_action: 0,
        motor_name: motor_name,
      };
      var motorInsertQuery = mybatisMapper.getStatement(
        "mysql",
        "motorInsertParameters",
        motorInsertParams,
        format
      );
      connection.query(motorInsertQuery, function test(error, results, fields) {
        if (error) {
          var motorUpdateParams = {
            motor_id: mech + "_" + (index + 1),
            sid: index_sid,
            uid: uid,
            motor_type: motor_type,
            motor_name: motor_name,
          };
          var motorUpdateQuery = mybatisMapper.getStatement(
            "mysql",
            "motorUpdateParameters",
            motorUpdateParams,
            format
          );
          connection.query(
            motorUpdateQuery,
            function test(error, results, fields) {
              if (error) throw error;
              console.log("evtresults" + results);
            }
          );
        }
        console.log("mechmotor" + results);
      });
    } else if (mech == "valve") {
      var valve_name =
        mech_datas[mech + "_name_" + (index + 1)] == undefined
          ? ""
          : mech_datas[mech + "_name_" + (index + 1)];
      var valveInsertParams = {
        valve_id: mech + "_" + (index + 1),
        sid: index_sid,
        uid: uid,
        valve_action: 0,
        valve_name: valve_name,
      };
      var valveInsertQuery = mybatisMapper.getStatement(
        "mysql",
        "valveInsertParameters",
        valveInsertParams,
        format
      );

      connection.query(valveInsertQuery, function test(error, results, fields) {
        if (error) {
          var valveUpdateParams = {
            valve_id: mech + "_" + (index + 1),
            sid: index_sid,
            uid: uid,
            valve_name: valve_name,
          };
          var valveUpdateQuery = mybatisMapper.getStatement(
            "mysql",
            "valveUpdateParameters",
            valveUpdateParams,
            format
          );
          connection.query(
            valveUpdateQuery,
            function test(error, results, fields) {
              if (error) throw error;
              console.log("evtresults" + results);
            }
          );
        }
      });
    } else if (mech == "cctv") {
      var cctv_name = mech_datas[mech + "_name_" + (index + 1)];
      var cctv_type =
        cctv_name.split("_")[1] == null
          ? cctv_name.split(" ")[1]
          : cctv_name.split("_")[1];

      var cctvInsertParams = {
        cctv_id: mech + "_" + (index + 1),
        sid: index_sid,
        uid: uid,
        cctv_type: cctv_type,
        cctv_name: valve_name,
        cctv_url: "url",
      };
      var cctvInsertQuery = mybatisMapper.getStatement(
        "mysql",
        "cctvInsertParameters",
        cctvInsertParams,
        format
      );
      connection.query(cctvInsertQuery, function test(error, results, fields) {
        if (error) {
          var cctvUpdateParams = {
            valve_id: mech + "_" + (index + 1),
            sid: index_sid,
            uid: uid,
            motor_name: motor_name,
          };
          var cctvUpdateQuery = mybatisMapper.getStatement(
            "mysql",
            "cctvUpdateParameters",
            cctvUpdateParams,
            format
          );
          connection.query(
            cctvUpdateQuery,
            function test(error, results, fields) {
              if (error) throw error;
              console.log("evtresults" + results);
            }
          );
        }
        console.log("mechcctv" + results);
      });
    } else if (mech == "actuator") {
      var actuator_name = mech_datas[mech + "_name_" + (index + 1)];
      var actuator_type =
        actuator_name.split("_")[1] == null
          ? actuator_name.split(" ")[1]
          : actuator_name.split("_")[1];

      var actuatorInsertParams = {
        actuator_id: mech + "_" + (index + 1),
        sid: index_sid,
        uid: uid,
        actuator_type: actuator_type,
        actuator_action: 0,
        actuator_name: actuator_name,
      };
      var actuatorInsertQuery = mybatisMapper.getStatement(
        "mysql",
        "actuatorInsertParameters",
        actuatorInsertParams,
        format
      );
      connection.query(
        actuatorInsertQuery,
        function test(error, results, fields) {
          if (error) {
            var actuatorUpdateParams = {
              actuator_id: mech + "_" + (index + 1),
              sid: index_sid,
              uid: uid,
              actuator_type: actuator_type,
              actuator_name: actuator_name,
            };
            var actuatorUpdateQuery = mybatisMapper.getStatement(
              "mysql",
              "actuatorUpdateParameters",
              actuatorUpdateParams,
              format
            );
            connection.query(
              actuatorUpdateQuery,
              function test(error, results, fields) {
                if (error) throw error;
                console.log("evtresults" + results);
              }
            );
          }
          console.log("mechactuator" + results);
        }
      );
    }
  }
};
module.exports = mechInsert;
