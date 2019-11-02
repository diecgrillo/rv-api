var express = require("express");
var db = require('../models/index');
const RvGoalParam = require('../models').RvGoalParam;

var router  = express.Router();

router.get("/", function(req, res) {
  RvGoalParam.scope('actives').findAll({
    attributes: ['id', 'individualGoalWeight', 'teamGoalWeight']
  }).then(function(rvGoalParams) {
    res.json({
      rv_goal_params: rvGoalParams
    });
  }).catch((error) => res.status(400).send(error));
});

router.post("/rv-goal-param/", function(req, res) {
  var individualGoalWeight = req.body.individual_goal_weight;
  var teamGoalWeight = req.body.team_goal_weight;
  db.sequelize.transaction(function(t){
    return RvGoalParam.scope('actives').update(
      { endDate: new Date() }, { transaction: t }
    ).then(() => {
      return RvGoalParam.create({
        individualGoalWeight: individualGoalWeight,
        teamGoalWeight: teamGoalWeight,
        startDate: new Date(),
        endDate: null
      }, { transaction: t }).then(function(rvGoalParam) {
        res.json(rvGoalParam);
      });
    });
  }).catch(function(error){
    res.status(400).send(error.message);
  });
});

module.exports = router;
