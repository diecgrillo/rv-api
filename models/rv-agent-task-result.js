'use strict';
module.exports = (sequelize, DataTypes) => {
  const RvAgentTaskResult = sequelize.define('RvAgentTaskResult', {
    userId: DataTypes.INTEGER,
    rvTaskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'RvTasks',
        key: 'id'
      },
    },
    points: DataTypes.INTEGER,
    baseDate: DataTypes.DATEONLY
  }, {
    underscored: true,
    tableName: 'rv_agent_task_results'
  });
  RvAgentTaskResult.associate = function(models) {
    RvAgentTaskResult.belongsTo(models.RvTask);
  };
  return RvAgentTaskResult;
};
