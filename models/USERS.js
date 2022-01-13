module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "USERS", {
      uid: {
        type: DataTypes.STRING(20),
        primaryKey: true,
      },
      password: {
        type: DataTypes.STRING(255),
      },
      sid_base: {
        type: DataTypes.STRING(20),
      },
      fcmtoken: {
        type: DataTypes.STRING(255),
      },
    }, {
      createdAt: false,
      updatedAt: false,
      tableName: "USERS",
    }
  );
};

//https://loy124.tistory.com/373
//https://devlog-wjdrbs96.tistory.com/221