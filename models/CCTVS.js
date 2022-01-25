module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "cctvs", {
      cctv_id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
      },
      sid: {
        type: DataTypes.STRING(20),
      },
      uid: {
        type: DataTypes.STRING(20),
      },
      cctv_type: {
        type: DataTypes.STRING(255),
      },
      cctv_name: {
        type: DataTypes.STRING(255),
      },
      cctv_url: {
        type: DataTypes.STRING(255),
      },
    }, {
      createdAt: false,
      updatedAt: false,
      tableName: "cctvs",
    }
  );
};

//https://loy124.tistory.com/373
//https://devlog-wjdrbs96.tistory.com/221