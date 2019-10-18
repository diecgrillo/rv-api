'use strict';
module.exports = (sequelize, DataTypes) => {
  const RvGoalParam = sequelize.define('RvGoalParam', {
    individualGoalWeight: DataTypes.DECIMAL,
    teamGoalWeight: DataTypes.DECIMAL,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY
  }, {
    underscored: true,
    tableName: 'rv_goal_params'
  });
  RvGoalParam.associate = function(models) {
    // associations can be defined here
  };
  return RvGoalParam;
};
