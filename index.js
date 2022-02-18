const express = require("express");
const path = require("path");
const config = require("./config/config.json");
const PORT = process.env.PORT || config.server.port;
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const static = require("serve-static");

const farmRouter = require("./routes/farm");
let sequelize = require("./models/index").sequelize;

const fileStore = require("session-file-store")(session);

let app = express();
sequelize.sync();


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
  .use(static(path.join(__dirname, "upload")))
  .use("/farm/", farmRouter)
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));