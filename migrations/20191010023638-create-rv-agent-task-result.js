'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rv_agent_task_results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
	      allowNull: false,
        type: Sequelize.INTEGER
      },
      task_number: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      points: {
	      defaultValue: 0,
        type: Sequelize.DECIMAL
      },
      task_value: {
        type: Sequelize.DECIMAL
      },
      base_date: {
	      allowNull: false,
        type: Sequelize.DATEONLY
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rv_agent_task_results');
  }
};
