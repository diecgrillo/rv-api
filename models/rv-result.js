const Sequelize = require('sequelize');
const Op = Sequelize.Op;

'use strict';
module.exports = (sequelize, DataTypes) => {
  const RvResult = sequelize.define('RvResult', {
    userId: {
      type: DataTypes.INTEGER,
      unique: 'actions_unique'
    },
    points: DataTypes.DECIMAL,
    value: {
      type: DataTypes.DECIMAL,
      validate: {
        min: 0
      }
    },
    origination: DataTypes.DECIMAL,
    percentage: {
      type: DataTypes.DECIMAL,
      validate: {
        min: 0
      }
    },
    remuneration: {
      type: DataTypes.DECIMAL,
      validate: {
        min: 0
      }
    },
    baseDate: {
      type: DataTypes.DATEONLY,
      unique: 'actions_unique'
    }
  }, {
    underscored: true,
    tableName: 'rv_results',
    hooks: {
      beforeCreate: function(result) {
        RvResult.scope({
          method: ['fromBaseDate', result.userId, result.baseDate]
        }).findAll().then(
          function (results) {
            if (!Array.isArray(results) || results.length > 0) {
                throw new Error('Only one rv result for this user is allowed per base date.');
            }
        });
      }
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
            baseDate: { [Op.between]: [firstDay, lastDay] }
          }
        }
      }
    }
  });
  RvResult.associate = function(models) {
    // associations can be defined here
  };
  return RvResult;
};
