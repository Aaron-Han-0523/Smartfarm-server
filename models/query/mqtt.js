var mqttFunction = function (uids) {
  //자주 사용하는 라이브러리
  const schedule = require("node-schedule");
  let sequelize = require("../index").sequelize;
  const isEmpty = require("is-empty");
  sequelize.sync();

  //function 모듈
  var sqlUpdate = require("./sqlUpdate.js");
  var evtInsert = require("./evtInsert.js");
  var sitesInsert = require("./sitesInsert.js");
  var mechInsert = require("./mechInsert.js");

  //마이바티스
  const mybatisMapper = require("mybatis-mapper"); //매핑할 마이바티스
  mybatisMapper.createMapper(["./models/mybatis/sqlMapper.xml"]);

  //config
  var config = require("../../config/config.json");

  // 푸시알림 fcm admin 서버키 가져오기
  var admin = require("firebase-admin");
  var serviceAccount = require("../../config/smartfarm-f4f8a-firebase-adminsdk-dcwir-9352731a71.json");
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    admin.app(); // 이미 초기화되었다면, 초기화 된 것을 사용함
  }

  //mqtt
  var mqtt = require("mqtt");
  const options = {
    host: config.mqtt.host,
    port: config.mqtt.port,
  };
  const client = mqtt.connect(
    "mqtt://" + config.mqtt.host + ":" + config.mqtt.port,
    options
  );

  // sql
  var db_config = require("../../config/mysql_config.js");
  var connection = db_config.init();
  var format = { language: "sql", indent: "  " };

  //사용변수
  let uid = uids;
  var sidList = [];
  let site_id = "";
  let fcmtoken = "";
  var trend_update = false;
  let mechList = [
    "temp",
    "humid",
    "exttemp",
    "soiltemp",
    "soilhumid",
    "motor",
    "pump",
    "valve",
    "cctv",
    "actuator",
  ];

  // run
  sqlQuery();

  // sql로 저장된 token값 가져와서 푸시 알림 보내기
  //조회할 파라미터
  //질의문 형식

  //fcm토큰
  function sqlQuery() {
    var fcmParam = {
      uid: uid,
    };
    var fcmQuery = mybatisMapper.getStatement(
      "mysql",
      "fcmParameters",
      fcmParam,
      format
    );
    connection.query(fcmQuery, function test(error, results, fields) {
      if (error) throw error;
      fcmtoken = results[0].fcmtoken;
      console.log("The fcmtoken is: ", fcmtoken);

      if (!isEmpty(fcmtoken)) {
        pushAlarm("fcm test", "fcm test");
      }
    });

    // db에 저장된 알림값 가져오기
    var alarmParam = {
      uid: uid,
    };
    var alarmQuery = mybatisMapper.getStatement(
      "mysql",
      "alarmParameters",
      alarmParam,
      format
    );

    connection.query(alarmQuery, function test(error, results, fields) {
      if (error) throw error;
      if (!isEmpty(results)) {
        site_id = "e000000" + (results.length + 1);
        for (let i = 0; i < results.length; i++) {
          sidList.push(results[i].sid);
        }
        sidList.push("e000000" + (results.length + 1));

        console.log("//////////////////////////");
        console.log("The site_id is: ", site_id);
        console.log("//////////////////////////");

        mqttData();
        // _evtCode();
      } else {
        sidList.push("e0000001");
        site_id = "e0000001";
        mqttData();
        // _evtCode();
      }
    });

    var evtParam = {
      uid: uid,
    };
    var evtQuery = mybatisMapper.getStatement(
      "mysql",
      "evtParameters",
      evtParam,
      format
    );

    connection.query(evtQuery, function test(error, results, fields) {
      console.log("results datas: " + results);
      if (!isEmpty(results)) {
        evt_update = true;
        // alarm_code = results[0].alarm_code;
        console.log("The alarm_code is: ", results);
      }
    });
  }

  //// mqtt
  //https://yonghyunlee.gitlab.io/node/node-mqtt/
  // mysql connect
  //https://gist.github.com/smching/ff414e868e80a6ee2fbc8261f8aebb8f

  //데이터 업데이트
  function mqttData() {
    //센서 데이터
    for (let i = 0; i < sidList.length; i++) {
      const index_sid = sidList[i];
      client.subscribe("/sf/" + index_sid + "/data");
      client.on("connect", function () {
        console.log("connected  " + client.connected);
      });
      client.on("message", function (topic, message, packet) {
        console.log("message is " + message);
        console.log("topic is " + topic);

        var ss_topic = topic.split("/")[2];
        var ss_datas = JSON.parse(message.toString());

        schedule.scheduleJob("0 0,10,20,30,40,50 * * * *", function () {
          trend_update = true;
        });

        if (trend_update == true) {
          sqlUpdate(ss_datas, ss_topic, uid,connection);
          trend_update = false;
        }
      });

      //이벤트 데이터
      client.subscribe("/sf/" + index_sid + "/evt");
      client.on("connect", function () {
        console.log("connected  " + client.connected);
      });
      client.on("message", function (topic, message, packet) {
        console.log("message is " + message);
        console.log("topic is " + topic);
        var evt_topic = topic.split("/")[2];
        console.log("evt_topic" + evt_topic);
        var evtDatas = JSON.parse(message.toString());
        console.log("evdatas" + evtDatas);
        if (evtDatas["ec"] != undefined) {
          evtInsert(evtDatas, evt_topic, uid,connection);
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

        if (sitesDatas["sname"] != undefined) {
          sitesInsert(sitesDatas, cfg_topic, uid,connection);
        }

        if (sitesDatas["sname"] != undefined) {
          for (let index = 0; index < mechList.length - 2; index++) {
            mechInsert(sitesDatas, mechList[index], cfg_topic, uid,connection);
          }
        }
      });
    }

    console.log("end!!!!!!!!!");
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
        console.log("message is " + message);
        var evt_datas = JSON.parse(message.toString());
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
