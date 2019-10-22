'use strict';
module.exports = (sequelize, DataTypes) => {
  const RvTaskResult = sequelize.define('RvTaskResult', {
    userId: DataTypes.INTEGER,
    taskNumber: DataTypes.INTEGER,
    points: DataTypes.DECIMAL,
    taskValue: DataTypes.DECIMAL,
    baseDate: DataTypes.DATEONLY
  }, {
    underscored: true,
    tableName: 'rv_task_results'
  });
  RvTaskResult.associate = function(models) {
    // associations can be defined here
  };
  return RvTaskResult;
};
