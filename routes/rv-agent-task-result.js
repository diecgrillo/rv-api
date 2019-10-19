var express = require("express");
const RvAgentTaskResult = require('../models').RvAgentTaskResult;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var router  = express.Router();

router.get("/:id", function(req, res) {
  var date = new Date();
  if (req.query.base_date)
    date = new Date(req.query.base_date);

  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  RvAgentTaskResult.findAll({
    attributes: ['id', 'userId', 'taskNumber', 'points', 'taskValue'],
    where: {
      userId: req.params.id,
      baseDate: { [Op.between]: [firstDay, lastDay] }
    }
  }).then(function(rvAgentTaskResults) {
    res.json({
      rv_agent_task_results: rvAgentTaskResults
    });
  }).catch((error) => res.status(400).send(error));
});

module.exports = router;
