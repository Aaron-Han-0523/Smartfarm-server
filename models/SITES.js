module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "SITES",
    {
      sid: {
        type: DataTypes.STRING(20),
        primaryKey: true,
      },
      uid: {
        type: DataTypes.STRING(20),
        primaryKey: true,
      },
      site_name: {
        type: DataTypes.STRING(20),
      },
      site_address: {
        type: DataTypes.STRING(20),
      },
      site_gps_latitude: {
        type: DataTypes.STRING(20),
      },
      site_gps_longitude: {
        type: DataTypes.STRING(20),
      },
      site_th_sensor_count: {
        type: DataTypes.STRING(20),
      },
      site_soil_sensor_count: {
        type: DataTypes.STRING(20),
      },
      site_side_motor_count: {
        type: DataTypes.STRING(20),
      },
      site_top_motor_count: {
        type: DataTypes.STRING(20),
      },
      site_actuator_count: {
        type: DataTypes.STRING(20),
      },
      site_pump_count: {
        type: DataTypes.STRING(20),
      },
      site_valve_count: {
        type: DataTypes.STRING(20),
      },
      site_cctv_count: {
        type: DataTypes.STRING(20),
      },
      site_set_alarm_enable: {
        type: DataTypes.STRING(20),
      },
      site_set_alarm_high: {
        type: DataTypes.STRING(20),
      },
      site_set_alarm_low: {
        type: DataTypes.STRING(20),
      },
      site_set_alarm_timer: {
        type: DataTypes.STRING(20),
      }
    },
    {
      createdAt: false,
      updatedAt: false,
      tableName: "SITES",
    }
  );
};

//https://loy124.tistory.com/373
//https://devlog-wjdrbs96.tistory.com/221
