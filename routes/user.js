let express = require('express');
let bodyParser = require('body-parser'); //body의 json을 파싱해주는 모듈
let dateFormat = require('dateformat'); //날짜형식을 원하는 형태로 바꿔주는 모듈
let empty = require('is-empty'); //빈값 체크 모듈 *.주의:0도 empty로 판단함

const bcrypt = require('bcrypt');
const saltRounds = 10;

const stringify = require("json-stringify-pretty-compact"); //json 값을 문자열로 (보기좋게)변환해주는 모듈

let router = express.Router();

const {User} = require('../models');

// testimport DB // king



router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.get('/loginCheck', (req, res) => {
    if (req.session.loginData) {
        res.send({loggedIn: true, loginData: req.session.loginData})
    } else {
        res.send({loggedIn: false})
    }
})


router.post('/login', async (req, res, next) => {
    let uid = req.body.uid;
    let password = req.body.password;
    if (!empty(uid) && !empty(password)) {
        User.findOne({where: {uid: uid}})
            .then(results => {
                bcrypt.compare(password, results.password, (error, result) => {
                    if (result) {
                        req.session.loginData = {uid: uid, password: password};
                        req.session.save(error => {
                            if (error) console.log(error)
                        })
                        res.json({results, result: true});
                    } else {
                        res.json({result: false, error: null, data: null});
                    }
                })
            })
            .catch(err => {
                console.error(err);
            });
        } else {
        res.json({result: false, error: null, data: null});
    }
});

router.post('/register', async (req, res, next) => {
    let uid = req.body.uid;
    let password = req.body.password;
    let sid = req.body.sid_base;
    
    if (!empty(uid) && !empty(password)) {
        bcrypt.hash(password, saltRounds, (error, hash) => {
            password = hash;
            User.create({
                uid: uid, 
                password: password,
                sid:sid,
            })
                .then(result => {
                    res.json({result: result, error: null, data: null});
                })
                .catch(err => {
                    console.error(err);
                    res.json({result: false, error: err, data: null});
                });
        })
    } else {
        res.json({result: false, error: null, data: null});
    }
});


router.post('/update', async (req, res, next) => {
    let uid = req.body.uid;
    let password = req.body.password;
    if (!empty(uid) && !empty(password)) {
        User.update({password: password}, {where: {uid: uid}})
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                console.error(err);
            });
    } else {
        res.json({result: false, error: null, data: null});
    }
});

router.post('/delete', async (req, res, next) => {
    let uid = req.body.uid;
    if (!empty(uid)) {
        User.destroy({where: {uid: uid}})
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                console.error(err);
            });
    } else {
        res.json({result: false, error: null, data: null});
    }
});



module.exports = router;