'use strict';
module.exports = (sequelize, DataTypes) => {
  const RvResult = sequelize.define('RvResult', {
    userId: DataTypes.INTEGER,
    points: DataTypes.DECIMAL,
    value: DataTypes.DECIMAL,
    origination: DataTypes.DECIMAL,
    percentage: DataTypes.DECIMAL,
    remuneration: DataTypes.DECIMAL,
    baseDate: DataTypes.DATEONLY
  }, {
    underscored: true,
    tableName: 'rv_results'
  });
  RvResult.associate = function(models) {
    // associations can be defined here
  };
  return RvResult;
};
