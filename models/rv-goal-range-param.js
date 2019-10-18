'use strict';
module.exports = (sequelize, DataTypes) => {
  const RvGoalRangeParam = sequelize.define('RvGoalRangeParam', {
    percentage: DataTypes.DECIMAL,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY
  }, {
    underscored: true,
    tableName: 'rv_goal_range_params'
  });
  RvGoalRangeParam.associate = function(models) {
    // associations can be defined here
  };
  return RvGoalRangeParam;
};
