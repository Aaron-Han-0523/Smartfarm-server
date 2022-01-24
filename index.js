const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const static = require("serve-static");
const router = require("./routes/user"); //라우터 모듈 등록 (라우터 모듈안에 다이어리 스키마 모듈을 불러오고 있으므로 아래와 같이 라우터만!
const farmRouter = require("./routes/farm");
const punchListRouter = require("./routes/punchList");
const summuryRouter = require("./routes/summury");
const schedule = require("node-schedule");
let sequelize = require("./models/index").sequelize;
const fileStore = require("session-file-store")(session);
let app = express();
sequelize.sync();
var mqtt = require("mqtt");
var mysql = require("mysql");

//// REST api
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: "testSecret",
    resave: false,
    saveUninitialized: false,
    store: new fileStore(),
    cookie: {
      //세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
      httpOnly: false,
      Secure: true,
    },
  })
);

// run
// mqttData();

// setInterval(() => {
//   mqttData();
// }, 600000);

app
  // .use(express.static(path.join(__dirname, 'upload')))
  .use(static(path.join(__dirname, "upload")))
  .use("/api/", router)
  .use("/farm/", farmRouter)
  .use("/punchlist/", punchListRouter)
  .use("/summury/", summuryRouter)
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// fcm 푸시알림을 위한 초기화
let uid = "test";
let sid = "sid";
var bool = false;

let fcmtoken = "";
let alarm_en = "";
let alarm_high_temp = "";
let alarm_low_temp = "";

let temp_1 = "";
let pump_1 = "";
let pump_2 = "";
let valve_1 = "";
let valve_2 = "";
let motor_1 = "";
let motor_2 = "";
let motor_3 = "";
let motor_4 = "";
let motor_5 = "";
let motor_6 = "";

let watering_timer = "";

let evt_update = false;
let sites_update = false;

// 푸시알림 fcm admin 서버키 가져오기
var admin = require("firebase-admin");
var serviceAccount = require("./config/smartfarm-f4f8a-firebase-adminsdk-dcwir-9352731a71.json");
const isEmpty = require("is-empty");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//sql(aws)
var connection = mysql.createConnection({
  host: "13.209.88.255",
  user: "edgeworks",
  password: "jsoftware1!",
  database: "smartfarm",
  multipleStatements: true,
});

// //sql(edgeworks)
// var connection = mysql.createConnection({
//   host: "14.46.231.48",
//   user: "edgeworks",
//   password: "jsoftware1!",
//   database: "smartfarm",
//   multipleStatements: true,
// });

// var connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "smartfarm",
//   multipleStatements: true,
// });

// sql로 저장된 token값 가져와서 푸시 알림 보내기
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
  "select site_set_alarm_enable, site_set_alarm_high, site_set_alarm_low, site_set_alarm_timer from sites where uid=?",
  uid,
  function test(error, results, fields) {
    if (error) throw error;
    if (!isEmpty(results)) {
      alarm_en = results[0].site_set_alarm_enable;
      alarm_high_temp = results[0].site_set_alarm_high;
      alarm_low_temp = results[0].site_set_alarm_low;
      watering_timer = results[0].site_set_alarm_timer;

      console.log("//////////////////////////");
      console.log("The alarm_en is: ", alarm_en);
      console.log("The alarm_high_temp is: ", alarm_high_temp);
      console.log("The alarm_low_temp is: ", alarm_low_temp);
      console.log("The watering_timer is: ", watering_timer);
      console.log("//////////////////////////");
    }
  }
);

connection.query(
  "select * from events where uid=?",
  uid,
  function test(error, results, fields) {
    console.log("results datas: " + results);
    // if (error) throw error;

    if (!isEmpty(results)) {
      evt_update = true;
      // alarm_code = results[0].alarm_code;
      console.log("The alarm_code is: ", results);
    }
  }
);

connection.query(
  "select * from sites where uid=?",
  uid,
  function test(error, results, fields) {
    console.log("results datas: " + results);
    // if (error) throw error;

    if (!isEmpty(results)) {
      sites_update = true;
      // alarm_code = results[0].alarm_code;
      console.log("The alarm_code is: ", results);
    }
  }
);

//// mqtt
//https://yonghyunlee.gitlab.io/node/node-mqtt/
// mysql connect
//https://gist.github.com/smching/ff414e868e80a6ee2fbc8261f8aebb8f

const options = {
  host: "127.0.0.1",
  port: 1883,
};

const client = mqtt.connect("mqtt://broker.mqttdashboard.com:1883", options);

// run
mqttData();
// _evtCode();
// mqttAlarmData();

// setInterval(() => {
//   mqttData();
// }, 600000);

function mqttData() {
  client.subscribe("/sf/e0000001/data");
  client.on("connect", function () {
    console.log("connected  " + client.connected);
  });
  client.on("message", function (topic, message, packet) {
    console.log(bool);
    console.log("message is " + message);
    console.log("topic is " + topic);

    var datas = JSON.parse(message.toString());
    temp_1 = datas["temp_1"];
    pump_1 = datas["pump_1"];
    pump_2 = datas["pump_2"];
    // valve_1 = datas["valve_1"];
    // valve_2 = datas["valve_2"];
    motor_1 = datas["motor_1"];
    motor_2 = datas["motor_2"];
    motor_3 = datas["motor_3"];
    motor_4 = datas["motor_4"];
    motor_5 = datas["motor_5"];
    motor_6 = datas["motor_6"];

    // schedule.scheduleJob("0 0,10,20,30,40,50 * * * *", function () {
    //   bool = true;
    // });
    // if (bool == true) {
    //   sqlUpdate(datas);
    //   bool = false;
    //   console.log(bool);
    //   console.log("sql");
    // }
    // console.log("end!!!!!!!!!");
  });

  client.subscribe("/sf/e0000001/evt");
  client.on("connect", function () {
    console.log("connected  " + client.connected);
  });
  client.on("message", function (topic, message, packet) {
    console.log("evt_update " + evt_update);
    console.log("message is " + message);
    console.log("topic is " + topic);

    var evtDatas = JSON.parse(message.toString());
    console.log("evdatas" + evtDatas);
    // evt_time_stamp = evtDatas["t"];
    // event_saverity = evtDatas["ev"];
    // alarm_code = evtDatas["ec"];

    // schedule.scheduleJob("0 0,10,20,30,40,50 * * * *", function () {
    //   bool = true;
    // });
    //     let evt_time_stamp = "";
    // let event_saverity = 0;
    // let alarm_code = "";
    if (evt_update == true && evtDatas["ev"] != undefined) {
      evtUpdate(evtDatas);
    } else if (evt_update == false) {
      evtInsert(evtDatas);
      evt_update = true;
    }
  });

  client.subscribe("/sf/e0000001/res/cfg");
  client.on("connect", function () {
    console.log("connected  " + client.connected);
  });
  const pubTopic = "/sf/e0000001/req/cfg";
  client.publish(pubTopic, '{"rt" : "get"}');
  client.on("message", function (topic, message, packet) {
    console.log("evt_update " + sites_update);
    console.log("message is " + message);
    console.log("topic is " + topic);
    var sitesDatas = JSON.parse(message.toString());
    // evt_time_stamp = evtDatas["t"];
    // event_saverity = evtDatas["ev"];
    // alarm_code = evtDatas["ec"];

    // schedule.scheduleJob("0 0,10,20,30,40,50 * * * *", function () {
    //   bool = true;
    // });
    //     let evt_time_stamp = "";
    // let event_saverity = 0;
    // let alarm_code = "";
    if (sites_update == true && sitesDatas["sname"] != undefined) {
      sitesUpdate(sitesDatas);
    } else if (sites_update == false) {
      sitesInsert(sitesDatas);
      evt_update = true;
    }
    mechInsert(sitesDatas, "temp");
    mechInsert(sitesDatas, "humid");
    mechInsert(sitesDatas, "exttemp");
    mechInsert(sitesDatas, "soiltemp");
    mechInsert(sitesDatas, "soilhumid");
    mechInsert(sitesDatas, "motor");
    mechInsert(sitesDatas, "pump");
    mechInsert(sitesDatas, "valve");
    // mechInsert(sitesDatas,'temp');
  });
  console.log("end!!!!!!!!!");
}

// trends에 데이터 보내기
function sqlUpdate(datas) {
  var keys = Object.keys(datas);
  console.log("Connected!");
  for (let i = 2; i < keys.length; i++) {
    let sensor_id = keys[i].toString();
    let time_stamp = datas["t"].toString();
    let value = datas[keys[i]].toString();
    connection.query("insert ignore into trends values (?,?,?,?,?);", [
      sensor_id,
      sid,
      uid,
      time_stamp,
      value,
    ]);
  }
  // console.log(results);
}

function evtInsert(evtDatas) {
  // var keys = Object.keys(evt_update);
  console.log("Connected!");

  let time_stamp = evtDatas["t"];
  let event_saverity = evtDatas["ev"];
  let alarm_code = evtDatas["ec"];
  connection.query(
    "insert ignore into events values (?,?,?,'?',?);",
    [sid, uid, time_stamp, event_saverity, alarm_code],
    function test(error, results, fields) {
      if (error) throw error;
      console.log("evtresults" + results);
    }
  );
}

function evtUpdate(evtDatas) {
  // var keys = Object.keys(evt_update);
  console.log("Connected!");

  var time_stamp = evtDatas["t"];
  var event_saverity = evtDatas["ev"];
  var alarm_code = evtDatas["ec"];
  connection.query(
    "update events set time_stamp= ?, event_saverity= '?', alarm_code= ? where sid = ? and uid = ? ;",
    [time_stamp, event_saverity, alarm_code, sid, uid],
    function test(error, results, fields) {
      if (error) throw error;
      console.log("evtresults" + results);
    }
  );
}

function sitesInsert(sitesDatas) {
  // var keys = Object.keys(evt_update);
  console.log("Connected!");
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
  let site_actuator_count = "sitesDatas[]";
  let site_pump_count = sitesDatas["pump_cnt"];
  let site_valve_count = sitesDatas["valve_cnt"];
  let site_cctv_count = "sitesDatas[]";
  let site_set_alarm_enable = sitesDatas["alarm_en"];
  let site_set_alarm_high = sitesDatas["alarm_high_temp"];
  let site_set_alarm_low = sitesDatas["alarm_low_temp"];
  let site_set_alarm_timer = sitesDatas["watering_timer"];
  connection.query(
    "insert ignore into sites values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
    [
      sid,
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
      if (error) throw error;
      console.log("evtresults" + results);
    }
  );
}

function sitesUpdate(sitesDatas) {
  // var keys = Object.keys(evt_update);
  console.log("Connected!");

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
  let site_actuator_count = "sitesDatas[]";
  let site_pump_count = sitesDatas["pump_cnt"];
  let site_valve_count = sitesDatas["valve_cnt"];
  let site_cctv_count = "sitesDatas[]";
  let site_set_alarm_enable = sitesDatas["alarm_en"];
  let site_set_alarm_high = sitesDatas["alarm_high_temp"];
  let site_set_alarm_low = sitesDatas["alarm_low_temp"];
  let site_set_alarm_timer = sitesDatas["watering_timer"];
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
      sid,
      uid,
    ],
    function test(error, results, fields) {
      if (error) throw error;
      console.log("evtresults" + results);
    }
  );
}

function mechInsert(datas, mech) {
  // var keys = Object.keys(evt_update);
  console.log(mech + "Insert!");
  let cnt = 0
  if (mech=='temp' || mech=='humid' || mech=='exttemp' || mech=='soiltemp' || mech == 'soilhumid') {
    cnt=datas[mech + "_ss_cnt"]
  } else  {
    cnt=datas[mech + "_cnt"]}
  // }else if(mech=='motor') {
  //   table_name='motors'
  // }else if(mech=='valve') {
  //   table_name='valves'
  // }
  // let cnt = datas[mech + "_ss_cnt"];
  console.log(mech +cnt+ "Insert!");
  // let mech_name = datas[mech+"_ss_name_"+i];
  // let mech_id = datas[mech+"_"+i];
  for (let index = 0; index < cnt; index++) {
    // if (table_name=='motors') {
    //   connection.query(
    //     "insert ignore into motors values (?,?,?,'?',?,?);",
    //     [mech+"_"+index,sid,uid,,'',0,datas[mech+"_ss_name_"+(index+1)]],
    //     function test(error, results, fields) {
    //       if (error) throw error;
    //       console.log("mechInsert" + results);
    //     }
    //   );
    // } else {
    //   connection.query(
    //     "insert ignore into ? values (?,?,?,'?',?);",
    //     [table_name,mech+"_"+index,sid,uid,0,datas[mech+"_ss_name_"+(index+1)]],
    //     function test(error, results, fields) {
    //       if (error) throw error;
    //       console.log("mechInsert" + results);
    //     }
    //   );
    // }

    if (
      mech == "temp" ||
      mech == "humid" ||
      mech == "exttemp" ||
      mech == "soiltemp" ||
      mech == "soilhumid"
    ) {
      connection.query(
        "insert ignore into sensors values (?,?,?,'?',?);",
        [
          mech + "_" + (index + 1),
          sid,
          uid,
          0,
          datas[mech + "_ss_name_" + (index + 1)],
        ],
        function test(error, results, fields) {
          if (error) throw error;
          console.log("temp" + results);
        }
      );
    }
    if (mech == "pump") {
      connection.query(
        "insert ignore into pumps values (?,?,?,'?',?);",
        [
          mech + "_" + (index + 1),
          sid,
          uid,
          0,
          datas[mech + "_name_" + (index + 1)],
        ],
        function test(error, results, fields) {
          if (error) throw error;
          console.log("pump" + results);
        }
      );
    }
    if (mech == "motor") {
      connection.query(
        "insert ignore into motors values (?,?,?,'?',?,?);",
        [
          mech + "_" + (index + 1),
          sid,
          uid,
          '',
          0,
          datas[mech + "_name_" + (index + 1)],
        ],
        function test(error, results, fields) {
          if (error) throw error;
          console.log("motor" + results);
        }
      );
    }
    if (mech == "valve") {
      connection.query(
        "insert ignore into valves values (?,?,?,'?',?);",
        [
          mech + "_" + (index + 1),
          sid,
          uid,
          0,
          datas[mech + "_name_" + (index + 1)],
        ],
        function test(error, results, fields) {
          if (error) throw error;
          console.log("valve" + results);
        }
      );
    }
  }
}

function mechUpdate(datas) {
  // var keys = Object.keys(evt_update);
  console.log("Connected!");

  var time_stamp = evtDatas["t"];
  var event_saverity = evtDatas["ev"];
  var alarm_code = evtDatas["ec"];
  connection.query(
    "update events set time_stamp= ?, event_saverity= '?', alarm_code= ? where sid = ? and uid = ? ;",
    [time_stamp, event_saverity, alarm_code, sid, uid],
    function test(error, results, fields) {
      if (error) throw error;
      console.log("evtresults" + results);
    }
  );
}

// 이벤트 코드 받는 로직
function _evtCode() {
  client.subscribe("/sf/e0000001/evt");
  client.on("connect", function () {
    console.log("connected  " + client.connected);
  });
  client.on("message", function (topic, message, packet) {
    // console.log(bool);
    console.log("message is " + message);
    // console.log("topic is " + topic);

    var datas = JSON.parse(message.toString());
    // console.log("topic is " + datas["s"]);

    var sendPush = datas["ec"];

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
      pushAlarm("[푸시알림] WaterPump 경보", "관수 펌프의 상태가 On입니다.");
    } else {
      console.log("[푸시알림] 이벤트가 아닙니다.");
    }
  });
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
