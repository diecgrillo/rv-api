'use strict';
var express = require('express');
var db = require('../models/index');
const RvResult = require('../models').RvResult;

var router = express.Router();

router.get('/:id', function(req, res) {
  var baseDate = req.query.base_date ? new Date(req.query.base_date) : new Date();
  RvResult.scope(
    { method: ['fromBaseDate', req.params.id, baseDate]},
  ).findOne({
    attributes: [
      'id', 'userId', 'value', 'points', 'remuneration', 'origination', 'percentage', 'baseDate',
    ],
  }).then(function(rvResult) {
    res.json({
      rv_result: rvResult,
    });
  }).catch((error) => res.status(400).send(error.message));
});

router.post('/', function(req, res) {
  var rvResultsRequest = req.body.rv_results;
  var rvResults = rvResultsRequest.map(function(rvResult) {
    // sets the base date to the last day of month
    var baseDate = rvResult.base_date ? new Date(rvResult.base_date) : new Date();
    return {
      userId: rvResult.user_id,
      points: rvResult.points,
      value: rvResult.value,
      origination: rvResult.origination,
      percentage: rvResult.percentage,
      remuneration: rvResult.remuneration,
      baseDate: new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0),
    };
  });
  db.sequelize.transaction(function(t){
    var promises = [];
    rvResults.forEach(function(rvResult){
      var newPromise = RvResult.upsert(rvResult, {
        returning: true, transaction: t,
      });
      promises.push(newPromise);
    });
    return Promise.all(promises).then(function(rvResults){
      res.json(rvResults);
    });
  }).catch(function(error){
    res.status(400).send(error.message);
  });
});

module.exports = router;
