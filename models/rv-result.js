'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {
  const RvResult = sequelize.define('RvResult', {
    userId: {
      type: DataTypes.INTEGER,
      unique: 'actions_unique',
    },
    points: DataTypes.DECIMAL,
    value: {
      type: DataTypes.DECIMAL,
      validate: {
        min: 0,
      },
    },
    origination: DataTypes.DECIMAL,
    percentage: {
      type: DataTypes.DECIMAL,
      validate: {
        min: 0,
      },
    },
    remuneration: {
      type: DataTypes.DECIMAL,
      validate: {
        min: 0,
      },
    },
    baseDate: {
      type: DataTypes.DATEONLY,
      unique: 'actions_unique',
    },
  }, {
    underscored: true,
    tableName: 'rv_results',
    uniqueKeys: {
      actions_unique: {
        fields: ['user_id', 'base_date'],
      },
    },
    hooks: {
      beforeCreate: function(result) {
        var date;
        if (result.baseDate)
          date = new Date(result.baseDate);
        else
          date = new Date();

        result.baseDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      },
    },
    scopes: {
      fromBaseDate: function(userId, baseDate) {
        var date = new Date();
        if (baseDate)
          date = new Date(baseDate);
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return {
          where: {
            userId: userId,
            baseDate: { [Op.between]: [firstDay, lastDay] },
          },
        };
      },
    },
  });
  RvResult.associate = function(models) {
    // associations can be defined here
  };
  return RvResult;
};
