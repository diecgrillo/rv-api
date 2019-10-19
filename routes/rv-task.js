var express = require("express");
const RvTask = require('../models').RvTask;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var router  = express.Router();

router.get("/", function(req, res) {
  RvTask.findAll({
    attributes: ['id', 'task_number', 'name', 'points'],
    where: {
      startDate: { [Op.lte]: new Date() },
      endDate: {
        [Op.or]: {
          [Op.gt]: new Date(),
          [Op.eq]: null
        }
      }
    }
  }).then(function(rvTasks) {
    res.json({
      rv_tasks: rvTasks
    });
  }).catch((error) => res.status(400).send(error));
});

router.put("/rv-task/", function(req, res) {
  var name = req.body.name;
  var points = req.body.points;
  var task_number = req.body.task_number;
  RvTask.update(
    { endDate: new Date() },
    {
      where: {
        task_number: task_number,
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
    RvTask.create({
      name: name,
      task_number: task_number,
      points: points,
      startDate: new Date(),
      endDate: null
    }).then(function(rvTask) {
      res.json(rvTask);
    })
  });
});

module.exports = router;
