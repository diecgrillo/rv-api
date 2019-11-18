'use strict';
var express = require('express');
var db = require('../models/index');
const RvRemunerationPoint = require('../models').RvRemunerationPoint;

var router = express.Router();

router.get('/', function(req, res) {
  RvRemunerationPoint.scope('actives').findAll({
    attributes: ['id', 'minPoints', 'value'],
  }).then(function(rvRemunerationPoints) {
    res.json({
      rv_remuneration_points: rvRemunerationPoints,
    });
  }).catch((error) => res.status(400).send(error.message));
});

router.post('/', function(req, res) {
  var rvRemunerationPointsReq = req.body.rv_remuneration_points;
  var rvRemunerationPoints = rvRemunerationPointsReq.map(function(rvRemunerationPoints) {
    return {
      minPoints: rvRemunerationPoints.min_points,
      value: rvRemunerationPoints.value,
      startDate: new Date(),
      endDate: null,
    };
  });
  db.sequelize.transaction(function(t){
    return RvRemunerationPoint.scope('actives').update(
      { endDate: new Date() }, { transaction: t },
    ).then(() => {
      return RvRemunerationPoint.bulkCreate(rvRemunerationPoints, {
        returning: true, validate: true, transaction: t,
      }).then(function(rvRemunerationPoint) {
        res.json(rvRemunerationPoint);
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
