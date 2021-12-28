

let express = require('express');
let bodyParser = require('body-parser'); //body의 json을 파싱해주는 모듈
let dateFormat = require('dateformat'); //날짜형식을 원하는 형태로 바꿔주는 모듈
let empty = require('is-empty'); //빈값 체크 모듈 *.주의:0도 empty로 판단함


const bcrypt = require('bcrypt');
const saltRounds = 10;


const {User, Category} = require('../models');

const multer = require("multer");
// const upload = multer({ dest: 'uploads/' })
var fs = require('fs');
const storage = multer.diskStorage({
	destination: (req, file, cb) => {  // 파일이 업로드될 경로 설정
		cb(null, 'upload/photos')
	},
	filename: (req, file, cb) => {	// timestamp를 이용해 새로운 파일명 설정
		let newFileName =file.originalname
		cb(null, newFileName)
	},
})
const upload = multer({ storage: storage })

const stringify = require("json-stringify-pretty-compact"); //json 값을 문자열로 (보기좋게)변환해주는 모듈

let router = express.Router();

const { authority } = require('../models');
const { category } = require('../models');
const { department } = require('../models');
const { systems } = require('../models');
const { subsystem } = require('../models');
const { discipline } = require('../models');
const { punchlist } = require('../models');
const { unit } = require('../models');
const { area } = require('../models');
const { photos } = require('../models');
const { drawing } = require('../models');
const { punchLoc } = require('../models');
const { Op, where } = require("sequelize");

var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'127.0.0.1',
    user: 'root',
    password:'root',
    database: 'punch',
});




router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());


router.get('/authority', (req, res) => {
    authority.findAll({
        attributes: [ 'authority', 'authName', 'remarks']
    })
    .then(result => {
        // res.json({"data":result, test: "test", error: null})
        res.json(result)
    })
    .catch(err => {
        console.error(err);
        res.json({error: null}
    )});
})



router.get('/department', (req, res) => {
    department.findAll({
        attributes: [ 'department', 'deptName', 'shortName']
        // where: { id: [1]}
    })
    .then(result => {
        // res.json({"data":result, test: "test", error: null})
        console.log(result.body)
        res.json(result)
    })
    .catch(err => {
        console.error(err);
        res.json({error: null}
    )});
})

router.get('/category', (req, res) => {
    category.findAll({
        attributes: [ 'category', 'categoryName', 'stage']
        // where: { id: [1]}
    })
    .then(result => {
        // res.json({"data":result, test: "test", error: null})
        console.log(result.body)
        res.json(result)
    })
    .catch(err => {
        console.error(err);
        res.json({error: null}
    )});
})

router.get('/systems', (req, res) => {
    systems.findAll({
        attributes: [ 'systemID', 'systemName']
        // where: { id: [1]}
    })
    .then(result => {
        // res.json({"data":result, test: "test", error: null})
        console.log(result.body)
        res.json(result)
    })
    .catch(err => {
        console.error(err);
        res.json({error: null}
    )});
})

router.get('/subsystem', (req, res) => {
    subsystem.findAll({
        attributes: [ 'subsystem', 'subsystemName', ]
        // where: { id: [1]}
    })
    .then(result => {
        // res.json({"data":result, test: "test", error: null})
        console.log(result.body)
        res.json(result)
    })
    .catch(err => {
        console.error(err);
        res.json({error: null}
    )});
})

router.get('/discipline', (req, res) => {
    discipline.findAll({
        attributes: [ 'discipline', 'disciplineName', 'shortName']
        // where: { id: [1]}
    })
    .then(result => {
        // res.json({"data":result, test: "test", error: null})
        console.log(result.body)
        res.json(result)
    })
    .catch(err => {
        console.error(err);
        res.json({error: null}
    )});
})

router.get('/unit', (req, res) => {
    unit.findAll({
        attributes: [ 'unit', 'unitName']
        // where: { id: [1]}
    })
    .then(result => {
        // res.json({"data":result, test: "test", error: null})
        console.log(result.body)
        res.json(result)
    })
    .catch(err => {
        console.error(err);
        res.json({error: null}
    )});
})
router.get('/area', (req, res) => {
    area.findAll({
        attributes: [ 'area', 'areaName']
        // where: { id: [1]}
    })
    .then(result => {
        // res.json({"data":result, test: "test", error: null})
        console.log(result.body)
        res.json(result)
    })
    .catch(err => {
        console.error(err);
        res.json({error: null}
    )});
})


const sql = 'SELECT * FROM punch.punchlist as A , punch.category as B, punch.discipline as C, punch.systems as D, punch.subsystem as E'

router.get('/sqltest', (req, res) => {
    connection.query(sql + ' where A.category = B.category and A.discipline = C.discipline and A.systemID = D.systemID and A.subsystemName = E.subsystemName order by issuedDate desc', function(error,results){
        if (error){
            console.log(error);
        }
        res.json(results);
    });
    
})

router.get('/sqlall', (req, res) => {
    
    connection.query(sql+' where A.category = B.category and A.discipline = C.discipline and A.systemID = D.systemID and A.subsystem = E.subsystem order by issuedDate desc', function(error,results){
        if (error){
            console.log(error);
        }
        res.json(results);
    });
})

router.post('/sqlqc', (req, res) => {
    let userID = req.body.userID;
    connection.query(sql+' where A.issuedBy=? and A.category = B.category and A.discipline = C.discipline and A.systemID = D.systemID and A.subsystem = E.subsystem order by issuedDate desc',[userID], function(error,results){
        if (error){
            console.log(error);
        }
        res.json(results);
    });
})

router.get('/userqc', (req, res) => {
    connection.query('select userName from punch.users where punch.users.authority =?',['4'], function(error,results){
        if (error){
            console.log(error);
        }
        res.json(results);
    });
    
})
const sql2 = ' select *'
// const sql2 = ' select A.issuedBy, A.punchID, A.category, D.categoryname, A.status, A.discipline, C.disciplineName, A.unit, A.area, A.tagnumber,B.deptname, G.username, E.systemname, F.subsystemname'
const sql3 = ' from punch.punchlist as A LEFT OUTER JOIN punch.department as B ON A.department = B.department LEFT OUTER JOIN punch.discipline as C ON A.discipline = C.discipline LEFT OUTER JOIN punch.category as D ON A.category = D.category LEFT OUTER JOIN punch.systems as E ON A.systemID = E.systemID LEFT OUTER JOIN punch.subsystem as F ON A.subsystem = F.subsystem LEFT OUTER JOIN punch.users as G ON A.issuedby = G.userID '
router.post('/sqlassi', (req, res) => {
    let projectID = req.body.projectID;
    let userID = req.body.userID;
    connection.query(sql2+sql3+
        " where A.projectID = ? and (A.issuedby = ? or (G.authority = ? and (A.status = ? or A.status = ?)))"+
    " UNION"+sql2+ sql3+" where A.projectID = ? and A.issuedby = ? and G.authority > ? order by issuedDate desc  ",[projectID,userID,'1','2','5',projectID,userID,'1'], function(error,results){
        if (error){
            console.log(error);
        }
        res.json(results);
    });
})

router.get('/project', (req, res) => {
    let userID = req.header("userID");
    connection.query("select A.projectID, A.projectName	from punch.project A, punch.projectuser B where A.activated = ? and A.projectID = B.projectID and B.userID = ? order by startDate DESC limit ?;"
    ,['1',userID,1], function(error,results){
        if (error){
            console.log(error);
        }
        res.json(results);
    });
    
})




router.post('/complete', async (req, res, next) => {
  let userID = req.body.userID;
  let projectID = req.body.projectID;
  let punchID = req.body.punchID;
  let completeComment = req.body.completeComment;
  let completedDate = req.body.completedDate;
  if (!empty(projectID) && !empty(punchID)) {
    punchlist.update({completedDate: completedDate,completeComment:completeComment,completedBy:userID,status:'3'}, 
    {where: {projectID: projectID, punchID: punchID}})
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


router.post('/confirm', async (req, res, next) => {
    const projectID = req.body.projectID;
    const punchID = req.body.punchID;
    const category = req.body.category;
    const systemID = req.body.systemID;
    const subsystem = req.body.subsystem;
    const discipline = req.body.discipline;
    const status = req.body.status;
    const unit = req.body.unit;
    const area = req.body.area;
    const tagNumber = req.body.tagNumber;
    const bulkItem = req.body.bulkItem;
    const bulkName = req.body.bulkName;
    const department = req.body.department;
    const targetDate = req.body.targetDate;
    const issuedBy = req.body.issuedBy;
    const issuedDate = req.body.issuedDate;
    const raisedBy = req.body.raisedBy;
    const designChgReq = req.body.designChgReq;
    const materialReq = req.body.materialReq;
    const issueDescription = req.body.issueDescription;
    const keyword1 = req.body.keyword1;
    const keyword2 = req.body.keyword2;
    const keyword3 = req.body.keyword3;
    const keyword4 = req.body.keyword4;
    if (!empty(projectID) && !empty(punchID)) {  
            punchlist.create({
                projectID: projectID,
                punchID: punchID,
                category:category,
                systemID:systemID,
                subsystem:subsystem,
                discipline:discipline,
                status:status,
                unit:unit,
                area:area,
                tagNumber:tagNumber,
                bulkItem:bulkItem,
                bulkName:bulkName,
                department:department,
                targetDate:targetDate,
                issuedBy:issuedBy,
                issuedDate:issuedDate,
                raisedBy:raisedBy,
                designChgReq:designChgReq,
                materialReq:materialReq,
                issueDescription:issueDescription,
                keyword1:keyword1,
                keyword2:keyword2,
                keyword3:keyword3,
                keyword4:keyword4
            })
                .then(result => {
                    res.json({result: result, error: null, data: null});
                })
                .catch(err => {
                    console.error(err);
                    res.json({result: false, error: err, data: null});
                });
    } else {
        res.json({result: false, error: null, data: null});
    }
});

function isEmpty(str) {
    if (typeof str == "undefined" || str == null || str == "") {
      return null;
    } else {
      return str;
    }
  }

router.post('/draftupdate', async (req, res, next) => {
    const projectID = req.body.projectID;
    const punchID = req.body.punchID;
    const category = req.body.category;
    const systemID = req.body.systemID;
    const subsystem = req.body.subsystem;
    const discipline = req.body.discipline;
    const status = req.body.status;
    const unit = req.body.unit;
    const area = req.body.area;
    const tagNumber = req.body.tagNumber;
    const bulkItem = req.body.bulkItem;
    const bulkName = req.body.bulkName;
    const department = req.body.department;
    const targetDate = req.body.targetDate;
    const issuedBy = req.body.issuedBy;
    const issuedDate = req.body.issuedDate;
    const raisedBy = req.body.raisedBy;
    const designChgReq = req.body.designChgReq;
    const materialReq = req.body.materialReq;
    const issueDescription = req.body.issueDescription;
    const keyword1 = req.body.keyword1;
    const keyword2 = req.body.keyword2;
    const keyword3 = req.body.keyword3;
    const keyword4 = req.body.keyword4;
    if (!empty(projectID) && !empty(punchID)) { 
         
            punchlist.update({
                projectID: isEmpty(projectID),
                punchID: isEmpty(punchID),
                category:isEmpty(category),
                systemID:isEmpty(systemID),
                subsystem:isEmpty(subsystem),
                discipline:isEmpty(discipline),
                status:isEmpty(status),
                unit:isEmpty(unit),
                area:isEmpty(area),
                tagNumber:isEmpty(tagNumber),
                bulkItem:isEmpty(bulkItem),
                bulkName:isEmpty(bulkName),
                department:isEmpty(department),
                targetDate:isEmpty(targetDate),
                issuedBy:isEmpty(issuedBy),
                issuedDate:isEmpty(issuedDate),
                raisedBy:isEmpty(raisedBy),
                designChgReq:isEmpty(designChgReq),
                materialReq:isEmpty(materialReq),
                issueDescription:isEmpty(issueDescription),
                keyword1:isEmpty(keyword1),
                keyword2:isEmpty(keyword2),
                keyword3:isEmpty(keyword3),
                keyword4:isEmpty(keyword4),
            }, {where: {projectID: projectID,punchID:punchID}})
                .then(result => {
                    res.json({result: result, error: null, data: null});
                })
                .catch(err => {
                    console.error(err);
                    res.json({result: false, error: err, data: null});
                });
    } else {
        res.json({result: false, error: null, data: null});
    }
});

router.post('/photos', async (req, res, next) => {
    let punchID = req.body.punchID;
    let punchStep = req.body.punchStep;
    let seq = req.body.seq;
    let localPath = req.body.localPath;
    let imagePath = req.body.imagePath;
    let uploaded= req.body.uploaded;
    let uploadDate = req.body.uploadDate;
    if (!empty(punchID) && !empty(seq)) {
        photos.create({
            punchID: punchID,
            punchStep:punchStep,
            seq:seq,
            localPath:localPath,
            imagePath:imagePath,
            uploaded:uploaded,
            uploadDate:uploadDate,
        }, 
        
        )
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

  router.post('/photosupdate', async (req, res, next) => {
    let punchID = req.body.punchID;
    let punchStep = req.body.punchStep;
    let seq = req.body.seq;
    let localPath = req.body.localPath;
    let imagePath = req.body.imagePath;
    let uploaded= req.body.uploaded;
    let uploadDate = req.body.uploadDate;
    if (!empty(punchID) && !empty(punchStep)) {
        photos.update({    
            punchID: punchID,
            punchStep:punchStep,
            seq:seq,
            localPath:localPath,
            imagePath:imagePath,
            uploaded:uploaded,
            uploadDate:uploadDate,
        }, {where: {punchID:punchID,imagePath:imagePath}}
        )
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




  router.post('/photospath', async (req, res, next) => {
    let punchID = req.body.punchID;
 
    photos.findAll({
        attributes: [ 'localPath','imagePath'],
        where: { punchID: punchID}
    })
    .then(result => {
        // res.json({"data":result, test: "test", error: null})
        console.log(result.body)
        res.json(result)
    })
    .catch(err => {
        console.error(err);
        res.json({error: null}
    )});
  });

  router.post('/drawingspath', async (req, res, next) => {
    let projectID = req.body.projectID;
    let systemID = req.body.systemID;
    let subsystem = req.body.subsystem;
    drawing.findAll({
        attributes: [ 'drawingNo','imagePath'],
        where: { projectID: projectID,systemID:systemID,subsystem:subsystem}
    })
    .then(result => {
        // res.json({"data":result, test: "test", error: null})
        console.log(result.body)
        res.json(result)
    })
    .catch(err => {
        console.error(err);
        res.json({error: null}
    )});
  });



router.get('/photosload', async (req, res, next) => {
    let imagePath = req.header('imagePath');
    // let userID = req.header("userID");
    fs.readFile(imagePath,              //파일 읽기
        function (err, data)
        {
            if (err) {
                console.log(err);
            }else{  
                res.writeHead(200, { "Context-Type": "image/png" });//보낼 헤더를 만듬
            res.write(data);
            // res.json(data) ;  //본문을 만들고
            res.end();  //클라이언트에게 응답을 전송한다
            console.log(data);}
          
        }
    );
    
  });

  router.get('/drawingsload', async (req, res, next) => {
    let imagePath = req.header('imagePath');
    // let userID = req.header("userID");
    fs.readFile(imagePath,              //파일 읽기
        function (err, data)
        {
            if (err) {
                console.log(err);
            }else{  
                res.writeHead(200, { "Context-Type": "image/png" });//보낼 헤더를 만듬
            res.write(data);
            // res.json(data) ;  //본문을 만들고
            res.end();  //클라이언트에게 응답을 전송한다
            console.log(data);}
          
        }
    );
    
  });



  router.post('/drawingspixel', async (req, res, next) => {
    let drawingNo = req.body.drawingNo;
    let punchID = req.body.punchID;
    let xPixel = req.body.xPixel;
    let yPixel = req.body.yPixel;
    if (!empty(punchID) && !empty(drawingNo)) {
        punchLoc.create({
            drawingNo:drawingNo,
            punchID:punchID,
            xPixel:xPixel,
            yPixel:yPixel,
        })
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

  router.post('/pixelload', async (req, res, next) => {
    let drawingNo = req.body.drawingNo;
    let punchID = req.body.punchID;
    if (!empty(drawingNo) && !empty(punchID)) {
        punchLoc.findAll({
            attributes: [ 'xPixel','yPixel'],
            where: { drawingNo: drawingNo,punchID:punchID}
        })
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


  router.post('/uploadphotos', async (req, res, next) => {
    let punchID = req.body.punchID;

    if (!empty(punchID)) {
      photos.update({uploaded:'1'}, {where: {punchID: punchID}})
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

  router.get('/loadphotos', (req, res) => {
    connection.query("select *	from punch.photos where uploaded=?;"
    ,['0'], function(error,results){
        if (error){
            console.log(error);
        }
        res.json(results);
    });

})

router.post('/loadpunch', async (req, res, next) => {
    let punchID = req.body.punchID;
    let userID = req.body.userID;
    connection.query("select *	from punch.punchlist where punchID=? and issuedBy=?;"
    ,[punchID,userID], function(error,results){
        if (error){
            console.log(error);
        }
        res.json(results);
    });
  });

  router.post('/uploadfile', upload.array("imgFile"), function(req, res, next) {
    let files = req.files
    let path = files.map(img =>img.originalname)
    // 4. 파일 정보
    let result = {
        filename : files.path,
        size : files.size,
    }
console.log(files);
    res.json(result);
})


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
    let userID = req.body.userID;
    let password = req.body.password;
    if (!empty(userID) && !empty(password)) {
        User.findOne({where: {userID: userID}})
        .then(results => {
            bcrypt.compare(password, results.password, (error, result) => {
                if(error){throw error}else{
                    if (result) {
                        req.session.loginData = {userID: userID, password: password};
                        req.session.save(error => {
                            if (error) console.log(error)
                        })
                        res.send(results);
                        
                        // res.json(result);
                    } else {
                        // res.json(result);
                        res.json({result: false, error: null, data: null});
                    }
                }
                
            })
        })
        .catch(err => {
            console.error(err);
            res.json({result: false, error: null, data: null});
        });
       
    } else {
        console.error(err);
        res.json({result: false, error: null, data: null});
    }
});

router.post('/register', async (req, res, next) => {
    let userID = req.body.userID;
    let password = req.body.password;
    let userName = req.body.userName;
    let email = req.body.email;
    const company = req.body.company;
    const authority = req.body.authority;
    const personalID = req.body.personalID;
    const department = req.body.department;
    const active = req.body.active;
    if (!empty(userID) && !empty(password)) {
        if (User.findOne({where: {userID: userID}}) == userID) {
            res.json({result: false, error: null, data: null});
            console.log(res.json);
        }



        bcrypt.hash(password, saltRounds, (error, hash) => {
            password = hash;
            User.create({
                userID: userID, 
                password: password,
                userName:userName,
                email:email,
                company:company,
                authority:authority,
                personalID:personalID,
                department:department,
                active:active,
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


router.post('/draftupdate', async (req, res, next) => {
    const projectID = req.body.projectID;
    const punchID = req.body.punchID;
    const category = req.body.category;
    const systemID = req.body.systemID;
    const subsystem = req.body.subsystem;
    const discipline = req.body.discipline;
    const status = req.body.status;
    const unit = req.body.unit;
    const area = req.body.area;
    const tagNumber = req.body.tagNumber;
    const bulkItem = req.body.bulkItem;
    const department = req.body.department;
    const targetDate = req.body.targetDate;
    const issuedBy = req.body.issuedBy;
    const raisedBy = req.body.raisedBy;
    const designChgReq = req.body.designChgReq;
    const materialReq = req.body.materialReq;
    const issueDescription = req.body.issueDescription;
    const keyword1 = req.body.keyword1;
    const keyword2 = req.body.keyword2;
    const keyword3 = req.body.keyword3;
    const keyword4 = req.body.keyword4;

    if (!empty(projectID) && !empty(punchID)) {  
            punchlist.update({
                projectID: projectID,
                punchID: punchID,
                category:category,
                systemID:systemID,
                subsystem:subsystem,
                discipline:discipline,
                status:status,
                unit:unit,
                area:area,
                tagNumber:tagNumber,
                bulkItem:bulkItem,
                department:department,
                targetDate:targetDate,
                issuedBy:issuedBy,
                raisedBy:raisedBy,
                designChgReq:designChgReq,
                materialReq:materialReq,
                issueDescription:issueDescription,
                keyword1:keyword1,
                keyword2:keyword2,
                keyword3:keyword3,
                keyword4:keyword4
            }, {where: {projectID: projectID,punchID:punchID}})
                .then(result => {
                    res.json({result: result, error: null, data: null});
                })
                .catch(err => {
                    console.error(err);
                    res.json({result: false, error: err, data: null});
                });
    } else {
        res.json({result: false, error: null, data: null});
    }
});


router.post('/update', async (req, res, next) => {
    let userID = req.body.userID;
    let password = req.body.password;
    let userName = req.body.userName;
    let email = req.body.email;
    const company = req.body.company;
    const authority = req.body.authority;
    const personalID = req.body.personalID;
    const department = req.body.department;

    if (!empty(userID) && !empty(password)) {
        bcrypt.hash(password, saltRounds, (error, hash) => {
            password = hash;
            User.update({
                password: password,
                email:email,
                company:company,
                userName:userName,
                authority:authority,
                personalID:personalID,
                department:department,}, {where: {userID: userID}})
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                console.error(err);
                res.json({result: false, error: null, data: null});
            });
        })
    } else {
        res.json({result: false, error: null, data: null});
    }
});

router.post('/delete', async (req, res, next) => {
    let projectID = req.body.projectID;
    let punchID = req.body.punchID;
    if (!empty(projectID)&&!empty(punchID)) {
        punchlist.destroy({where: {projectID: projectID,punchID:punchID}})
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

router.post('/deletephotos', async (req, res, next) => {
    let punchID = req.body.punchID;
    let seq = parseInt(req.body.seq);
    if (!empty(punchID)&&!empty(seq)) {
        photos.destroy({where: {punchID: punchID,seq:seq}})
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