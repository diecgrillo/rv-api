'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('rv_tasks', [
      {
        name: "Renovação",
        task_number: 1,
        points: 8,
        start_date: new Date(),
        end_date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Novos",
        task_number: 2,
        points: 5,
        start_date: new Date(),
        end_date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Repique",
        task_number: 3,
        points: 5,
        start_date: new Date(),
        end_date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Rolagem",
        task_number: 4,
        points: -100,
        start_date: new Date(),
        end_date: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('rv_tasks', null, {});
  }
};
