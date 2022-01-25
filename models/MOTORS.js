module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "motors", {
            motor_id: {
                type: DataTypes.STRING(20),
                primaryKey: true,
            },
            sid: {
                type: DataTypes.STRING(20),
            },
            uid: {
                type: DataTypes.STRING(20),
            },
            motor_type: {
                type: DataTypes.STRING(255),
            },
            motor_action: {
                type: DataTypes.STRING(255),
            },
            motor_name: {
                type: DataTypes.STRING(255),
            },
        }, {
            createdAt: false,
            updatedAt: false,
            tableName: "motors",
        }
    );
};

//https://loy124.tistory.com/373
//https://devlog-wjdrbs96.tistory.com/221