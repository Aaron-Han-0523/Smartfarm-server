module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "actuators", {
            motor_id: {
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
            actuator_type: {
                type: DataTypes.STRING(255),
            },
            actuator_name: {
                type: DataTypes.STRING(255),
            },
        }, {
            createdAt: false,
            updatedAt: false,
            tableName: "actuators",
        }
    );
};

//https://loy124.tistory.com/373
//https://devlog-wjdrbs96.tistory.com/221