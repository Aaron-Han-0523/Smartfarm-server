//자주사용하는 라이브러리
let express = require("express");
let bodyParser = require("body-parser"); //body의 json을 파싱해주는 모듈
let dateFormat = require("dateformat"); //날짜형식을 원하는 형태로 바꿔주는 모듈
let empty = require("is-empty"); //빈값 체크 모듈 *.주의:0도 empty로 판단함
let router = express.Router();

//비밀번호 암호화
const bcrypt = require("bcrypt");
const saltRounds = 10;

//모튤
const stringify = require("json-stringify-pretty-compact"); //json 값을 문자열로 (보기좋게)변환해주는 모듈
var resMQTT = require('../models/query/mqtt.js')

//모델
const {
  User,
  Trends,
  Motors
} = require("../models");
const {
  Sites
} = require("../models");
const {
  Sensors
} = require("../models");
const {
  Cctvs
} = require("../models");
const {
  Events
} = require("../models");
const {
  Pumps
} = require("../models");
const {
  Valves
} = require("../models");
const {
  Fcmtoken
} = require("../models");
const {
  Actuators
} = require("../models");

router.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
router.use(bodyParser.json());

router.get("/loginCheck", (req, res) => {
  if (req.session.loginData) {
    res.send({
      loggedIn: true,
      loginData: req.session.loginData,
    });
  } else {
    res.send({
      loggedIn: false,
    });
  }
});

/**
[REST API - 사용자]
 */

// [계정 생성] EW-RUR-001
router.post("/account", async (req, res, next) => {
  let uid = req.body.uid;
  let password = req.body.password;
  let sid = req.body.sid_base;

  if (!empty(uid) && !empty(password)) {
    bcrypt.hash(password, saltRounds, (error, hash) => {
      password = hash;
      User.create({
          uid: uid,
          password: password,
          sid: sid,
        })
        .then((result) => {
          res.json({
            result: result,
            error: null,
            data: null,
          });
        })
        .catch((err) => {
          console.error(err);
          res.json({
            result: false,
            error: err,
            data: null,
          });
        });
    });
  } else {
    res.json({
      result: false,
      error: null,
      data: null,
    });
  }
});

// [계정 조회] EW-RUR-002
router.get("/account", async (req, res, next) => {
  User.findAll({})
    .then((result) => {
      // res.json({"data":result, test: "test", error: null})
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.json({
        error: null,
      });
    });
});

// [로그인] EW-RUR-003
router.post("/login", (req, res, next) => {
  let userId = req.body.uid;
  let password = req.body.password;
  if (!empty(userId) && !empty(password)) {
    User.findOne({
        where: {
          uid: userId,
        },
      })
      .then((results) => {
        if (!results) {
          res.json({
            result: false,
            error: null,
            data: null,
          });
          console.log("아이디가 없음");
        }
        bcrypt.compare(password, results.password, (error, result) => {
          if (result) {
            req.session.loginData = userId;
            req.session.save(() => {
              console.log("/loginout 라우팅 함수호출 됨");
              console.log(req.session.loginData);
              resMQTT(userId);
              res.json({
                results,
                result: true,
              });

              console.log(result);
            });
          } else {
            res.json({
              result: false,
              error: null,
              data: null,
            });
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    res.json({
      result: false,
      error: null,
      data: null,
    });
  }
});

// [로그아웃] EW-RUR-004
router.post("/logout", (req, res) => {
  console.log("/loginout 라우팅 함수호출 됨");
  console.log(req.session.loginData);
  console.log(req.session);
  // console.log('@@@@@@@@@@@@@@',req);
  if (req.session.loginData) {
    console.log("로그아웃 처리");
    req.session.destroy(function (err) {
      if (err) {
        console.log("세션 삭제시 에러");
      }
      console.log("세션 삭제 성공");
      res.json({
        result: true,
      });
    }); //세션정보 삭제
  } else {
    console.log("로긴 안되어 있음");
    res.json({
      result: false,
      error: null,
      data: null,
    });
  }
});

// [계정삭제]  EW-RUR-005
router.delete("/:userId", async (req, res, next) => {
  if (!empty(req.params.userId)) {
    User.destroy({
        where: {
          uid: req.params.userId,
        },
      })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    res.json({
      result: false,
      error: null,
      data: null,
    });
  }
});

//[+ 추가 - 사용자 아이디 찾기]
router.get("/:userId", async (req, res, next) => {
  User.findAll({
      where: {
        uid: req.params.userId,
      },
    })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.json({
        error: null,
      });
    });
});

// [계정 정보 수정] EW-RUR-006
router.put("/:userId", async (req, res, next) => {
  let uid = req.body.uid;
  let sid = req.body.sid_base;
  if (!empty(req.params.userId)) {
    User.update({
        uid: uid,
        sid: sid,
      }, {
        where: {
          uid: req.params.userId,
        },
      })
      .then((result) => {
        res.json({
          result: result,
          error: null,
          data: null,
        });
      })
      .catch((err) => {
        console.error(err);
        res.json({
          result: false,
          error: err,
          data: null,
        });
      });
  } else {
    res.json({
      result: false,
      error: null,
      data: null,
    });
  }
});

// [계정 비밀번호 변경] EW-RUR-007
router.put("/:userId/password", async (req, res, next) => {
  let password = req.body.password;
  bcrypt.hash(password, saltRounds, (error, hash) => {
    password = hash;
    User.update({
        password: password,
      }, {
        where: {
          uid: req.params.userId,
        },
      })
      .then((result) => {
        res.json({
          result: result,
          error: null,
          data: null,
        });
      })
      .catch((err) => {
        console.error(err);
        res.json({
          result: false,
          error: err,
          data: null,
        });
      });
  });
});

// [추가 - 현재 비밀번호 확인]
router.post("/login/:userId/checkpw", async (req, res, next) => {
  let password = req.body.password;
  if (!empty(password)) {
    User.findOne({
        where: {
          uid: req.params.userId,
        },
      })
      .then((results) => {
        bcrypt.compare(password, results.password, (error, result) => {
          if (result) {
            req.session.loginData = {
              // uid: uid,
              password: password,
            };
            req.session.save((error) => {
              if (error) console.log(error);
            });
            res.json({
              results,
              result: true,
            });
          } else {
            res.json({
              result: 'false1', // 비밀번호가 다를 경우
              error: null,
              data: null,
            });
          }
        });
      })
      .catch((err) => {
        // console.error(err);
        res.json({
          result: 'false2',
          error: null,
          data: null,
        });
      });
  } else {
    res.json({
      result: false,
      error: null,
      data: null,
    });
  }
});

// [사이트 생성] EW-RUR-008
router.post("/:userId/sites", async (req, res, next) => {
  let sid = req.body.sid;
  //   let uid = req.body.uid;
  let site_name = req.body.site_name;
  let site_address = req.body.site_address;
  let site_gps_latitude = req.body.site_gps_latitude;
  let site_gps_longitude = req.body.site_gps_longitude;
  let site_th_sensor_count = req.body.site_th_sensor_count;
  let site_soil_sensor_count = req.body.site_soil_sensor_count;
  let site_side_motor_count = req.body.site_side_motor_count;
  let site_top_motor_count = req.body.site_top_motor_count;
  let site_actuator_count = req.body.site_actuator_count;
  let site_pump_count = req.body.site_pump_count;
  let site_valve_count = req.body.site_valve_count;
  let site_cctv_count = req.body.site_cctv_count;
  let site_set_alarm_enable = req.body.site_set_alarm_enable;
  let site_set_alarm_high = req.body.site_set_alarm_high;
  let site_set_alarm_low = req.body.site_set_alarm_low;
  let site_set_alarm_timer = req.body.site_set_alarm_timer;

  if (!empty(req.params.userId)) {
    Sites.create({
        sid: sid,
        uid: req.params.userId,
        site_name: site_name,
        site_address: site_address,
        site_gps_latitude: site_gps_latitude,
        site_gps_longitude: site_gps_longitude,
        site_th_sensor_count: site_th_sensor_count,
        site_soil_sensor_count: site_soil_sensor_count,
        site_side_motor_count: site_side_motor_count,
        site_top_motor_count: site_top_motor_count,
        site_actuator_count: site_actuator_count,
        site_pump_count: site_pump_count,
        site_valve_count: site_valve_count,
        site_cctv_count: site_cctv_count,
        site_set_alarm_enable: site_set_alarm_enable,
        site_set_alarm_high: site_set_alarm_high,
        site_set_alarm_low: site_set_alarm_low,
        site_set_alarm_timer: site_set_alarm_timer,
      })
      .then((result) => {
        res.json({
          result: result,
          error: null,
          data: null,
        });
      })
      .catch((err) => {
        console.error(err);
        res.json({
          result: false,
          error: err,
          data: null,
        });
      });
  } else {
    res.json({
      result: false,
      error: null,
      data: null,
    });
  }
});

// [사이트 리스트 조회] EW-RUR-009
router.get("/:userId/sites", async (req, res, next) => {
  Sites.findAll({
      where: {
        uid: req.params.userId,
        // sid: req.params.siteId,
      },
    }).then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.json({
        error: null,
      });
    });
});

// [추가] site_name으로 siteId찾기 
router.post("/:userId/sites/:siteName", async (req, res, next) => {
  Sites.findAll({
      where: {
        uid: req.params.userId,
        site_name: req.params.siteName
        // sid: req.params.siteId,
      },
    }).then((result) => {
      res.json(result[0]["sid"]);
    })
    .catch((err) => {
      console.error(err);
      res.json({
        error: null,
      });
    });
});

// [사이트 구성 조회] EW-RUR-010
router.get("/:userId/sites/:siteId", async (req, res, next) => {
  Sites.findAll({
      where: {
        uid: req.params.userId,
        sid: req.params.siteId,
      },
    }).then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.json({
        error: null,
      });
    });
});

// [사이트 삭제] EW-RUR-011
router.delete("/:userId/sites/:siteId", async (req, res, next) => {
  if (!empty(req.params.userId)) {
    Sites.destroy({
        where: {
          uid: req.params.userId,
          sid: req.params.siteId,
        },
      })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    res.json({
      result: false,
      error: null,
      data: null,
    });
  }
});

// [사이트 수정] EW-RUR-012
router.put("/:userId/sites/:siteId", async (req, res, next) => {
  let site_name = req.body.site_name;
  let site_address = req.body.site_address;
  let site_gps_latitude = req.body.site_gps_latitude;
  let site_gps_longitude = req.body.site_gps_longitude;
  let site_th_sensor_count = req.body.site_th_sensor_count;
  let site_soil_sensor_count = req.body.site_soil_sensor_count;
  let site_side_motor_count = req.body.site_side_motor_count;
  let site_top_motor_count = req.body.site_top_motor_count;
  let site_actuator_count = req.body.site_actuator_count;
  let site_pump_count = req.body.site_pump_count;
  let site_valve_count = req.body.site_valve_count;
  let site_cctv_count = req.body.site_cctv_count;
  let site_set_alarm_enable = req.body.site_set_alarm_enable;
  let site_set_alarm_high = req.body.site_set_alarm_high;
  let site_set_alarm_low = req.body.site_set_alarm_low;
  let site_set_alarm_timer = req.body.site_set_alarm_timer;
  if (!empty(req.params.siteId)) {
    Sites.update({
        site_name: site_name,
        site_address: site_address,
        site_gps_latitude: site_gps_latitude,
        site_gps_longitude: site_gps_longitude,
        site_th_sensor_count: site_th_sensor_count,
        site_soil_sensor_count: site_soil_sensor_count,
        site_side_motor_count: site_side_motor_count,
        site_top_motor_count: site_top_motor_count,
        site_actuator_count: site_actuator_count,
        site_pump_count: site_pump_count,
        site_valve_count: site_valve_count,
        site_cctv_count: site_cctv_count,
        site_set_alarm_enable: site_set_alarm_enable,
        site_set_alarm_high: site_set_alarm_high,
        site_set_alarm_low: site_set_alarm_low,
        site_set_alarm_timer: site_set_alarm_timer,
      }, {
        where: {
          uid: req.params.userId,
          sid: req.params.siteId,
        },
      })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.error(err);
        res.json({
          result: false,
          error: err,
          data: null,
        });
      });
  } else {
    res.json({
      result: false,
      error: null,
      data: null,
    });
  }
});


/**
[REST API - 모니터링]
 */

// [전체 센서 정보 조회] EW-RMR-001
router.get("/:userId/site/:siteId/sensors", async (req, res, next) => {
  Sensors.findAll({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.json({
        error: null,
      });
    });
});

// [센서 정보 조회] EW-RMR-002
router.get(
  "/:userId/site/:siteId/sensors/:sensorId",
  async (req, res, next) => {
    Sensors.findAll({
        where: {
          uid: req.params.userId,
          sid: req.params.siteId,
          sensor_id: req.params.sensorId,
        },
      })
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
);

// [센서 트렌드 조회] EW-RMR-003
router.get(
  "/:userId/site/:siteId/sensors/:sensorId/trends",
  async (req, res, next) => {
    Trends.findAll({
        attributes: ["time_stamp", "value"],
        where: {
          uid: req.params.userId,
          sid: req.params.siteId,
          sensor_id: req.params.sensorId,
        },
      })
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
);

// [추가] innerTemps 조회 
router.get(
  "/:userId/site/:siteId/innerTemps",
  async (req, res, next) => {
    Trends.findAll({
        attributes: ["time_stamp", "value"],
        where: {
          uid: req.params.userId,
          sid: req.params.siteId,
          sensor_id: 'temp_1',
        },
        order: [
          ["time_stamp", "DESC"]
        ],
        limit: 120,
      })
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
);

/**
[REST API - 제어]
 */

// [측창 개폐기 제어 상태 조회] EW-RCR-001
router.get(
  "/:userId/site/:siteId/controls/side/motors",

  async (req, res, next) => {
    Motors.findAll({
        where: {
          uid: req.params.userId,
          sid: req.params.siteId,
          motor_type: "side",
        },
      })
      .then((result) => {
        res.json({
          data: result,
        });
      })
      .catch((err) => {
        console.error(err);
        res.json({
          error: null,
        });
      });
  }
);

// [측창 개폐기 전체 제어 설정] EW-RCR-002
router.put(
  "/:userId/site/:siteId/controls/side/motors",

  async (req, res, next) => {
    let motor_type = req.body.motor_type;
    let motor_name = req.body.motor_name;
    let motor_action = req.body.motor_action;
    Motors.update({
        motor_type: motor_type,
        motor_name: motor_name,
        motor_action: motor_action,
      }, {
        where: {
          uid: req.params.userId,
          sid: req.params.siteId,
          motor_type: "side",
        },
      })
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
);

// [측창 개폐기 개별 제어 설정] EW-RCR-003
router.put(
  "/:userId/site/:siteId/controls/side/motors/:motorId",
  async (req, res, next) => {
    // let motor_type = req.body.motor_type;
    // let motor_name = req.body.motor_name;
    let motor_action = req.body.motor_action;
    Motors.update({
        // motor_type: motor_type,
        // motor_name: motor_name,
        motor_action: motor_action,
      }, {
        where: {
          uid: req.params.userId,
          sid: req.params.siteId,
          motor_id: req.params.motorId,
          motor_type: "side",
        },
      })
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
);

// [천창 개폐기 제어 상태 조회] EW-RCR-004
router.get(
  "/:userId/site/:siteId/controls/top/motors",
  async (req, res, next) => {
    if (!empty(req.params.userId)) {
      Motors.findAll({
          where: {
            uid: req.params.userId,
            sid: req.params.siteId,
            motor_type: "top",
          },
        })
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
    } else {
      res.json(err);
    }
  }
);

//[천창 개폐기 전체 제어 설정] EW-RCR-005
router.put(
  "/:userId/site/:siteId/controls/top/motors",
  async (req, res, next) => {
    // let motor_name = req.body.motor_name;
    let motor_action = req.body.motor_action
    if (!empty(req.params.siteId)) {
      Motors.update({
          // motor_name: motor_name,
          motor_action: motor_action,
          // motor_id: req.params.motorId
        }, {
          where: {
            uid: req.params.userId,
            sid: req.params.siteId,
            motor_type: "top",
          },
        })
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          console.error(err);
          res.json({
            result: false,
            error: err,
            data: null,
          });
        });
    } else {
      res.json({
        result: false,
        error: null,
        data: null,
      });
    }
  }
);

// [천창 개폐기 개별 제어 설정] EW-RCR-006
router.put(
  "/:userId/site/:siteId/controls/top/motors/:motorId",
  async (req, res, next) => {
    // let motor_name = req.body.motor_name;
    let motor_action = req.body.motor_action
    if (!empty(req.params.motorId)) {
      Motors.update({
          // motor_type: motor_type,
          motor_action: motor_action,
          // motor_name: motor_name,
          // motor_id: req.params.motorId,
        }, {
          where: {
            uid: req.params.userId,
            sid: req.params.siteId,
            motor_id: req.params.motorId,
            motor_type: "top",
          },
        })
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          console.error(err);
          res.json({
            result: false,
            error: err,
            data: null,
          });
        });
    } else {
      res.json({
        result: false,
        error: null,
        data: null,
      });
    }
  }
);

// motor - etc control
router.get(
  "/:userId/site/:siteId/controls/etc/motors",
  async (req, res, next) => {
    if (!empty(req.params.userId)) {
      Motors.findAll({
          where: {
            uid: req.params.userId,
            sid: req.params.siteId,
            motor_type: "etc",
          },
        })
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
    } else {
      res.json(err);
    }
  }
);

router.put(
  "/:userId/site/:siteId/controls/etc/motors",

  async (req, res, next) => {
    let motor_type = req.body.motor_type;
    let motor_name = req.body.motor_name;
    let motor_action = req.body.motor_action;
    Motors.update({
        motor_type: motor_type,
        motor_name: motor_name,
        motor_action: motor_action,
      }, {
        where: {
          uid: req.params.userId,
          sid: req.params.siteId,
          motor_type: "etc",
        },
      })
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
);

router.put(
  "/:userId/site/:siteId/controls/etc/motors/:motorId",
  async (req, res, next) => {
    let motor_type = req.body.motor_type;
    let motor_name = req.body.motor_name;
    let motor_action = req.body.motor_action;
    Motors.update({
        motor_type: motor_type,
        motor_name: motor_name,
        motor_action: motor_action,
      }, {
        where: {
          uid: req.params.userId,
          sid: req.params.siteId,
          motor_id: req.params.motorId,
          motor_type: "etc",
        },
      })
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
);

// [기타 제어 상태 조회] EW-RCR-007
router.get(
  "/:userId/site/:siteId/controls/actuators",
  async (req, res, next) => {
    Actuators.findAll({
        where: {
          uid: req.params.userId,
          sid: req.params.siteId,
        },
      })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
        res.json({
          error: null,
        });
      });
  }
);

// [개별 기타 제어 설정] EW-RCR-008
router.put(
  "/:userId/site/:siteId/controls/actuators/:actuatorId",
  async (req, res, next) => {
    console.log('act1')
    let actuator_action = req.body.actuator_action;
    // let actuator_name = req.body.actuator_name;
    if (!empty(req.params.actuatorId)) {
      Actuators.update({
          actuator_action: actuator_action,
          // actuator_name: actuator_name,
        }, {
          where: {
            uid: req.params.userId,
            sid: req.params.siteId,
            motor_id: req.params.actuatorId,
          },
        })
        .then((result) => {
          res.json(result);
          console.log('act2' + result)
        })
        .catch((err) => {
          console.error(err);
          res.json({
            result: false,
            error: err,
            data: null,
          });
        });
    } else {
      res.json({
        result: false,
        error: null,
        data: null,
      });
    }
  }
);

// [관수 펌프 제어 상태 조회] EW-RCR-009
router.get("/:userId/site/:siteId/controls/pumps", async (req, res, next) => {
  Pumps.findAll({
      where: {
        uid: req.params.userId,
        sid: req.params.siteId,
      },
    })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: null,
      });
    });
});

// [관수 펌프 개별 제어 설정] EW-RCR-010
router.put(
  "/:userId/site/:siteId/controls/pumps/:pumpId",
  async (req, res, next) => {
    let pump_action = req.body.pump_action;
    let pump_name = req.body.pump_name;
    if (!empty(req.params.pumpId)) {
      Pumps.update({
          pump_action: pump_action,
          pump_name: pump_name,
        }, {
          where: {
            uid: req.params.userId,
            sid: req.params.siteId,
            pump_id: req.params.pumpId,
          },
        })
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          console.error(err);
          res.json({
            result: false,
            error: err,
            data: null,
          });
        });
    } else {
      res.json({
        result: false,
        error: null,
        data: null,
      });
    }
  }
);


/**
INSERT INTO valves(valve_id, sid, uid, valve_action, valve_name)
VALUE('valve_1', 'sid', 'test', '0', '밸브 (#1)');
INSERT INTO valves(valve_id, sid, uid, valve_action, valve_name)
VALUE('valve_2', 'sid', 'test', '0', '밸브 (#2)');
select * from valves;
 */

// [밸브 제어 상태 조회] EW-RCR-011
router.get("/:userId/site/:siteId/controls/valves", async (req, res, next) => {
  Valves.findAll({
      where: {
        uid: req.params.userId,
        sid: req.params.siteId,
      },
    })
    .then((result) => {
      // res.json({"data":result, test: "test", error: null})
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.json({
        error: null,
      });
    });
});

// [밸프 개별 제어 설정] EW-RCR-012
router.put(
  "/:userId/site/:siteId/controls/valves/:valvesId",
  async (req, res, next) => {
    let valve_id = req.body.valve_id;
    let valve_action = req.body.valve_action;
    let valve_name = req.body.valve_name;
    if (!empty(req.params.valvesId)) {
      Valves.update({
          valve_id: valve_id,
          valve_action: valve_action,
          valve_name: valve_name,
        }, {
          where: {
            uid: req.params.userId,
            sid: req.params.siteId,
            valve_id: req.params.valvesId,
          },
        })
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          console.error(err);
          res.json({
            result: false,
            error: err,
            data: null,
          });
        });
    } else {
      res.json({
        result: false,
        error: null,
        data: null,
      });
    }
  }
);

/**
INSERT INTO cctvs(cctv_id, sid, uid, cctv_type, cctv_name, cctv_url)
VALUE('cctv_1', 'sid', 'test', '0', 'cctv1', 'rtsp://admin:dbslzhs123%21%40%23@14.46.231.48:60554/Streaming/Channels/101');
INSERT INTO cctvs(cctv_id, sid, uid, cctv_type, cctv_name, cctv_url)
VALUE('cctv_2', 'sid', 'test', '0', 'cctv2', 'https://flutter.github.io/assets-for-api-docs/assets/videos/bee.mp4');
INSERT INTO cctvs(cctv_id, sid, uid, cctv_type, cctv_name, cctv_url)
VALUE('cctv_3', 'sid', 'test', '0', 'cctv3', 'https://assets.mixkit.co/videos/preview/mixkit-daytime-city-traffic-aerial-view-56-large.mp4');
delete from cctvs where cctv_id = 'cctv3';
select * from cctvs;
 */

// [CCTV 정보 조회] EW-RTR-001
router.get("/:userId/site/:siteId/cctvs", async (req, res, next) => {
  Cctvs.findAll({
      where: {
        uid: req.params.userId,
        sid: req.params.siteId,
      },
    })
    .then((result) => {
      // res.json({"data":result, test: "test", error: null})
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.json({
        error: null,
      });
    });
});

// [개별 CCTV 리셋] EW-RTR-002
router.put(
  "/:userId/site/:siteId/cctvs/:cctvId/reset",
  async (req, res, next) => {
    let cctv_id = req.body.cctv_id;
    let cctv_type = req.body.cctv_type;
    let cctv_name = req.body.cctv_name;
    let cctv_url = req.body.cctv_url;
    if (!empty(req.params.cctvId)) {
      Cctvs.update({
          cctv_id: cctv_id,
          cctv_type: cctv_type,
          cctv_name: cctv_name,
          cctv_url: cctv_url,
        }, {
          where: {
            uid: req.params.userId,
            sid: req.params.siteId,
            cctv_id: req.params.cctvId,
          },
        })
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          console.error(err);
          res.json({
            result: false,
            error: err,
            data: null,
          });
        });
    } else {
      res.json({
        result: false,
        error: null,
        data: null,
      });
    }
  }
);

/**
 * INSERT INTO events(sid, uid, time_stamp, event_saverity, alarm_code)
 VALUE('sid', 'test', 'time_stamp', 'event_saverity', 'alarm_code');
 *select * from events;
 */

// [사이트 사용자 설정 정보 조회] EW-RSR-001
router.get("/:userId/site/:siteId/settings", async (req, res, next) => {
  Events.findAll({
      where: {
        uid: req.params.userId,
        sid: req.params.siteId,
      },
    })
    .then((result) => {
      // res.json({"data":result, test: "test", error: null})
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.json({
        error: null,
      });
    });
});

// [사이트 사용자 설정] EW-RSR-002
router.put("/:userId/site/:siteId/settings", async (req, res, next) => {
  let site_set_alarm_enable = req.body.site_set_alarm_enable;
  let site_set_alarm_high = req.body.site_set_alarm_high;
  let site_set_alarm_low = req.body.site_set_alarm_low;
  let site_set_alarm_timer = req.body.site_set_alarm_timer;
  if (!empty(req.params.siteId)) {
    Sites.update({
        site_set_alarm_enable: site_set_alarm_enable,
        site_set_alarm_high: site_set_alarm_high,
        site_set_alarm_low: site_set_alarm_low,
        site_set_alarm_timer: site_set_alarm_timer,
      }, {
        where: {
          uid: req.params.userId,
          sid: req.params.siteId,
        },
      })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.error(err);
        res.json({
          result: false,
          error: err,
          data: null,
        });
      });
  } else {
    res.json({
      result: false,
      error: null,
      data: null,
    });
  }
});

// [추가] 푸시알림 fcm
router.put("/:userId/pushAlarm", async (req, res, next) => {
  let fcmtoken = req.body.fcmtoken;
  if (!empty(req.params.userId)) {
    User.update({
        fcmtoken: fcmtoken,
      }, {
        where: {
          uid: req.params.userId,
        },
      })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.error(err);
        res.json({
          result: false,
          error: err,
          data: null,
        });
      });
  } else {
    res.json({
      result: false,
      error: null,
      data: null,
    });
  }
});


module.exports = router;