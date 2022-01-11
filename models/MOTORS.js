module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "MOTORS", {
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
            tableName: "MOTORS",
        }
    );
};

//https://loy124.tistory.com/373
//https://devlog-wjdrbs96.tistory.com/221