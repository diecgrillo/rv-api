'use strict';
module.exports = (sequelize, DataTypes) => {
  const RvRemunerationPoint = sequelize.define('RvRemunerationPoint', {
    minPoints: DataTypes.DECIMAL,
    value: DataTypes.DECIMAL,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY
  }, {
    underscored: true,
    tableName: 'rv_remuneration_points'
  });
  RvRemunerationPoint.associate = function(models) {
    // associations can be defined here
  };
  return RvRemunerationPoint;
};
