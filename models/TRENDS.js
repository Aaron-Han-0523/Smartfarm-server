module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "TRENDS", {
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
            time_stamp: {
                type: DataTypes.STRING(255),
                primaryKey: true,
            },
            value: {
                type: DataTypes.STRING(255),
            },
        }, {
            createdAt: false,
            updatedAt: false,
            tableName: "TRENDS",
        }
    );
};

//https://loy124.tistory.com/373
//https://devlog-wjdrbs96.tistory.com/221