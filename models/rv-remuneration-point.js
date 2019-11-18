'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {
  const RvRemunerationPoint = sequelize.define('RvRemunerationPoint', {
    minPoints: {
      type: DataTypes.DECIMAL,
      validate: {
        min: 0,
      },
    },
    value: {
      type: DataTypes.DECIMAL,
      validate: {
        min: 0,
      },
    },
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
  }, {
    underscored: true,
    tableName: 'rv_remuneration_points',
    hooks: {
      beforeBulkCreate: function(params, options) {
        var minPoints = []; var values = [];
        params.forEach((param) => {
          minPoints.push(param['minPoints']);
          values.push(param['value']);
        });
        if ((new Set(minPoints)).size !== minPoints.length){
          throw new Error('Cannot insert the same punctuation more than once.');
        }
        if ((new Set(values)).size !== values.length){
          throw new Error('Cannot insert the same value more than once.');
        }
        return RvRemunerationPoint.scope('actives').findAll({
          where: {
            [Op.or]: {
              minPoints: { [Op.in]: minPoints },
              value: { [Op.in]: values },
            },
          }, transaction: options.transaction,
        }).then(
          function(results) {
            var activeValues = results.map((param) => { return param['value']; });
            var activePoints = results.map((param) => { return param['minPoints']; });
            if (!Array.isArray(activePoints) || !Array.isArray(activeValues) ||
                activeValues.length > 0 || activePoints.length > 0) {
              throw new Error(
                'There is already a remuneration active for the provided points or values: ' +
                'points= ' + activePoints + ', values= ' + activeValues);
            }
          });
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
  RvRemunerationPoint.associate = function(models) {
    // associations can be defined here
  };
  return RvRemunerationPoint;
};
