'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('rv_task_results', [
      {
        user_id: 1,
        task_number: 1,
        points: 20,
        task_value: 20,
        base_date: new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        task_number: 2,
        points: 20,
        task_value: 20,
        base_date: new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        task_number: 3,
        points: 20,
        task_value: 20,
        base_date: new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        task_number: 4,
        points: 20,
        task_value: 20,
        base_date: new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        task_number: 1,
        points: 20,
        task_value: 20,
        base_date: new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        task_number: 2,
        points: 20,
        task_value: 20,
        base_date: new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        task_number: 3,
        points: 20,
        task_value: 20,
        base_date: new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        task_number: 4,
        points: 20,
        task_value: 20,
        base_date: new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('rv_task_results', null, {});
  }
};
