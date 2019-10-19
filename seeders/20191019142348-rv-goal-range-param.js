'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('rv_goal_range_params', [
      {
        percentage: 0.75,
        start_date: new Date(),
        end_date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        percentage: 0.85,
        start_date: new Date(),
        end_date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        percentage: 0.95,
        start_date: new Date(),
        end_date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        percentage: 1.05,
        start_date: new Date(),
        end_date: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('rv_goal_range_params', null, {});
  }
};
