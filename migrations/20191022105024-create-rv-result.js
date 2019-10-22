'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rv_results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        unique: 'actions_unique',
        type: Sequelize.INTEGER
      },
      points: {
        defaultValue: 0,
        type: Sequelize.DECIMAL
      },
      value: {
        defaultValue: 0,
        type: Sequelize.DECIMAL
      },
      origination: {
        defaultValue: 0,
        type: Sequelize.DECIMAL
      },
      percentage: {
        defaultValue: 0,
        type: Sequelize.DECIMAL
      },
      remuneration: {
        defaultValue: 0,
        type: Sequelize.DECIMAL
      },
      base_date: {
        allowNull: false,
        unique: 'actions_unique',
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
    }, {
      uniqueKeys: {
        actions_unique: {
          fields: ['user_id', 'base_date']
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rv_results');
  }
};
