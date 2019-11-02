const Sequelize = require('sequelize');
const Op = Sequelize.Op;

'use strict';
module.exports = (sequelize, DataTypes) => {
  const RvGoalRangeParam = sequelize.define('RvGoalRangeParam', {
    percentage: {
      type: DataTypes.DECIMAL,
      validate: {
        min: 0
      }
    },
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY
  }, {
    underscored: true,
    tableName: 'rv_goal_range_params',
    hooks: {
      beforeBulkCreate: function(params, options) {
        percentages = params.map((param) => { return param["percentage"]})
        if ((new Set(percentages)).size !== percentages.length){
          throw new Error('Cannot insert the same percentage more than once.');
        }
        return RvGoalRangeParam.scope('actives').findAll({
          where: {
            percentage: { [Op.in]: percentages }
          }, transaction: options.transaction
        }).then(
          function (results) {
            activePercentages = results.map((param) => { return param["percentage"]})
            if (!Array.isArray(activePercentages) || activePercentages.length > 0) {
              throw new Error('Percentages ' + activePercentages + ' are already active.');
            }
        });
      }
    },
    scopes: {
      actives: {
        where: {
          startDate: { [Op.lte]: new Date() },
          endDate: {
            [Op.or]: {
              [Op.gt]: new Date(),
              [Op.eq]: null
            }
          }
        }
      }
    }
  });
  RvGoalRangeParam.associate = function(models) {
    // associations can be defined here
  };
  return RvGoalRangeParam;
};
