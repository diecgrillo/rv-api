'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('rv_results', [
      {
        user_id: 1,
        value: 2000,
        points: 1500,
        remuneration: 1.0,
        percentage: 0.9,
        origination: 400000,
        base_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        value: 2300,
        points: 1600,
        remuneration: 1.1,
        percentage: 0.95,
        origination: 600000,
        base_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
