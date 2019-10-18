'use strict';
module.exports = (sequelize, DataTypes) => {
  const RvTask = sequelize.define('RvTask', {
    name: DataTypes.STRING,
    points: DataTypes.INTEGER,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY
  }, {
    underscored: true,
    tableName: 'rv_tasks'
  });
  RvTask.associate = function(models) {
    // associations can be defined here
  };
  return RvTask;
};
