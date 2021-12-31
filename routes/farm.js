let express = require("express");
let bodyParser = require("body-parser"); //body의 json을 파싱해주는 모듈
let dateFormat = require("dateformat"); //날짜형식을 원하는 형태로 바꿔주는 모듈
let empty = require("is-empty"); //빈값 체크 모듈 *.주의:0도 empty로 판단함

const bcrypt = require("bcrypt");
const saltRounds = 10;

const stringify = require("json-stringify-pretty-compact"); //json 값을 문자열로 (보기좋게)변환해주는 모듈

let router = express.Router();

const { User, Trends, Motors } = require("../models");
const { Sites } = require("../models");
const { Sensors } = require("../models");
const { Cctvs } = require("../models");
const { Events } = require("../models");
const { Pumps } = require("../models");
const { Valves } = require("../models");

// testimport DB // king

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

router.post("/login", async (req, res, next) => {
  let uid = req.body.uid;
  let password = req.body.password;
  if (!empty(uid) && !empty(password)) {
    User.findOne({
      where: {
        uid: uid,
      },
    })
      .then((results) => {
        bcrypt.compare(password, results.password, (error, result) => {
          if (result) {
            req.session.loginData = {
              uid: uid,
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

router.get("/:userId", async (req, res, next) => {
  User.findAll({
    where: {
      uid: req.params.userId,
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

router.put("/:userId", async (req, res, next) => {
  let uid = req.body.uid;
  let sid = req.body.sid_base;
  if (!empty(req.params.userId)) {
    User.update(
      {
        uid: uid,
        sid: sid,
      },
      {
        where: {
          uid: req.params.userId,
        },
      }
    )
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

router.put("/:userId/password", async (req, res, next) => {
  let password = req.body.password;
  bcrypt.hash(password, saltRounds, (error, hash) => {
    password = hash;
    User.update(
      {
        password: password,
      },
      {
        where: {
          uid: req.params.userId,
        },
      }
    )
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

router.get("/:userId/sites", async (req, res, next) => {
  Sites.findAll({})
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

router.get("/:userId/sites/:siteId", async (req, res, next) => {
  Sites.findAll({
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
    Sites.update(
      {
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
      },
      {
        where: {
          uid: req.params.userId,
          sid: req.params.siteId,
        },
      }
    )
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

router.get("/:userId/site/:siteId/sensors", async (req, res, next) => {
  Sensors.findAll({})
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

// walter

//////////walter*

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
        res.json({ data: result, test: "test", error: null });
      })
      .catch((err) => {
        console.error(err);
        res.json({
          error: null,
        });
      });
  }
);

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
        res.json({ data: result, test: "test", error: null });
      })
      .catch((err) => {
        console.error(err);
        res.json({
          error: null,
        });
      });
  }
);

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
        res.json({ data: result, test: "test", error: null });
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
  "/:userId/site/:siteId/controls/side/motors",

  async (req, res, next) => {
    let motor_type = req.body.motor_type;
    let motor_name = req.body.motor_name;
    Motors.update(
      {
        motor_type: motor_type,
        motor_name: motor_name,
      },
      {
        where: {
          uid: req.params.userId,
          sid: req.params.siteId,
          motor_type: "side",
        },
      }
    )
      .then((result) => {
        res.json({ data: result, test: "test", error: null });
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
  "/:userId/site/:siteId/controls/side/motors/:motorId",
  async (req, res, next) => {
    let motor_type = req.body.motor_type;
    let motor_name = req.body.motor_name;
    Motors.update(
      {
        motor_type: motor_type,
        motor_name: motor_name,
      },
      {
        where: {
          uid: req.params.userId,
          sid: req.params.siteId,
          motor_id: req.params.motorId,
          motor_type: "side",
        },
      }
    )
      .then((result) => {
        res.json({ data: result, test: "test", error: null });
      })
      .catch((err) => {
        console.error(err);
        res.json({
          error: null,
        });
      });
  }
);

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
          res.json({ data: result, test: "test", error: null });
        })
        .catch((err) => {
          console.error(err);
          res.json({
            error: null,
          });
        });
    }else{
      res.json(err);
    }
 
  }
);

// sherry

/**
 * INSERT INTO valves(valve_id, sid, uid, valve_type, valve_name)
 VALUE('valve1', 'sid', 'test', '0', 'test1');
 * select * from valves;
 */

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

router.put(
  "/:userId/site/:siteId/controls/valves/:valvesId",
  async (req, res, next) => {
    let valve_id = req.body.valve_id;
    let valve_type = req.body.valve_type;
    let valve_name = req.body.valve_name;
    if (!empty(req.params.valvesId)) {
      Valves.update(
        {
          valve_id: valve_id,
          valve_type: valve_type,
          valve_name: valve_name,
        },
        {
          where: {
            uid: req.params.userId,
            sid: req.params.siteId,
            valve_id: req.params.valvesId,
          },
        }
      )
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
 * INSERT INTO cctvs(cctv_id, sid, uid, cctv_type, cctv_name, cctv_url)
 VALUE('cctv1', 'sid', 'test', '0', 'cctv1', 'https://naver.com');
 * select * from cctvs;
 */

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

router.put(
  "/:userId/site/:siteId/cctvs/:cctvId/reset",
  async (req, res, next) => {
    let cctv_id = req.body.cctv_id;
    let cctv_type = req.body.cctv_type;
    let cctv_name = req.body.cctv_name;
    let cctv_url = req.body.cctv_url;
    if (!empty(req.params.cctvId)) {
      Cctvs.update(
        {
          cctv_id: cctv_id,
          cctv_type: cctv_type,
          cctv_name: cctv_name,
          cctv_url: cctv_url,
        },
        {
          where: {
            uid: req.params.userId,
            sid: req.params.siteId,
            cctv_id: req.params.cctvId,
          },
        }
      )
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

router.put("/:userId/site/:siteId/settings", async (req, res, next) => {
  let time_stamp = req.body.time_stamp;
  let event_saverity = req.body.event_saverity;
  let alarm_code = req.body.alarm_code;
  if (!empty(req.params.siteId)) {
    Events.update(
      {
        time_stamp: time_stamp,
        event_saverity: event_saverity,
        alarm_code: alarm_code,
      },
      {
        where: {
          uid: req.params.userId,
          sid: req.params.siteId,
        },
      }
    )
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
