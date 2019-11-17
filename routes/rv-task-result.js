var express = require("express");
var db = require('../models/index');
const RvTaskResult = require('../models').RvTaskResult;

var router  = express.Router();

router.get("/:id", function(req, res) {
  var date = new Date();
  if (req.query.base_date)
    date = new Date(req.query.base_date);

  RvTaskResult.scope(
    { method: ['fromBaseDate', req.params.id, date]}
  ).findAll({
    attributes: ['id', 'userId', 'taskNumber', 'points', 'taskValue', 'baseDate'],
  }).then(function(rvTaskResults) {
    res.json({
      rv_task_results: rvTaskResults
    });
  }).catch((error) => res.status(400).send(error.message));
});

router.post("/", function(req, res) {
  var rvTaskResultsRequest = req.body.rv_task_results;
  var rvTaskResults = rvTaskResultsRequest.map(function(rvTaskResult) {
    // sets the base date to the last day of month
    var baseDate = rvTaskResult.base_date ? new Date(rvTaskResult.base_date) : new Date();
    return {
      userId: rvTaskResult.user_id,
      taskNumber: rvTaskResult.task_number,
      points: rvTaskResult.points,
      taskValue: rvTaskResult.task_value,
      baseDate: new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0)
    }
  });
  db.sequelize.transaction(function(t){
    var promises = []
    rvTaskResults.forEach(function(rvTaskResult){
      var newPromise = RvTaskResult.upsert(rvTaskResult, {
        returning: true, transaction: t
      });
      promises.push(newPromise);
    });
    return Promise.all(promises).then(function(rvTaskResults){
      res.json(rvTaskResults)
    });
  }).catch(function(error){
    res.status(400).send(error.message);
  });
});

module.exports = router;
