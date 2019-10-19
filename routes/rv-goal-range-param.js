var express = require("express");
const RvGoalRangeParam = require('../models').RvGoalRangeParam;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var router  = express.Router();

router.get("/", function(req, res) {
  RvGoalRangeParam.findAll({
    attributes: ['id', 'percentage'],
    where: {
      startDate: { [Op.lte]: new Date() },
      endDate: {
        [Op.or]: {
          [Op.gt]: new Date(),
          [Op.eq]: null
        }
      }
    }
  }).then(function(rvGoalRangeParams) {
    res.json({
      rv_goal_range_params: rvGoalRangeParams
    });
  }).catch((error) => res.status(400).send(error));
});

router.put("/", function(req, res) {
  var rvGoalRangeReqParams = req.body.rv_goal_range_params;
  var rvGoalRangeParams = rvGoalRangeReqParams.map(function(rvGoalRangeParam) {
    return {
      percentage: rvGoalRangeParam.percentage,
      startDate: new Date(),
      endDate: null
    }
  });
  RvGoalRangeParam.update(
    { endDate: new Date() },
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
    RvGoalRangeParam.bulkCreate(rvGoalRangeParams, { returning: true }).then(function(rvGoalRangeParams) {
      res.json(rvGoalRangeParams)
    })
  });
});

module.exports = router;
