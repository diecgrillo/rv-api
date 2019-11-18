'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('rv_goal_params', [{
      individual_goal_weight: 0.8,
      team_goal_weight: 0.2,
      start_date: new Date(),
      end_date: null,
      created_at: new Date(),
      updated_at: new Date(),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('rv_goal_params', null, {});
  },
};
