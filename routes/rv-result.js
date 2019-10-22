var express = require("express");
const RvResult = require('../models').RvResult;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var router  = express.Router();

router.get("/:id", function(req, res) {
  var date = new Date();
  if (req.query.base_date)
    date = new Date(req.query.base_date);

  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  RvResult.findOne({
    attributes: ['id', 'userId', 'value', 'points', 'remuneration', 'origination', 'percentage'],
    where: {
      userId: req.params.id,
      baseDate: { [Op.between]: [firstDay, lastDay] }
    }
  }).then(function(rvResult) {
    res.json({
      rv_result: rvResult
    });
  }).catch((error) => res.status(400).send(error));
});

module.exports = router;
