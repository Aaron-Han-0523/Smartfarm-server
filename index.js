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

//// mqtt
//https://yonghyunlee.gitlab.io/node/node-mqtt/
// mysql connect
//https://gist.github.com/smching/ff414e868e80a6ee2fbc8261f8aebb8f

function mqttData() {
  const options = {
    host: "127.0.0.1",
    port: 1883,
  };
  var bool = false;

  const client = mqtt.connect("mqtt://broker.mqttdashboard.com:1883", options);
  client.subscribe("/sf/e0000001/#");
  client.on("connect", function () {
    console.log("connected  " + client.connected);
  });
  client.on("message", function (topic, message, packet) {
    console.log(bool);
    console.log("message is " + message);
    // console.log("topic is " + topic);

    // var datas = JSON.parse(message.toString());
    // console.log(datas);
    // console.log(data["temp_1"]);
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
  });
}

///sql
var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "smartfarm",
  multipleStatements: true,
});

function sqlUpdate(datas) {
  var keys = Object.keys(datas);
  console.log("Connected!");
  for (let i = 2; i < keys.length; i++) {
    let sensor_id = keys[i].toString();
    let sid = "sid";
    let uid = "test";
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

/////////////////////////////////////////////////////

// 푸시알림 fcm

// admin 서버키 가져오기
var admin = require("firebase-admin");
var serviceAccount = require("./config/smartfarm-f4f8a-firebase-adminsdk-dcwir-9352731a71.json");
const isEmpty = require("is-empty");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// sql로 저장된 token값 가져와서 푸시 알림 보내기
connection.query('select fcmtoken from users where uid=?',
  'test',
  function test(error, results, fields) {
    if (error) throw error;
    fcmtoken = results[0].fcmtoken;
    console.log('The fcmtoken is: ', fcmtoken);

    if (!isEmpty(fcmtoken)) {
      pushAlarm();
    }
  });


// 푸시알림 보내기
async function pushAlarm(req, res) {
  //디바이스의 토큰 값 
  let deviceToken = fcmtoken;
  let message = {
    notification: {
      title: 'fcm test',
      body: 'fcm test',
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
}