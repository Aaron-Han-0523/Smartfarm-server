const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 9080;
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const static = require("serve-static");
// const router = require("./routes/user"); //라우터 모듈 등록 (라우터 모듈안에 다이어리 스키마 모듈을 불러오고 있으므로 아래와 같이 라우터만!
const farmRouter = require("./routes/farm");
// const punchListRouter = require("./routes/punchList");
// const summuryRouter = require("./routes/summury");
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

app
  // .use(express.static(path.join(__dirname, 'upload')))
  .use(static(path.join(__dirname, "upload")))
  // .use("/api/", router)
  .use("/farm/", farmRouter)
  // .use("/punchlist/", punchListRouter)
  // .use("/summury/", summuryRouter)
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));