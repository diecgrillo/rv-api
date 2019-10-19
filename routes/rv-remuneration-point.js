var express = require("express");
const RvRemunerationPoint = require('../models').RvRemunerationPoint;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var router  = express.Router();

router.get("/", function(req, res) {
  RvRemunerationPoint.findAll({
    attributes: ['id', 'minPoints', 'value'],
    where: {
      startDate: { [Op.lte]: new Date() },
      endDate: {
        [Op.or]: {
          [Op.gt]: new Date(),
          [Op.eq]: null
        }
      }
    }
  }).then(function(rvRemunerationPoints) {
    res.json({
      rv_remuneration_points: rvRemunerationPoints
    });
  }).catch((error) => res.status(400).send(error));
});

router.put("/", function(req, res) {
  var rvRemunerationPointsReq = req.body.rv_remuneration_points;
  var rvRemunerationPoints = rvRemunerationPointsReq.map(function(rvRemunerationPoints) {
    return {
      minPoints: rvRemunerationPoints.min_points,
      value: rvRemunerationPoints.value,
      startDate: new Date(),
      endDate: null
    }
  });
  RvRemunerationPoint.update(
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
    RvRemunerationPoint.bulkCreate(rvRemunerationPoints, { returning: true }).then(function(rvRemunerationPoint) {
      res.json(rvRemunerationPoint)
    })
  });
});

module.exports = router;
