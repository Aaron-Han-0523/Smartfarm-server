var mqttFunction = function (uids) {
  const schedule = require("node-schedule");
  let sequelize = require("./models/index").sequelize;
  // const fileStore = require("session-file-store")(session);
  // let app = express();
  sequelize.sync();
  var mqtt = require("mqtt");
  var mysql = require("mysql");

  let uid = uids;
  var sidList = [];
  let site_id = "";

  let fcmtoken = "";
  let alarm_en = "";
  let alarm_high_temp = "";
  let alarm_low_temp = "";

  let watering_timer = "";

  var trend_update = false;
  let evt_update = false;

  let sites_run = false;

  // 푸시알림 fcm admin 서버키 가져오기
  var admin = require("firebase-admin");
  var serviceAccount = require("./config/smartfarm-f4f8a-firebase-adminsdk-dcwir-9352731a71.json");
  const isEmpty = require("is-empty");

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    admin.app(); // 이미 초기화되었다면, 초기화 된 것을 사용함
  }
  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  // });

  //sql(aws)
  // var connection = mysql.createConnection({
  //   host: "13.209.88.255",
  //   user: "edgeworks",
  //   password: "jsoftware1!",
  //   database: "smartfarm",
  //   multipleStatements: true,
  // });

  //sql(edgeworks)
  // var connection = mysql.createConnection({
  //   host: "14.46.231.48",
  //   user: "edgeworks",
  //   password: "jsoftware1!",
  //   database: "smartfarm",
  //   multipleStatements: true,
  // });

  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "smartfarm",
    multipleStatements: true,
  });

  // run
  sqlQuery();

  // sql로 저장된 token값 가져와서 푸시 알림 보내기

  function sqlQuery() {
    console.log("sqlQQQQ");
    connection.query(
      "select fcmtoken from users where uid=?",
      uid,
      function test(error, results, fields) {
        if (error) throw error;
        fcmtoken = results[0].fcmtoken;
        console.log("The fcmtoken is: ", fcmtoken);

        if (!isEmpty(fcmtoken)) {
          pushAlarm("fcm test", "fcm test");
        }
      }
    );

    // db에 저장된 알림값 가져오기
    connection.query(
      "select sid, site_set_alarm_enable, site_set_alarm_high, site_set_alarm_low, site_set_alarm_timer from sites where uid=?",
      uid,
      function test(error, results, fields) {
        if (error) throw error;
        if (!isEmpty(results)) {
          console.log("이거냐");
          alarm_en = results[0].site_set_alarm_enable;
          alarm_high_temp = results[0].site_set_alarm_high;
          alarm_low_temp = results[0].site_set_alarm_low;
          watering_timer = results[0].site_set_alarm_timer;
          // site_id = "e000000" + (results.length + 1);
          for (let i = 0; i < results.length; i++) {
            sidList.push(results[i].sid);
          }
          sidList.push("e000000" + (results.length + 1));

          console.log("//////////////////////////");
          console.log("The alarm_en is: ", alarm_en);
          console.log("The alarm_high_temp is: ", alarm_high_temp);
          console.log("The alarm_low_temp is: ", alarm_low_temp);
          console.log("The watering_timer is: ", watering_timer);
          console.log("The site_id is: ", site_id);
          console.log("//////////////////////////");

          mqttData();
          // _evtCode();
        } else {
          console.log("여기냐");
          sidList.push("e0000001");
          site_id = "e0000001";
          mqttData();
          // _evtCode();
        }

        console.log("inner data" + sidList.length);
      }
    );

    connection.query(
      "select * from events where uid=?",
      uid,
      function test(error, results, fields) {
        console.log("results datas: " + results)
        if (!isEmpty(results)) {
          evt_update = true;
          // alarm_code = results[0].alarm_code;
          console.log("The alarm_code is: ", results);
        }
      }
    );
  }

  //// mqtt
  //https://yonghyunlee.gitlab.io/node/node-mqtt/
  // mysql connect
  //https://gist.github.com/smching/ff414e868e80a6ee2fbc8261f8aebb8f

  const options = {
    host: "127.0.0.1",
    port: 1883,
  };

  const client = mqtt.connect("mqtt://broker.mqttdashboard.com:1883", options);

  //데이터 업데이트
  function mqttData() {
    console.log("hidata" + sidList);
    console.log("hidata" + uid);
    //센서 데이터
    for (let i = 0; i < sidList.length; i++) {
      const index_sid = sidList[i];
      console.log("도냐" + i);
      console.log("hidatahi" + index_sid);
      client.subscribe("/sf/" + index_sid + "/data");
      client.on("connect", function () {
        console.log("connected  " + client.connected);
      });
      client.on("message", function (topic, message, packet) {
        console.log("trend_update" + trend_update);
        console.log("message is " + message);
        console.log("topic is " + topic);
        console.log("trend_index_sid" + index_sid);
        var ss_topic = topic.split("/")[2];
        console.log("ss_topic" + ss_topic);
        var ss_datas = JSON.parse(message.toString());
        console.log("trend_index_datas " + i + " " + ss_datas);
        schedule.scheduleJob("0 0,10,20,30,40,50 * * * *", function () {
          trend_update = true;
          console.log("바뀌냐1" + trend_update);
        });
        if (trend_update == true) {
          console.log("바뀌냐2" + trend_update);
          sqlUpdate(ss_datas, ss_topic);
          trend_update = false;
          console.log("trend_update" + trend_update);
          console.log("sql");
        }
        console.log("end!!!!!!!!!");
      });

      //이벤트 데이터
      client.subscribe("/sf/" + index_sid + "/evt");
      client.on("connect", function () {
        console.log("connected  " + client.connected);
      });
      client.on("message", function (topic, message, packet) {
        console.log("evt_update " + evt_update);
        console.log("message is " + message);
        console.log("topic is " + topic);
        var evt_topic = topic.split("/")[2];
        console.log("evt_topic" + evt_topic);
        var evtDatas = JSON.parse(message.toString());
        console.log("evdatas" + evtDatas);

        if (evtDatas["ec"] != undefined) {
          evtInsert(evtDatas, evt_topic);
          evt_update = true;
        }
      });

      // 장치 데이터
      client.subscribe("/sf/" + index_sid + "/res/cfg");
      client.on("connect", function () {
        console.log("connected  " + client.connected);
      });
      const pubTopic = "/sf/" + index_sid + "/req/cfg";
      client.publish(pubTopic, '{"rt" : "get"}');
      client.on("message", function (topic, message, packet) {
        // console.log("evt_update " + sites_update);
        console.log("message is " + message);
        console.log("topic is " + topic);

        var cfg_topic = topic.split("/")[2];
        console.log("cfg_topic" + cfg_topic);
        var sitesDatas = JSON.parse(message.toString());

        if (
          sitesDatas["sname"] != undefined
        ) {
          sitesInsert(sitesDatas, cfg_topic);
        }

        if (sitesDatas["sname"] != undefined) {
          mechInsert(sitesDatas, "temp", cfg_topic);
          mechInsert(sitesDatas, "humid", cfg_topic);
          mechInsert(sitesDatas, "exttemp", cfg_topic);
          mechInsert(sitesDatas, "soiltemp", cfg_topic);
          mechInsert(sitesDatas, "soilhumid", cfg_topic);
          mechInsert(sitesDatas, "motor", cfg_topic);
          mechInsert(sitesDatas, "pump", cfg_topic);
          mechInsert(sitesDatas, "valve", cfg_topic);
          // mechInsert(sitesDatas, "cctv", cfg_topic);
          // mechInsert(sitesDatas, "actuator", cfg_topic);
        }
      });
    }

    console.log("end!!!!!!!!!");
  }

  // trends table에 데이터 보내기
  function sqlUpdate(ssdatas, index_sid) {
    var keys = Object.keys(ssdatas);
    console.log("Connected!");
    for (let i = 2; i < keys.length; i++) {
      let sensor_id = keys[i].toString();
      let time_stamp = ssdatas["t"].toString();
      let value = ssdatas[keys[i]].toString();
      connection.query("insert ignore into trends values (?,?,?,?,?,?);", [
        ,
        sensor_id,
        index_sid,
        uid,
        time_stamp,
        value,
      ]);
    }
    // console.log(results);
  }

  //events table에 insert
  function evtInsert(evtDatas, index_sid) {
    // var keys = Object.keys(evt_update);
    console.log("evtsite_id" + index_sid);

    let time_stamp = evtDatas["t"];
    let event_saverity = evtDatas["ev"];
    let alarm_code = evtDatas["ec"];

    connection.query(
      "insert ignore into events values (?,?,?,'?',?);",
      [index_sid, uid, time_stamp, event_saverity, alarm_code],
      function test(error, results, fields) {
        if (error) {
          connection.query(
            "update events set time_stamp= ?, event_saverity= '?', alarm_code= ? where sid = ? and uid = ? ;",
            [time_stamp, event_saverity, alarm_code, index_sid, uid],
            function test(error, results, fields) {
              if (error) throw error;
              console.log("evtresults" + results);
            }
          );
        }
      }
    );

    connection.query(
      "insert ignore into events values (?,?,?,?,'?',?);",
      [, index_sid, uid, time_stamp, event_saverity, alarm_code],
      function test(error, results, fields) {
        if (error) {
          connection.query(
            "update events set time_stamp= ?, event_saverity= '?', alarm_code= ? where sid = ? and uid = ? ;",
            [time_stamp, event_saverity, alarm_code, index_sid, uid],
            function test(error, results, fields) {
              if (error) throw error;
              console.log("evtresults" + results);
            }
          );
        }
      }
    );
  }

  //sites table에 insert
  function sitesInsert(sitesDatas, index_sid) {
    // var keys = Object.keys(evt_update);
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
    connection.query(
      "insert ignore into sites values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
      [
        index_sid,
        uid,
        site_name,
        site_address,
        site_gps_latitude,
        site_gps_longitude,
        site_th_sensor_count,
        site_soil_sensor_count,
        site_side_motor_count,
        site_top_motor_count,
        site_actuator_count,
        site_pump_count,
        site_valve_count,
        site_cctv_count,
        site_set_alarm_enable,
        site_set_alarm_high,
        site_set_alarm_low,
        site_set_alarm_timer,
      ],
      function test(error, results, fields) {
        if (error) {
          connection.query(
            "update sites set site_name=?, site_address=?, site_gps_latitude=?, site_gps_longitude=?, site_th_sensor_count=?, site_soil_sensor_count=?, site_side_motor_count=?, site_top_motor_count=?, site_actuator_count=?, site_pump_count=?,  site_valve_count=?, site_cctv_count=?, site_set_alarm_enable=?, site_set_alarm_high=?, site_set_alarm_low=?, site_set_alarm_timer=? where sid = ? and uid = ? ;",
            [
              site_name,
              site_address,
              site_gps_latitude,
              site_gps_longitude,
              site_th_sensor_count,
              site_soil_sensor_count,
              site_side_motor_count,
              site_top_motor_count,
              site_actuator_count,
              site_pump_count,
              site_valve_count,
              site_cctv_count,
              site_set_alarm_enable,
              site_set_alarm_high,
              site_set_alarm_low,
              site_set_alarm_timer,
              index_sid,
              uid,
            ],
            function test(error, results, fields) {
              if (error) throw error;
              console.log("evtresults" + results);
            }
          );
        }
      }
    );
  }

  //각 장치 table에 insert/update
  function mechInsert(mech_datas, mech, index_sid) {
    // var keys = Object.keys(evt_update);
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
        connection.query(
          "insert into sensors values (?,?,?,'?',?);",
          [mech + "_" + (index + 1), index_sid, uid, 0, sensor_name],
          function test(error, results, fields) {
            if (results == undefined) {
              connection.query(
                "update sensors set sensor_name= ? where sensor_id=? and sid = ? and uid = ? ;",
                [sensor_name, mech + "_" + (index + 1), index_sid, uid],
                function test(error, results, fields) {
                  if (error) throw error;
                  console.log("evtresults" + results);
                }
              );
            }
          }
        );
      } else if (mech == "pump") {
        var pump_name = mech_datas[mech + "_name_" + (index + 1)];
        connection.query(
          "insert into pumps values (?,?,?,'?',?);",
          [mech + "_" + (index + 1), index_sid, uid, 0, pump_name],
          function test(error, results, fields) {
            if (results == undefined) {
              connection.query(
                "update pumps set pump_name= ? where pump_id=? and sid = ? and uid = ? ;",
                [pump_name, mech + "_" + (index + 1), index_sid, uid],
                function test(error, results, fields) {
                  if (error) throw error;
                  console.log("evtresults" + results);
                }
              );
            }
          }
        );
      } else if (mech == "motor") {
        var motor_name = mech_datas[mech + "_name_" + (index + 1)];
        var motor_type =
          motor_name.split("_")[1] == null
            ? motor_name.split(" ")[1]
            : motor_name.split("_")[1];
        connection.query(
          "insert into motors values (?,?,?,?,'?',?);",
          [mech + "_" + (index + 1), index_sid, uid, motor_type, 0, motor_name],
          function test(error, results, fields) {
            if (results == undefined) {
              connection.query(
                "update motors set motor_type= ?, motor_name= ? where motor_id=? and sid = ? and uid = ? ;",
                [
                  motor_type,
                  motor_name,
                  mech + "_" + (index + 1),
                  index_sid,
                  uid,
                ],
                function test(error, results, fields) {
                  if (error) throw error;
                  console.log("evtresults" + results);
                }
              );
            }
            console.log("mechmotor" + results);
          }
        );
      } else if (mech == "valve") {
        var valve_name = mech_datas[mech + "_name_" + (index + 1)];
        connection.query(
          "insert into valves values (?,?,?,'?',?);",
          [mech + "_" + (index + 1), index_sid, uid, 0, ,],
          function test(error, results, fields) {
            if (results == undefined) {
              connection.query(
                "update valves set valve_name= ? where valve_id=? and sid = ? and uid = ? ;",
                [valve_name, mech + "_" + (index + 1), index_sid, uid],
                function test(error, results, fields) {
                  if (error) throw error;
                  console.log("evtresults" + results);
                }
              );
            }
          }
        );
      }else if (mech == "cctv") {
        var cctv_name = mech_datas[mech + "_name_" + (index + 1)];
        var cctv_type =
          cctv_name.split("_")[1] == null
            ? cctv_name.split(" ")[1]
            : cctv_name.split("_")[1];
        connection.query(
          "insert into cctvs values (?,?,?,?,?,?);",
          [mech + "_" + (index + 1), index_sid, uid, cctv_type, cctv_name,'url'],
          function test(error, results, fields) {
            if (results == undefined) {
              connection.query(
                "update cctvs set cctv_type= ?, cctv_name= ? where cctv_id=? and sid = ? and uid = ? ;",
                [
                  cctv_type,
                  cctv_name,
                  mech + "_" + (index + 1),
                  index_sid,
                  uid,
                ],
                function test(error, results, fields) {
                  if (error) throw error;
                  console.log("evtresults" + results);
                }
              );
            }
            // if (error) {
            //   console.log('hi');
            // };
            console.log("mechcctv" + results);
          }
        );
      }else if (mech == "actuator") {
        var actuator_name = mech_datas[mech + "_name_" + (index + 1)];
        var actuator_type =
          actuator_name.split("_")[1] == null
            ? actuator_name.split(" ")[1]
            : actuator_name.split("_")[1];
        connection.query(
          "insert into actuators values (?,?,?,?,'?',?);",
          [mech + "_" + (index + 1), index_sid, uid, actuator_type, 0, actuator_name],
          function test(error, results, fields) {
            if (results == undefined) {
              connection.query(
                "update actuators set actuator_type= ?, actuator_name= ? where actuator_id=? and sid = ? and uid = ? ;",
                [
                  actuator_type,
                  actuator_name,
                  mech + "_" + (index + 1),
                  index_sid,
                  uid,
                ],
                function test(error, results, fields) {
                  if (error) throw error;
                  console.log("evtresults" + results);
                }
              );
            }
            // if (error) {
            //   console.log('hi');
            // };
            console.log("mechactuator" + results);
          }
        );
      } 
    } 

  }

  // 이벤트 코드 받는 로직
  function _evtCode() {
    for (let i = 0; i < sidList.length; i++) {
      const index_sid = sidList[i];
      client.subscribe("/sf/" + index_sid + "/evt");
      client.on("connect", function () {
        console.log("connected  " + client.connected);
      });
      client.on("message", function (topic, message, packet) {
        // console.log(bool);
        console.log("message is " + message);
        // console.log("topic is " + topic);

        var evt_datas = JSON.parse(message.toString());
        // console.log("topic is " + datas["s"]);

        var sendPush = evt_datas["ec"];

        // 혹시 몰라 경우의 수 정해놓음
        if (sendPush == "AT01") {
          console.log("[푸시알림] Temperature High 경보");
          pushAlarm(
            "[푸시알림] Temperature 경보",
            "현재 내부온도가 설정된 최고 온도보다 높습니다."
          );
        } else if (sendPush == "AT02") {
          console.log("[푸시알림] Temperature Low 경보");
          pushAlarm(
            "[푸시알림] Temperature 경보",
            "현재 내부온도가 설정된 최저 온도보다 낮습니다."
          );
        } else if (sendPush == "AR01") {
          console.log("[푸시알림] Rain 경보 감지됨");
          pushAlarm(
            "[푸시알림] Rain 경보",
            "감우가 감지되었습니다! 주의) 이 알림은 조금이라도 비가 내리면 알림이 갑니다."
          );
        } else if (sendPush == "AW00") {
          console.log("[푸시알림] WaterPump 경보, 상태 Off");
        } else if (sendPush == "AW01") {
          console.log("[푸시알림] WaterPump 경보, 상태 On");
          pushAlarm(
            "[푸시알림] WaterPump 경보",
            "관수 펌프의 상태가 On입니다."
          );
        } else {
          console.log("[푸시알림] 이벤트가 아닙니다.");
        }
      });
    }
  }

  // 푸시알림 보내기
  async function pushAlarm(title, body) {
    //디바이스의 토큰 값
    let deviceToken = fcmtoken;
    let message = {
      notification: {
        title: title,
        body: body,
      },
      token: deviceToken,
    };

    admin
      .messaging()
      .send(message)
      .then(function (response) {
        console.log("Successfully sent message: : ", response);
      })
      .catch(function (err) {
        console.log("Error Sending message!!! : ", err);
      });
  }
  console.log("true");
};
module.exports = mqttFunction;
