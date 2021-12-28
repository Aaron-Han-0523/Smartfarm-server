const express = require('express')
const path = require('path');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const static = require('serve-static');
const router = require("./routes/user"); //라우터 모듈 등록 (라우터 모듈안에 다이어리 스키마 모듈을 불러오고 있으므로 아래와 같이 라우터만!
const punchListRouter = require("./routes/punchList"); 
const summuryRouter = require("./routes/summury"); 
let sequelize = require('./models/index').sequelize;
let app = express();
sequelize.sync();

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser());
app.use(
    session({
        key: "loginData",
        secret: "testSecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24
        }
    })
);
app
    // .use(express.static(path.join(__dirname, 'upload')))
    .use(static(path.join(__dirname, 'upload')))
    .use('/api/', router)
    .use('/punchlist/', punchListRouter)
    .use('/summury/', summuryRouter)
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
