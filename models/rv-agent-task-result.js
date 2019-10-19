'use strict';
module.exports = (sequelize, DataTypes) => {
  const RvAgentTaskResult = sequelize.define('RvAgentTaskResult', {
    userId: DataTypes.INTEGER,
    taskNumber: DataTypes.INTEGER,
    points: DataTypes.DECIMAL,
    taskValue: DataTypes.DECIMAL,
    baseDate: DataTypes.DATEONLY
  }, {
    underscored: true,
    tableName: 'rv_agent_task_results'
  });
  RvAgentTaskResult.associate = function(models) {
    // associations can be defined here
  };
  return RvAgentTaskResult;
};
