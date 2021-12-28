require('dotenv').config();

let express = require('express');
let bodyParser = require('body-parser'); //body의 json을 파싱해주는 모듈
let dateFormat = require('dateformat'); //날짜형식을 원하는 형태로 바꿔주는 모듈
let empty = require('is-empty'); //빈값 체크 모듈 *.주의:0도 empty로 판단함
var {fromPath, fromBuffer} = require('pdf2pic');
var {fromBuffer} = require('pdf2pic');
const schedule = require('node-schedule');


function getFormatDate(date){
    var year = date.getFullYear();              //yyyy
    var month = (1 + date.getMonth());          //M
    month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
    var day = date.getDate();                   //d
    day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
    return  year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
}

// schedule.scheduleJob("1 1 1 * * *", function() {
schedule.scheduleJob("1 1 1 * * *", function() {


    var dateSchedule = new Date();
    dateSchedule = getFormatDate(dateSchedule);
    // console.log(new Date());
    // console.log("매분 5초마다 등장");
    PunchList.findAll({
        attributes: [ 
                'projectID',
                'punchID',
                'category',
                'systemID',
                'subsystem',
                'discipline',
                'status',
                'unit',
                'area',
                'tagNumber',
                'bulkItem',
                'bulkName',
                'department',
                'targetDate',
                'issuedDate',
                'issuedBy',
                'raisedBy',
                'completedDate',
                'completedBy',
                'confirmedDate',
                'confirmedBy',
                'notAcceptedDate',
                'notAcceptedBy',
                'closedDate',
                'closedBy',
                'scheduleKey',
                'scheStartDate',
                'scheFinishDate',
                'designChgReq',
                'materialReq',
                'issueDescription',
                'completeComment',
                'notAcceptComment',
                'difficulty',
                'scheduleImpact',
                'costImpact',
                'keyword1',
                'keyword2',
                'keyword3',
                'keyword4',
                'drawingNo',
                ],
    })
    .then(res => {

        for (var re of res){

                // console.log(re['issuedBy'])
                // console.log(res[0]['targetDate'].dateFormat('yyyy-mm-dd'))
                var dateScheduleDB = res[0]['targetDate'];
                dateScheduleDB = getFormatDate(dateScheduleDB);
                if((re['targetDate']-new Date()>86400000*7) && (re['targetDate']-new Date()<86400000*8)){
                    // if(dateScheduleDB.slice(6, 8))
                    let email;
                    users.findAll({
                        attributes: [ 'userID', 'password', 'userName', 'email', 'company', 'authority', 'personalID', 'department', 'active'],
                    }).then(results => {
                        for (var result of results){
                            if(result[userID]===re['issuedBy']){
                                email= result['email']
                            }
                        }
                
                    })
                    
                    let punchID = re['punchID'];
                    let issuedDate = re['issuedDate'];
                    let closedDate = re['closedDate'];
                    let issueDescription = re['issueDescription'];
                    let mailConfig = {
                        service: 'Naver',
                        host: 'smtp.naver.com',
                        port: 587,
                        auth: {
                            user: process.env.MAIL_EMAIL,
                            pass: process.env.MAIL_PASSWORD
                        }
                    }
                    let message = {
                        from: process.env.MAIL_EMAIL,
                        to: emails,
                        subject: 'The due date for the punch',
                        html: `<p>The due date for the punch is 1 week away. Please hurry up and complete the punch.
                        <br /> - PunchID : ${punchID}<br /> - Issued Date : ${issuedDate}<br /> - Closed Date : ${closedDate}<br /> - Description : ${issueDescription}</p>`
                    }
                    
                    let transporter = nodemailer.createTransport(mailConfig);
                    setTimeout(()=>{
                        console.log(1111)
                        try{
                            transporter.sendMail(message)
                        }catch(e){console.log(e)}
                    }, 1000)
                // console.log(res[0]['targetDate'].slice(0, 10).split('-1'))
            }
        }
    })
  });

const stringify = require("json-stringify-pretty-compact"); //json 값을 문자열로 (보기좋게)변환해주는 모듈

let router = express.Router();

// testimport DB // king
const { project } = require('../models');
const { status } = require('../models');
const { authority } = require('../models');
const { discipline } = require('../models');
const { category } = require('../models');
const { department } = require('../models');
const { systems } = require('../models');
const { subsystem } = require('../models');
const { users } = require('../models');
const { unit } = require('../models');
const { area } = require('../models');
const { drawing } = require('../models');
const { vwPunchHis } = require('../models');
const { progress } = require('../models');
const { projectUser } = require('../models');
const { photos } = require('../models');
const { punchLoc } = require('../models');


const { PunchList } = require('../models');

// file upload

const multer = require("multer");
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "upload/drawings/pdfs/")
    },
    filename: function (req, file, cb) {
        // cb(null, file.originalname + '-' + Date.now() + '.png')
        cb(null, file.originalname + '.png')
    }
})
// let upload = multer({
//     dest: "upload/drawings/"
// })
let upload = multer({storage:storage});

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());


router.get('/project', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    project.findAll({
        attributes: [ 'projectID', 'projectName', 'startDate', 'endDate', 'activated'],
        offset: offset,
        limit: limit,
    })

    .then(result => {
        res.set('Content-Range', `getProducts 0-${result.length}/${result.length}`)
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.json({result, resultID: "projectID", error: null})
    })
    .catch(err => {
        res.json({error: err}
    )});
})



router.get('/status', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    status.findAll({
        attributes: [ 'status', 'statusName', 'shortName', 'authority', 'remarks'],
        offset: offset,
        limit: limit,
    })

    .then(result => {
        res.set('Content-Range', `getProducts 0-${result.length}/${result.length}`)
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.json({result, resultID: "status", error: null})
    })
    .catch(err => {
        res.json({error: err}
    )});
})

router.get('/punchlic', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    punchLoc.findAll({
        attributes: [ 'drawingNo', 'punchID', 'xPixel', 'yPixel'],
        offset: offset,
        limit: limit,
    })

    .then(result => {
        res.set('Content-Range', `getProducts 0-${result.length}/${result.length}`)
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.json({result, resultID: "drawingNo", error: null})
    })
    .catch(err => {
        res.json({error: err}
    )});
})

router.delete('/status', (req, res) => {
    const queryid = parseInt(JSON.parse(req.query.filter)['id'][0])
    // const queryid = req.query.filter
    // console.log(queryid)
    // console.log(JSON.parse(queryid))
    // console.log(JSON.parse(queryid)['id'])
    console.log(queryid)
    status.destroy({
        where: {status : queryid}
        })
    })

router.put('/status/:id', (req, res) => {
    const targetID = req.params.id // url을 넣는다.
    const cateData = req.body
    console.log(targetID)
    console.log(cateData)
    status.update(
        cateData,
        { where: {status: targetID} }
    ).then(res.json({result:"succ!"}))
})

router.get('/status/:id', (req, res) => {
    const targetID = req.params.id // url을 넣는다.
    console.log(targetID)
    status.findAll(
        { where: {status: targetID} }
    ).then(result => {
        // res.set('Content-Range', `getProducts 0-${result.length}/${result.length}`)
        // res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.json({result, resultID: "status", error: null})
    })
})

// drawing.create({
//     projectID : req.body['projectID'],
//     systemID : req.body['systemID'],
//     subsystem : req.body['subsystem'],
//     seq : req.body['seq'],
//     drawingNo : req.body['drawingNo'],
//     imagePath : file.path,
// })

router.post('/status', (req, res) => {
    // const targetID = req.params.id // url을 넣는다.
    const cateData = req.body
    // console.log(targetID)
    console.log(cateData)
    status.create(
        cateData,
    ).then(res.json({result:"succ!"}))
})

router.get('/authority', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    authority.findAll({
        attributes: [ 'authority', 'authName', 'remarks'],
        offset: offset,
        limit: limit,
    })

    .then(result => {
        res.set('Content-Range', `getProducts 0-${result.length}/${result.length}`)
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.json({result, resultID: "authority", error: null})
    })
    .catch(err => {
        res.json({error: err}
    )});
})

router.get('/userprojectselect', (req, res) => {
    const targetUser = req.query.userid
    // const targetUser = 'user2'
    // console.log(targetUser)
    projectUser.findAll({
        attributes: [ 'projectID', 'userID'],
        where: {
            userID: targetUser
        }
    })
    .then(result=> {
        console.log(result)
        res.json({result, val:true, resultID:'projectID', error:null})
    })
    .catch(err => {
        res.json({error:err})
    })

})


router.get('/discipline', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    discipline.findAll({
        attributes: [ 'discipline', 'disciplineName', 'shortName'],
        offset: offset,
        limit: limit,
    })

    .then(result => {
        res.set('Content-Range', `getProducts 0-${result.length}/${result.length}`)
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.json({result, resultID: "discipline", error: null})
    })
    .catch(err => {
        res.json({error: err}
    )});
})

// router.get('/discipline/code', (req, res) => {
//     // const queyRangeString = req.query.range
//     // const startSetString = queyRangeString.indexOf('[')
//     // const midSetString = queyRangeString.indexOf(',')
//     // const endSetString = queyRangeString.indexOf(']')
//     // const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
//     // const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
//     discipline.findOne({
//         attributes: [ 'discipline', 'disciplineName', 'shortName'],
//         // offset: offset,
//         // limit: limit,
//     })

//     .then(result => {
//         // res.set('Content-Range', `getProducts 0-${result.length}/${result.length}`)
//         // res.set('Access-Control-Expose-Headers', 'Content-Range')
//         res.json({result, resultID: "discipline", error: null})
//     })
//     .catch(err => {
//         res.json({error: err}
//     )});
// })

// router.get('/status/code', (req, res) => {
//     // const queyRangeString = req.query.range
//     // const startSetString = queyRangeString.indexOf('[')
//     // const midSetString = queyRangeString.indexOf(',')
//     // const endSetString = queyRangeString.indexOf(']')
//     // const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
//     // const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
//     status.findOne({
//         attributes: [ 'status', 'statusName', 'shortName', 'authority', 'remarks'],
//         // offset: offset,
//         // limit: limit,
//     })

//     .then(result => {
//         // res.set('Content-Range', `getProducts 0-${result.length}/${result.length}`)
//         // res.set('Access-Control-Expose-Headers', 'Content-Range')
//         res.json({result, resultID: "status", error: null})
//     })
//     .catch(err => {
//         res.json({error: err}
//     )});
// })


router.get('/category', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    category.findAll({
        attributes: [ 'category', 'categoryName', 'stage'],
        offset: offset,
        limit: limit,
    })

    .then(result => {
        res.set('Content-Range', `getProducts 0-${result.length}/${result.length}`)
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.json({result, resultID: "category", error: null})
    })
    .catch(err => {
        res.json({error: err}
    )});
})


router.get('/department', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    department.findAll({
        attributes: [ 'department', 'deptName', 'shortName'],
        // offset: offset,
        // limit: limit,
    })

    .then(result => {
        res.set('Content-Range', `getProducts 0-1000/1000`)
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.json({result, resultID: "department", error: null})
    })
    .catch(err => {
        res.json({error: err}
    )});
})


router.get('/systems', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    systems.findAll({
        attributes: [ 'systemID', 'systemName'],
        // offset: 1000,
        // limit: 1000,
    })

    .then(result => {
        res.set('Content-Range', `getProducts 0-1000/1000`)
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.json({result, resultID: "systemID", error: null})
    })
    .catch(err => {
        res.json({error: err}
    )});
})


router.get('/subsystem', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    subsystem.findAll({
        attributes: [ 'subsystem', 'subsystemName'],
        // offset: offset,
        // limit: limit,
    })

    .then(result => {
        res.set('Content-Range', `getProducts 0-1000/1000`)
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.json({result, resultID: "subsystem", error: null})
    })
    .catch(err => {
        res.json({error: err}
    )});
})

router.get('/progress', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    progress.findAll({
        attributes: [ 'projectID', 
                        'predDate',
                        'RemainYday',
                        'IssuedYday',
                        'IssuedToday',
                        'IssuedTotal',
                        'ClosedYday',
                        'ClosedToday',
                        'ClosedTotal',
                        'RemainToday',
                        'Pending',
                        'trendIssued',
                        'trendCompleted',
                        'trendClosed',
                        'predict'



                    ],
        // offset: offset,
        // limit: limit,
    })

    .then(result => {
        res.set('Content-Range', `getProducts 0-1000/1000`)
        res.set('Access-Control-Expose-Headers')
        res.json({result, resultID: "progress", error: null})
    })
    .catch(err => {
        res.json({error: err}
    )});
})


router.get('/usercode', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    users.findAll({
        attributes: [ 'userID', 'password', 'userName', 'email', 'company', 'authority', 'personalID', 'department', 'active'],
        // offset: offset,
        // limit: limit,
    })
    .then(result => {
        res.set('Content-Range', `getProducts 0-1000/1000`)
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.json({result, resultID: "userID", error: null})
    })
    .catch(err => {
        res.json({error: err}
    )});
})


router.get('/unit', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    unit.findAll({
        attributes: [ 'unit', 'unitName'],
        // offset: offset,
        // limit: limit,
    })
    .then(result => {
        res.set('Content-Range', `getProducts 0-1000/1000`)
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.json({result, resultID: "unit", error: null})
    })
    .catch(err => {
        res.json({error: err}
    )});
})


router.get('/area', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    area.findAll({
        attributes: [ 'area', 'areaName'],
        offset: offset,
        limit: limit,
    })
    .then(result => {
        res.set('Content-Range', `getProducts 0-${result.length}/${result.length}`)
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.json({result, resultID: "area", error: null})
    })
    .catch(err => {
        res.json({error: err}
    )});
})

router.get('/projectuser', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    projectUser.findAll({
        attributes: [ 'projectID', 'userID'],
        offset: offset,
        limit: limit,
    })
    .then(result => {
        res.set('Content-Range', `getProducts 0-${result.length}/${result.length}`)
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.json({result, resultID: "projectID", error: null})
    })
    .catch(err => {
        res.json({error: err}
    )});
})


router.get('/drawing', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    drawing.findAll({
        attributes: [ 'projectID', 'systemID', 'subsystem', 'seq', 'drawingNo', 'uploadDate', 'imagePath', 'xSize', 'ySize'],
        // offset: offset,
        // limit: limit,
    })
    .then(result => {
        res.set('Content-Range', `getProducts 0-${result.length}/${result.length}`)
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.json({result, resultID: "drawingNo", error: null})
    })
    .catch(err => {
        res.json({error: err}
    )});
})

router.put('/list/:id', (req, res) => {
    const targetID = req.params.id // url을 넣는다.
    const cateData = req.body.status
    PunchList.update(
        { status: cateData },
        { where: {punchID: targetID} }
    ).then(res.json({result:"succ!"}))
})

router.put('/listAccept/:id', (req, res) => {
    const targetID = req.params.id // url을 넣는다.
    const cateData = req.body.status

    const curr = new Date();
    const utc = 
      curr.getTime() + 
      (curr.getTimezoneOffset() * 60 * 1000);
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const kr_curr = 
        new Date(utc + (KR_TIME_DIFF));
    // console.log(kr_curr)
    const NAcceptDate = new Date(utc + (KR_TIME_DIFF));
    // const NAcceptDate = new Date().toISOString().replace('-', '/').split('T')[0].replace('-', '/');
    const notAcceptedByData = req.body.notAcceptedBy
    const notAcceptCommentData = req.body.notAcceptedComment
    const objectToUpdata = { 
                            status: cateData, 
                            notAcceptedDate: NAcceptDate, 
                            notAcceptedBy:notAcceptedByData, 
                            notAcceptComment:notAcceptCommentData
                        }
    // console.log(targetID)  // PC-2-00-MB-MBP-E-01-004
    // console.log(cateData) // 3
    // console.log(NAcceptDate)  // 2021-10-12T09:29:21.144Z
    // console.log(notAcceptedByData)  //testUser
    // console.log(notAcceptCommentData)
    // console.log(objectToUpdata)
    PunchList.update(objectToUpdata,
        { where: {punchID: targetID} }
    )
    // .then(console.log(res))
    .then(res.json({result:"succ!"}))
    .catch(console.log('error'))
})

router.post('/list/create', (req, res) => {
    const allData = req.body['data'];
    const targetColumn = req.body['colDefs'];
    console.log(allData)
    console.log(targetColumn)
    PunchList.bulkCreate(
        allData,
    //     [{projectID: "aaaaa", 
    // punchID: "vvvvv"},{projectID: "aaaad", 
    // punchID: "vvvvd"}  ],
        {
            fields: targetColumn
            // fields: ["projectID", "punchID"]
        }).then(  res.json({result:"succ!"}))
        .catch((e)=> (console.log(e)))

})

router.get('/vwpunchhis', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    vwPunchHis.findAll({
        attributes: [ 
                        'projectID', 
                        'punchID', 
                        'status', 
                        'statusName', 
                        'createdBy', 
                        'createdDate', 
                        'description'
                    ],
        offset: offset,
        limit: limit,
    })
    .then(result => {
        console.log(1)
        // res.set('Content-Range', `getProducts 0-${result.length}/${result.length}`)
        // res.set('Access-Control-Expose-Headers', 'Content-Range')
        // res.json({result, resultID: "vwPunchHis", error: null})
    })
    .catch(err => {
        res.json({error: err}
    )});
})

// router.get('/vwpunchhis', (req, res) => {
//     console.log('ㅁㅁ들어옴aa')
//     vwpunchhis.findAll(
//         {
//           attributes: [ 
//                         'projectID', 
//                         'punchID', 
//                         'status', 
//                         'statusName', 
//                         'createdBy', 
//                         'createdDate', 
//                         'description'
//                     ],
//         }
//     )
//     .then(result => {
//         // res.set('Content-Range', `getProducts 0-${result.length}/${result.length}`)
//         // res.set('Access-Control-Expose-Headers', 'Content-Range')
//         console.log(result);
//         // res.json({result, resultID: "vwpunchhis", error: null})
//         res.json({noterror: 'not ero'});
//     })
//     .catch(err => {
//         // res.json({error: err})
//         console.log('errarea');
//         res.json({error: 'errrrrrrr'});
//     });
// })

router.get('/list', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    PunchList.findAll({
        attributes: [ 
                'projectID',
                'punchID',
                'category',
                'systemID',
                'subsystem',
                'discipline',
                'status',
                'unit',
                'area',
                'tagNumber',
                'bulkItem',
                'bulkName',
                'department',
                'targetDate',
                'issuedDate',
                'issuedBy',
                'raisedBy',
                'completedDate',
                'completedBy',
                'confirmedDate',
                'confirmedBy',
                'notAcceptedDate',
                'notAcceptedBy',
                'closedDate',
                'closedBy',
                'scheduleKey',
                'scheStartDate',
                'scheFinishDate',
                'designChgReq',
                'materialReq',
                'issueDescription',
                'completeComment',
                'notAcceptComment',
                'difficulty',
                'scheduleImpact',
                'costImpact',
                'keyword1',
                'keyword2',
                'keyword3',
                'keyword4',
                'drawingNo',
                ],
         offset: offset,
         limit: limit,
    })
    // .then(result => {
    //     console.log(result)

    // })
    .then(result => {
        // res.header("Content-Range", `getProducts 0-4/${result.length}`);
        // res.set('Content-Range', `getProducts 0-${result.length}/${result.length}`)
        res.set('Content-Range', `getProducts 0-10000/10000`)
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        // res.send(result);
        res.json({result, resultID: "punchID", error: null})

    })
    .catch(err => {
        res.json({error: null}
    )});
})

var PDFImage = require("pdf-image").PDFImage;
var fs = require('fs');
router.post('/uploadfile', upload.single("pdffile"), function(req, res, next) {
    // let data = req.
    // console.log(data)

    let file = req.file
    // 4. 파일 정보
    let result = {
        originalName : file.originalname,
        size : file.size,
    }
    
    // upload/drawings/

    // const options = {
    //     // density: 100,
    //     saveFilename: "untitled",
    //     savePath: "./images",
    //     // savePath: "upload/drawings/pngs/",
    //     format: "jpg",
    //     // width: 600,
    //     // height: 600
    //   };
    // var fromPath = require('pdf2pic');

    // const storeAsImage = fromPath("upload/drawings/pdfs/1111-1634176171616.pdf", options);
    // // const storeAsImage = fromPath("./1111-1634176171616.pdf", options);
    // const pageToConvertAsImage = 1;

    // storeAsImage(pageToConvertAsImage, true).then((resolve) => {
    //     console.log("Page 1 is now converted as image");
      
    //     return resolve;
    //   });
    //   console.log(1)
    //   var pdfImage = new PDFImage("upload/drawings/pdfs/sampleDrawing.pdf");
    //   var pdfImage = new PDFImage("./sampleDrawing.pdf");
    //   console.log(2)
    //   pdfImage.convertFile().then((imagePath) => {
          // 0-th page (first page) of the slide.pdf is available as slide-0.png
        //   res.sendFile(imagePath);
        //   console.log(3)
        //   console.log(imagePath)
    // fs.existsSync("/tmp/slide-0.png") // => true
    // }).catch(e=> console.log(e));



    console.log(req.body['projectID'])
    console.log(req.body['systemID'])
    console.log(req.body['subsystem'])
    console.log(req.body['seq'])
    console.log(req.body['drawingNo'])
    console.log(req.body['pdffile'])
    console.log(file.path)
    console.log( Date.now())
    drawing.create({
        projectID : req.body['projectID'],
        systemID : req.body['systemID'],
        subsystem : req.body['subsystem'],
        seq : req.body['seq'],
        drawingNo : req.body['drawingNo'],
        imagePath : file.path,
    })
    res.json(result);
})

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
router.post('/updateDetail', multipartMiddleware, function(req, res, next) {

    if (req.body['targetDate']!==undefined){
        PunchList.update(
            { targetDate: req.body['targetDate'] },
            { where: {punchID: req.body['punchID']} }
        )
        // .then(res.json({result:"targetDatesucc!"}))
    }
    if (req.body['designChgReq']!==undefined){
        PunchList.update(
            { designChgReq: req.body['designChgReq'] },
            { where: {punchID: req.body['punchID']} }
        )
        // .then(res.json({result:"designChgReqsucc!"}))
    }
    if (req.body['materialReq']!==undefined){
        PunchList.update(
            { materialReq: req.body['materialReq'] },
            { where: {punchID: req.body['punchID']} }
        )
        // .then(res.json({result:"materialReqReqsucc!"}))
    }
    if (req.body['scheduleImpact']!==undefined){
        PunchList.update(
            { scheduleImpact: req.body['scheduleImpact'] },
            { where: {punchID: req.body['punchID']} }
        )
        // .then(res.json({result:"scheduleImpactReqsucc!"}))
    }
    if (req.body['costImpact']!==undefined){
        PunchList.update(
            { costImpact: req.body['costImpact'] },
            { where: {punchID: req.body['punchID']} }
        )
        // .then(res.json({result:"costImpactReqReqsucc!"}))
    }
    if (req.body['keyword1']!==undefined){
        PunchList.update(
            { keyword1: req.body['keyword1'] },
            { where: {punchID: req.body['punchID']} }
        )
        // .then(res.json({result:"keyword1Reqsucc!"}))
    }
    if (req.body['keyword2']!==undefined){
        PunchList.update(
            { keyword2: req.body['keyword2'] },
            { where: {punchID: req.body['punchID']} }
        )
        // .then(res.json({result:"keyword2Reqsucc!"}))
    }
    if (req.body['keyword3']!==undefined){
        PunchList.update(
            { keyword3: req.body['keyword3'] },
            { where: {punchID: req.body['punchID']} }
        )
        // .then(res.json({result:"keyword3Reqsucc!"}))
    }
    if (req.body['keyword4']!==undefined){
        PunchList.update(
            { keyword4: req.body['keyword4'] },
            { where: {punchID: req.body['punchID']} }
        )
        // .then(res.json({result:"keyword4Reqsucc!"}))
    }
    if (req.body['issueDescription']!==undefined){
        PunchList.update(
            { issueDescription: req.body['issueDescription'] },
            { where: {punchID: req.body['punchID']} }
        )
        // .then(res.json({result:"issueDescriptionReqsucc!"}))
    }
    if (req.body['completeComment']!==undefined){
        PunchList.update(
            { completeComment: req.body['completeComment'] },
            { where: {punchID: req.body['punchID']} }
        )
        // .then(res.json({result:"completeCommentReqsucc!"}))
    }
    

    res.json('success');
})


const nodemailer = require('nodemailer')
router.post('/mail', (req, res) =>{
    console.log(1)
    console.log(1)
    console.log(1)
    console.log(1)
    console.log(1)
    console.log(1)
    console.log(1)
    const emails = req.body['data'];
    const punchID = req.body['punchID'];
    const issuedDate = req.body['issuedDate'].slice(0, 10);
    const closedDate = req.body['closedDate'].slice(0, 10);
    const issueDescription = req.body['issueDescription'];
    console.log(emails[0])
    console.log(punchID)
    console.log(issuedDate)
    console.log(closedDate)
    console.log(issueDescription)
    let mailConfig = {
        service: 'Naver',
        host: 'smtp.naver.com',
        port: 587,
        auth: {
            user: process.env.MAIL_EMAIL,
            pass: process.env.MAIL_PASSWORD
        }
    }
    let message = {
        from: process.env.MAIL_EMAIL,
        to: emails,
        subject: 'Status Closed',
        html: `<p>The Punch is closed. Thanks for your efforts. <br /> - PunchID : ${punchID}<br /> - Issued Date : ${issuedDate}<br /> - Closed Date : ${closedDate}<br /> - Description : ${issueDescription}</p>`
    }
    
    let transporter = nodemailer.createTransport(mailConfig);
    setTimeout(()=>{
        console.log(1111)
        try{
            transporter.sendMail(message)
        }catch(e){console.log(e)}
    }, 1000)
    res.json('aa')
})


// router.get('/drawingimage', (req, res) => {
//     const queyRangeString = req.query.range
//     const startSetString = queyRangeString.indexOf('[')
//     const midSetString = queyRangeString.indexOf(',')
//     const endSetString = queyRangeString.indexOf(']')
//     const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
//     const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
//     project.findAll({
//         attributes: [ 'projectID', 'projectName', 'startDate', 'endDate', 'activated'],
//         offset: offset,
//         limit: limit,
//     })

//     .then(result => {
//         res.set('Content-Range', `getProducts 0-${result.length}/${result.length}`)
//         res.set('Access-Control-Expose-Headers', 'Content-Range')
//         res.json({result, resultID: "projectID", error: null})
//     })
//     .catch(err => {
//         res.json({error: err}
//     )});
// })
router.get('/preview', async (req, res, next)=>{ 
    const imgUrl = "http://localhost:3000/drawings/pdfs/" ;
    // result = imgUrl+"저장된 이미지명" //imgUrl+"kitty.png" 
    result = imgUrl+"#4444-1634252453600.png"; //imgUrl+"kitty.png" 
    res.send(result); 
})

router.get('/photos', (req, res) => {
    const queyRangeString = req.query.range
    const startSetString = queyRangeString.indexOf('[')
    const midSetString = queyRangeString.indexOf(',')
    const endSetString = queyRangeString.indexOf(']')
    const offset = Number(queyRangeString.slice(startSetString+1, midSetString))
    const limit = Number(queyRangeString.slice(midSetString+1, endSetString))
    photos.findAll({
        attributes: [ 'punchID', 'punchStep', 'seq', 'localPath', 'imagePath', 'uploaded', 'uploadDate'],
        offset: offset,
        limit: limit,
    })

    .then(result => {
        res.set('Content-Range', `getProducts 0-${result.length}/${result.length}`)
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.json({result, resultID: "status", error: null})
    })
    .catch(err => {
        res.json({error: err}
    )});
})





module.exports = router;