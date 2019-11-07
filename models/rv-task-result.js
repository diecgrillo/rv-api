const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {
  const RvTaskResult = sequelize.define('RvTaskResult', {
    userId: {
      type: DataTypes.INTEGER,
      unique: 'actions_unique'
    },
    taskNumber: {
      type: DataTypes.INTEGER,
      unique: 'actions_unique'
    },
    points: DataTypes.DECIMAL,
    taskValue: DataTypes.DECIMAL,
    baseDate: {
      type: DataTypes.DATEONLY,
      unique: 'actions_unique'
    }
  }, {
    underscored: true,
    tableName: 'rv_task_results',
    uniqueKeys: {
      actions_unique: {
        fields: ['user_id', 'task_number', 'base_date']
      }
    },
    hooks: {
      beforeCreate: function(taskResult) {
        var date;
        if (taskResult.baseDate)
          date = new Date(taskResult.baseDate)
        else
          date = new Date();

        taskResult.baseDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      }
    },
    scopes: {
      fromBaseDate: function(userId, baseDate) {
        var firstDay = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
        var lastDay = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
        return {
          where: {
            userId: userId,
            baseDate: { [Op.between]: [firstDay, lastDay] }
          }
        }
      }
    }
  });
  RvTaskResult.associate = function(models) {
    // associations can be defined here
  };
  return RvTaskResult;
};
