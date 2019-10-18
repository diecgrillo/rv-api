var express = require("express");
const RvGoalParam = require('../models').RvGoalParam;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var router  = express.Router();

router.get("/", function(req, res) {
  RvGoalParam.findOne({
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
  }).then(function(rvGoalParam) {
    res.json({
      rv_goal_params: rvGoalParam
    });
  }).catch((error) => res.status(400).send(error));
});

router.put("/", function(req, res) {
  var individualGoalWeight = req.body.individual_goal_weight;
  var teamGoalWeight = req.body.team_goal_weight;
  var startDate = req.body.start_date;
  var endDate = req.body.end_date;
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
      startDate: startDate,
      endDate: endDate
    }).then(function(rvGoalParam) {
      res.json(rvGoalParam)
    })
  });
});

//api.post("/user", function(req, res) { /* ... */ });
module.exports = router;
