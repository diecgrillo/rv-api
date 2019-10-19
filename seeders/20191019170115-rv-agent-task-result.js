'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('rv_agent_task_results', [
      {
        user_id: 1,
        task_number: 1,
        points: 20,
        task_value: 20,
        base_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        task_number: 2,
        points: 20,
        task_value: 20,
        base_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        task_number: 3,
        points: 20,
        task_value: 20,
        base_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        task_number: 4,
        points: 20,
        task_value: 20,
        base_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        task_number: 1,
        points: 20,
        task_value: 20,
        base_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        task_number: 2,
        points: 20,
        task_value: 20,
        base_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        task_number: 3,
        points: 20,
        task_value: 20,
        base_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        task_number: 4,
        points: 20,
        task_value: 20,
        base_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('rv_agent_task_results', null, {});
  }
};
