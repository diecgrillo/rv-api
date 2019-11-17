var express = require("express");
var db = require('../models/index');
const RvTask = require('../models').RvTask;

var router  = express.Router();

router.get("/", function(req, res) {
  RvTask.scope('actives').findAll({
    attributes: ['id', 'task_number', 'name', 'points'],
  }).then(function(rvTasks) {
    res.json({
      rv_tasks: rvTasks
    });
  }).catch((error) => res.status(400).send(error.message));
});

router.post("/rv-task/", function(req, res) {
  var name = req.body.name;
  var points = req.body.points;
  var taskNumber = req.body.task_number;
  db.sequelize.transaction(function(t){
    return RvTask.scope(
      { method: ['active', taskNumber]}
    ).update(
      { endDate: new Date() }, { transaction: t }
    ).then(() => {
      return RvTask.create({
        name: name,
        taskNumber: taskNumber,
        points: points,
        startDate: new Date(),
        endDate: null
      }, { transaction: t }).then(function(rvTask) {
        res.json(rvTask);
      });
    });
  }).catch(function(error){
    res.status(400).send(error.message);
  });
});

module.exports = router;
