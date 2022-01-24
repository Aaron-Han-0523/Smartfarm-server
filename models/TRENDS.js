module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "trends", {
            sensor_id: {
                type: DataTypes.STRING(20),
            },
            sid: {
                type: DataTypes.STRING(20),
            },
            uid: {
                type: DataTypes.STRING(20),
            },
            time_stamp: {
                type: DataTypes.STRING(255),
            },
            value: {
                type: DataTypes.STRING(255),
            },
        }, {
            createdAt: false,
            updatedAt: false,
            tableName: "trends",
        }
    );
};

//https://loy124.tistory.com/373
//https://devlog-wjdrbs96.tistory.com/221