'use strict';
var express = require('express');
var db = require('../models/index');
const RvGoalRangeParam = require('../models').RvGoalRangeParam;

var router = express.Router();

router.get('/', function(req, res) {
  RvGoalRangeParam.scope('actives').findAll({
    attributes: ['id', 'percentage'],
  }).then(function(rvGoalRangeParams) {
    res.json({
      rv_goal_range_params: rvGoalRangeParams,
    });
  }).catch((error) => res.status(400).send(error.message));
});

router.post('/', function(req, res) {
  var rvGoalRangeReqParams = req.body.rv_goal_range_params;
  var rvGoalRangeParams = rvGoalRangeReqParams.map(function(rvGoalRangeParam) {
    return {
      percentage: rvGoalRangeParam.percentage,
      startDate: new Date(),
      endDate: null,
    };
  });
  db.sequelize.transaction(function(t){
    return RvGoalRangeParam.scope('actives').update(
      { endDate: new Date() }, { transaction: t },
    ).then(() => {
      return RvGoalRangeParam.bulkCreate(rvGoalRangeParams, {
        returning: true, validate: true, transaction: t,
      }).then(function(rvGoalRangeParams) {
        res.json(rvGoalRangeParams);
      });
    });
  }).catch(function(error){
    if (error.message === 'aggregate error')
      res.status(400).send(error['0']['errors']['message']);
    else
      res.status(400).send(error.message);
  });
});

module.exports = router;
