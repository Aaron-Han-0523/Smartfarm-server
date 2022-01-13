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

<<<<<<< HEAD
// run
// mqttData();

// setInterval(() => {
//   mqttData();
// }, 600000);

=======
>>>>>>> 770a46846050825b34a02d4b251434a1f5b7ed01
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
let uid = 'test';
let sid = 'sid';
let fcmtoken = '';
let alarm_en = '';
let alarm_high_temp = '';
let alarm_low_temp = '';
let temp_1 = '';
let pump_1 = '';
let pump_2 = '';
let pumps = [pump_1, pump_2];
let valve_1 = '';
let valve_2 = '';
let motor_1 = '';
let motor_2 = '';
let motor_3 = '';
let motor_4 = '';
let motor_5 = '';
let motor_6 = '';
let watering_timer = '';

// 푸시알림 fcm admin 서버키 가져오기
var admin = require("firebase-admin");
var serviceAccount = require("./config/smartfarm-f4f8a-firebase-adminsdk-dcwir-9352731a71.json");
const isEmpty = require("is-empty");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// sql
var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "smartfarm",
  multipleStatements: true,
});

// sql로 저장된 token값 가져와서 푸시 알림 보내기
connection.query('select fcmtoken from users where uid=?',
  uid,
  function test(error, results, fields) {
    if (error) throw error;
    fcmtoken = results[0].fcmtoken;
    console.log('The fcmtoken is: ', fcmtoken);

    if (!isEmpty(fcmtoken)) {
      pushAlarm('fcm test', 'fcm test');
    }
  });

// db에 저장된 알림값 가져오기
connection.query('select site_set_alarm_enable, site_set_alarm_high, site_set_alarm_low, site_set_alarm_timer from sites where uid=?',
  uid,
  function test(error, results, fields) {
    if (error) throw error;
    alarm_en = results[0].site_set_alarm_enable;
    alarm_high_temp = results[0].site_set_alarm_high;
    alarm_low_temp = results[0].site_set_alarm_low;
    watering_timer = results[0].site_set_alarm_timer;

    console.log('//////////////////////////');
    console.log('The alarm_en is: ', alarm_en);
    console.log('The alarm_high_temp is: ', alarm_high_temp);
    console.log('The alarm_low_temp is: ', alarm_low_temp);
    console.log('The watering_timer is: ', watering_timer);
    console.log('//////////////////////////');
  });


//// mqtt
//https://yonghyunlee.gitlab.io/node/node-mqtt/
// mysql connect
//https://gist.github.com/smching/ff414e868e80a6ee2fbc8261f8aebb8f

const options = {
  host: "127.0.0.1",
  port: 1883,
};
var bool = false;
const client = mqtt.connect("mqtt://broker.mqttdashboard.com:1883", options);

// run
mqttData();
mqttAlarmData();

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

    schedule.scheduleJob("0 0,10,20,30,40,50 * * * *", function () {
      bool = true;
    });
    if (bool == true) {
      sqlUpdate(datas);
      bool = false;
      console.log(bool);
      console.log("sql");
    }
    console.log("end!!!!!!!!!");

    /////////////////////////////////////////////////////////////////////////// fcm 시작
    // 내부온도 경보
    // if (alarm_low_temp < temp_1 && temp_1 < alarm_high_temp && alarm_en == true) {
    //   console.log("[푸시알림] 내부온도가 설정한 고저온도에 between 하니, 푸시알림 보내지 않아도 된당")
    // } else if (alarm_low_temp > temp_1 && alarm_en == true) {
    //   pushAlarm('내부온도 경보 알림', '[푸시알림] ##### 저온');
    //   console.log("[푸시알림] 내부온도가 저온 설정보다 이하니까, 푸시알림 보내야한다")
    // } else if (alarm_high_temp < temp_1 && alarm_en == true) {
    //   pushAlarm('내부온도 경보 알림', '[푸시알림] ***** 고온');
    //   console.log("[푸시알림] 내부온도가 고온 설정보다 높으니까, 푸시알림 보내야한다")
    // } else {
    //   console.log("[푸시알림] 설정하지 않았으니까 또는 다른 조건에 맞지 않으니까, 푸시알림 보내지 않아도 된당")
    // }

    // 관수 on/off
    // TODO: 조건문 on/off 외에 예외 조건 처리 추가할 것
    console.log(pumps);
    if (pumps[0] != pump_1) {
      pushAlarm('관수 On/Off 알림', '[푸시알림] 펌프 (#1)의 상태가' + pumps[0] + '에서' + pump_1 + '로 바뀌었습니다.');
      pumps[0] = pump_1;
      console.log('[푸시알림] 펌프 (#1)의 상태가' + pumps[0] + '에서' + pump_1 + '로 바뀌었습니다.');
    } else if (pumps[1] != pump_2) {
      pushAlarm('관수 On/Off 알림', '[푸시알림] 펌프 (#2)의 상태가' + pumps[1] + '에서' + pump_2 + '로 바뀌었습니다.');
      pumps[1] = pump_2;
      console.log('[푸시알림] 펌프 (#2)의 상태가' + pumps[1] + '에서' + pump_2 + '로 바뀌었습니다.');
    } else {
      console.log('[푸시알림] 펌프 변동이 없습니다.');
    }

    // 감우 경보 
    /*
    if (감우 데이터 정보가 감지되었다면) {
      pushAlarm('감우 경보 알림', '[푸시알림] 감우가 감지되었습니다! 주의) 이 알림은 조금이라도 비가 내리면 알림이 갑니다.');
      console.log('[푸시알림] 감우가 감지되었습니다! 주의) 이 알림은 조금이라도 비가 내리면 알림이 갑니다.');
    } else {
      console.log('[푸시알림] 감우 관련 변동이 없습니다.');
    }
    */

    /////////////////////////////////////////////////////////////////////////// fcm 끝
  });
}

function mqttAlarmData() {
  client.subscribe("/sf/e0000001/res/cfg");
  client.on("connect", function () {
    console.log("connected  " + client.connected);
  });
  client.on("message", function (topic, message, packet) {
    console.log(bool);
    console.log("message is " + message);
    console.log("topic is " + topic);

    /* 
    시뮬레이터에서 set config를 누르면 setting 값이 전송되나 콘솔에 변경된 데이터가 찍히지는 않는다. 

    ## set config 클릭 시 예: message is {
      "rs": 3001,
      "t": "2022-01-12T06:07:44Z",
      "rt": "set",
      "rc": 0
    }

    get config을 누르면 여기서 setting 값을 확인할 수 있다. 다만 여기서 사이트에 있는 모든 값을 확인할 수 있다.

    ## get config 클릭 시 예: message is {
        "rs": 2001,
        "t": "2022-01-12T06:07:53Z",
        "rt": "get",
        "rc": 0,
        "sname": "grape-house",
        "temp_ss_cnt": 1,
        "humid_ss_cnt": 1,
        "exttemp_ss_cnt": 1,
        "soiltemp_ss_cnt": 2,
        "soilhumid_ss_cnt": 2,
        "motor_ss_cnt": 2,
        "pump_ss_cnt": 2,
        "temp_ss_name_1": "temp",
        "humid_ss_name_1": "humid",
        "exttemp_ss_name_1": "ext temp",
        "soiltemp_ss_name_1": "soil temp left",
        "soiltemp_ss_name_2": "soil temp right",
        "soilhumid_ss_name_1": "soil humid left",
        "soilhumid_ss_name_2": "soil humid right",
        "pump_name_1": "pump grape",
        "pump_name_2": "pump 
        berry ","
        motor_name_1 ":"
        motor side left 1 ","
        motor_name_2 ":"
        motor side left 2 ","
        motor_name_3 ":"
        motor side right 1 ","
        motor_name_4 ":"
        motor side right 2 ","
        motor_name_5 ":"
        motor side top 1 ","
        motor_name_6 ":"
        motor side top 2 ","
        alarm_en ":true,"
        alarm_high_temp ":"
        45 ","
        alarm_low_temp ":"
        0 ","
        watering_timer ":"
        60 ","
        gps_x ":35.6,"
        gps_y ":126.9}    


    이하 코드는 get config를 클릭했을 때 출력되는 값들이다.
    */

    // SITE CONFIG GET > GET CONFIG 클릭 시 
    var datas = JSON.parse(message.toString());
    // get config를 눌러서 알림을 저장해서 불러왔다면
    if (datas.alarm_en) {
      // 그래서 datas에 alarm_en이 있다면 sql을 업데이트하자.
      alarm_en = datas['alarm_en'];
      alarm_high_temp = datas['alarm_high_temp'];
      alarm_low_temp = datas['alarm_low_temp'];
      watering_timer = datas['watering_timer'];
      console.log("Alarm setting 1) alarm_en: " + alarm_en + " , 2) alarm_high_temp: " + alarm_high_temp + " , 3) alarm_low_temp: " + alarm_low_temp + " , 4) watering_timer: " + watering_timer);
      console.log("end!!!!!!!!!");

      // 결과적으로 get config 클릭 시 이벤트 : sql 업데이트
      sqlAlarmUpdate(datas);
    }
  });
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
<<<<<<< HEAD
=======
}

// 설정 페이지에서 수정한 값 sql 업데이트 하기 
async function sqlAlarmUpdate(datas) {
  console.log("Connected!");

  alarm_en = datas["alarm_en"];
  alarm_high_temp = datas["alarm_high_temp"];
  alarm_low_temp = datas["alarm_low_temp"];
  watering_timer = datas["watering_timer"];

  connection.query("update sites set site_set_alarm_enable = ?, site_set_alarm_high = ?, site_set_alarm_low = ?, site_set_alarm_timer = ? where uid = ?",
    [alarm_en,
      alarm_high_temp,
      alarm_low_temp,
      watering_timer,
      uid,
    ],
    function test(error, results, fields) {
      if (error) throw error;
      console.log("update가 되었나요? 맞으면 1 안되면 0 :: ", results.message);
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
      console.log('Successfully sent message: : ', response)
    })
    .catch(function (err) {
      console.log('Error Sending message!!! : ', err)
    })
>>>>>>> 770a46846050825b34a02d4b251434a1f5b7ed01
}