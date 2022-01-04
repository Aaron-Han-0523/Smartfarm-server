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

///sql

var mysql = require("mysql");
var connection = mysql.createConnection({
  username: "root",
  password: "root",
  database: "smartfarm",
  host: "127.0.0.1",
  multipleStatements: true,
});
function sqlUpdate(datas) {
  var keys = Object.keys(datas);

  connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    for (let i = 2; i < datas.length; i++) {
      const sensor_id = keys[i];
      const sid = "sid";
      const uid = "test";
      const time_stamp = datas["t"];
      const value = datas[i];
      connection
        .query("insert into smartfarm.trends values (?, ?, ?, ?, ?)", [
          sensor_id,
          sid,
          uid,
          time_stamp,
          value,
        ])
        .then((result) => {
          res.json({
            data: result,
            test: "test",
            error: null,
          });
        })
        .catch((err) => {
          console.error(err);
          res.json({
            error: null,
          });
        });
    }
  });
}

//// mqtt
//https://yonghyunlee.gitlab.io/node/node-mqtt/
// mysql connect
//https://gist.github.com/smching/ff414e868e80a6ee2fbc8261f8aebb8f
const { Trends } = require("./models");
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

    var data = JSON.parse(message.toString());
    // console.log(data);
    // console.log(data["temp_1"]);
    sqlUpdate(data);
    if (count != 0) {
      client.end();
      count = 0;
      console.log("sql");
    }

    console.log(count);
  });
}

///sql

mqttData();

setInterval(() => {
  mqttData();
}, 3000);
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
