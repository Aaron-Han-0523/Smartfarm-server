module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "sensors", {
      sensor_id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
      },
      sid: {
        type: DataTypes.STRING(20),
        primaryKey: true,
      },
      uid: {
        type: DataTypes.STRING(20),
        primaryKey: true,
      },
      sensor_type: {
        type: DataTypes.STRING(255),
      },
      sensor_name: {
        type: DataTypes.STRING(255),
      },
    }, {
      createdAt: false,
      updatedAt: false,
      tableName: "sensors",
    }
  );
};

//https://loy124.tistory.com/373
//https://devlog-wjdrbs96.tistory.com/221