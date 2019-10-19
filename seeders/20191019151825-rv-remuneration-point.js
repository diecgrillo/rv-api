'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('rv_remuneration_points', [
      {
        min_points: 1100,
        value: 1.00,
        start_date: new Date(),
        end_date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        min_points: 1500,
        value: 1.05,
        start_date: new Date(),
        end_date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        min_points: 2000,
        value: 1.15,
        start_date: new Date(),
        end_date: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('rv_remuneration_points', null, {});
  }
};
