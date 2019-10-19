var express = require("express");
const RvGoalParam = require('../models').RvGoalParam;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var router  = express.Router();

router.get("/", function(req, res) {
  RvGoalParam.findAll({
    attributes: ['id', 'individualGoalWeight', 'teamGoalWeight'],
    where: {
      startDate: { [Op.lte]: new Date() },
      endDate: {
        [Op.or]: {
          [Op.gt]: new Date(),
          [Op.eq]: null
        }
      }
    }
  }).then(function(rvGoalParams) {
    res.json({
      rv_goal_params: rvGoalParams
    });
  }).catch((error) => res.status(400).send(error));
});

router.put("/rv-goal-param/", function(req, res) {
  var individualGoalWeight = req.body.individual_goal_weight;
  var teamGoalWeight = req.body.team_goal_weight;
  RvGoalParam.update(
    { endDate: new Date()},
    {
      where: {
        startDate: { [Op.lte]: new Date() },
        endDate: {
          [Op.or]: {
            [Op.gt]: new Date(),
            [Op.eq]: null
          }
        }
      }
    }
  ).then(() => {
    RvGoalParam.create({
      individualGoalWeight: individualGoalWeight,
      teamGoalWeight: teamGoalWeight,
      startDate: new Date(),
      endDate: null
    }).then(function(rvGoalParam) {
      res.json(rvGoalParam)
    })
  });
});

module.exports = router;
