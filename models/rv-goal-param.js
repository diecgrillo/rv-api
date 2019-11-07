'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {
  const RvGoalParam = sequelize.define('RvGoalParam', {
    individualGoalWeight: DataTypes.DECIMAL,
    teamGoalWeight: DataTypes.DECIMAL,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY
  }, {
    tableName: 'rv_goal_params',
    underscored: true,
    validate: {
      validWeight() {
        if (this.individualGoalWeight && this.teamGoalWeight){
          if (this.individualGoalWeight + this.teamGoalWeight != 1){
            throw new Error('Sum of team goal and individual goal should be 1. individual= ' + this.teamGoalWeight + ', team= ' + this.individualGoalWeight);
          }
        }
      }
    },
    hooks: {
      beforeCreate: function(param, options) {
        var startDate = new Date(param.startDate);
        var endDate = new Date(param.endDate);
        var currentDate = new Date();
        currentDate.setHours(0,0,0,0)
        startDate.setHours(0,0,0,0)
        endDate.setHours(0,0,0,0)

        // only check for active params when the created param will be active
        if ((param.startDate && startDate <= currentDate) &&
          (param.endDate == null || endDate > currentDate))
          return RvGoalParam.scope('actives').findAll({transaction: options.transaction}).then(
            function (params) {
              if (!Array.isArray(params) || params.length > 0) {
                  throw new Error('Only one active param is allowed.');
              }
            }
          );
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
  RvGoalParam.associate = function(models) {
    // associations can be defined here
  };
  return RvGoalParam;
};
