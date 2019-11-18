'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {
  const RvGoalRangeParam = sequelize.define('RvGoalRangeParam', {
    percentage: {
      type: DataTypes.DECIMAL,
      validate: {
        min: 0,
      },
    },
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
  }, {
    underscored: true,
    tableName: 'rv_goal_range_params',
    hooks: {
      beforeBulkCreate: function(params, options) {
        var percentages = [];
        params.forEach((param) => {
          var startDate = new Date(param.startDate);
          var endDate = new Date(param.endDate);
          var currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);


          // only check for active params when the param to be created will be active
          if ((param.startDate && startDate <= currentDate) &&
            (param.endDate === null || endDate > currentDate))
            percentages.push(param['percentage']);
        });
        if ((new Set(percentages)).size !== percentages.length){
          throw new Error('Cannot insert the same percentage more than once.');
        }

        return RvGoalRangeParam.scope('actives').findAll({
          where: {
            percentage: { [Op.in]: percentages },
          }, transaction: options.transaction,
        }).then(
          function(results) {
            var activePercentages = results.map((param) => { return param['percentage']; });
            if (!Array.isArray(activePercentages) || activePercentages.length > 0) {
              throw new Error('Percentages ' + activePercentages + ' are already active.');
            }
          },
        );
      },
    },
    scopes: {
      actives: {
        where: {
          startDate: { [Op.lte]: new Date() },
          endDate: {
            [Op.or]: {
              [Op.gt]: new Date(),
              [Op.eq]: null,
            },
          },
        },
      },
    },
  });
  RvGoalRangeParam.associate = function(models) {
    // associations can be defined here
  };
  return RvGoalRangeParam;
};
