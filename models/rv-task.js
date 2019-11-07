const Sequelize = require('sequelize');
const Op = Sequelize.Op;

'use strict';
module.exports = (sequelize, DataTypes) => {
  const RvTask = sequelize.define('RvTask', {
    name: DataTypes.STRING,
    taskNumber: DataTypes.INTEGER,
    points: DataTypes.DECIMAL,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY
  }, {
    underscored: true,
    tableName: 'rv_tasks',
    hooks: {
      beforeCreate: function(task, options) {
        var startDate = new Date(task.startDate);
        var endDate = new Date(task.endDate);
        var currentDate = new Date();
        currentDate.setHours(0,0,0,0)
        startDate.setHours(0,0,0,0)
        endDate.setHours(0,0,0,0)

        // only check for active tasks when the task to be created will be active
        if ((task.startDate && startDate <= currentDate) &&
          (task.endDate == null || endDate > currentDate))
          return RvTask.scope(
            { method: ['active', task.taskNumber]}
          ).findAll({ transaction: options.transaction }).then(
            function (tasks) {
              if (!Array.isArray(tasks) || tasks.length > 0) {
                  throw new Error('The task ' + task.taskNumber + ' is already active.');
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
      },
      active: function(taskNumber){
        return {
          where: {
            taskNumber: taskNumber,
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
    }
  });
  RvTask.associate = function(models) {
    // associations can be defined here
  };
  return RvTask;
};
