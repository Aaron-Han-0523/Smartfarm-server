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
let sequelize = require("./models/index").sequelize;
let app = express();
sequelize.sync();

var mysql = require("mysql");
// var connection = mysql.createConnection({
//   username: "root",
//   password: "root",
//   database: "smartfarm",
//   host: "localhost",
//   // port: "3306",
// });

var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "smartfarm",
  multipleStatements: true,
});

//// mqtt
//https://yonghyunlee.gitlab.io/node/node-mqtt/
// mysql connect
//https://gist.github.com/smching/ff414e868e80a6ee2fbc8261f8aebb8f
const {
  Trends
} = require("./models");
var mqtt = require("mqtt");

function mqttData() {
  const options = {
    host: "127.0.0.1",
    port: 1883,
  };

  var count = 0;

  const client = mqtt.connect("mqtt://broker.mqttdashboard.com:1883", options);
  client.subscribe("/sf/e0000001/data");
  client.on("connect", function () {
    console.log("connected  " + client.connected);
    count++;
  });
  client.on("message", function (topic, message, packet) {
    console.log(count);
    // console.log("message is " + message);
    // console.log("topic is " + topic);

    var datas = JSON.parse(message.toString());
    // console.log(datas);
    // console.log(data["temp_1"]);
    sqlUpdate(datas);
    if (count != 0) {
      client.end();
      count = 0;
      console.log("sql");
    }

    console.log(count);
  });
}

///sql

// connection.connect(function (err) {
//   if (err) throw err;
//   console.log("sql Connected!");
// });

// function sqlUpdate(datas) {
//   var keys = Object.keys(datas);
//   console.log("Connected!");

//   for (let i = 2; i < keys.length; i++) {
//     console.log(datas);
//     // console.log(keys[i]);
//     // console.log(datas["t"]);
//     // console.log(datas[keys[i]]);
//     let sensor_id = (keys[i] + "_" + i).toString();
//     console.log(sensor_id);
//     let sid = "sid";
//     let uid = "test";
//     let time_stamp = datas["t"].toString();
//     let value = datas[keys[i]].toString();
//     console.log("!!!!!!!!!!!!hi!!!!!!!!!!!");
//     Trends.update({
//       sid: sid,
//       uid: uid,
//       time_stamp: time_stamp,
//       value: value,
//     })

//   }
//   // console.log(results);
// }

function sqlUpdate(datas) {
  var keys = Object.keys(datas);
  console.log("Connected!");

  for (let i = 2; i < keys.length; i++) {
    console.log(datas);
    // console.log(keys[i]);
    // console.log(datas["t"]);
    // console.log(datas[keys[i]]);
    let sensor_id = (keys[i] + "_" + i).toString();
    console.log(sensor_id);
    let sid = "sid";
    let uid = "test";
    let time_stamp = datas["t"].toString();
    let value = datas[keys[i]].toString();
    console.log("!!!!!!!!!!!!hi!!!!!!!!!!!");
    connection.query(
      "insert into trends values (?,?,?,?,?);",
      [sensor_id, sid, uid, time_stamp, value],

    );
    console.log("!!!!!!!!!!!!bye!!!!!!!!!!!");
  }
  // console.log(results);
}

//// run
mqttData();

setInterval(() => {
  mqttData();
}, 600000);
// 600000
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
    key: "loginData",
    secret: "testSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);
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