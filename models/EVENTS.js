module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "events", {
      sid: {
        type: DataTypes.STRING(20),
      },
      uid: {
        type: DataTypes.STRING(20),
      },
      time_stamp: {
        type: DataTypes.STRING(255),
      },
      event_saverity: {
        type: DataTypes.STRING(255),
      },
      alarm_code: {
        type: DataTypes.STRING(255),
      },
    }, {
      createdAt: false,
      updatedAt: false,
      tableName: "events",
    }
  );
};

//https://loy124.tistory.com/373
//https://devlog-wjdrbs96.tistory.com/221