const RvRemunerationPoint = require('../../models').RvRemunerationPoint;
const Sequelize = require('sequelize');
const config = require(__dirname + '/../../config/config.json')['test'];
const sequelize = new Sequelize(config.database, config.username, config.password, config);
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
chai.use(chaiAsPromised);
chai.should();

describe("rv-remuneration-point", function() {
  var date = new Date();
  var rvRemunerationPoint1, rvRemunerationPoint2, rvRemunerationPoint3;

  // clear the rv-remuneration-point table
  beforeEach(async function() {
    await RvRemunerationPoint.destroy({where: {}});
  });
  // insert some rv-remuneration-point
  beforeEach(async function() {
    await RvRemunerationPoint.create({
      minPoints: 1300,
      value: 1.0,
      startDate: date,
      endDate: null
    }).then(
      (rvRemunerationPoint) => { rvRemunerationPoint1 = rvRemunerationPoint.dataValues; }
    );
    await RvRemunerationPoint.create({
      minPoints: 1500,
      value: 1.1,
      startDate: date,
      endDate: new Date(Date.now() + 864e5)
    }).then(
      (rvRemunerationPoint)=> { rvRemunerationPoint2 = rvRemunerationPoint.dataValues; }
    );
    await RvRemunerationPoint.create({
      minPoints: 1600,
      value: 1.11,
      startDate: new Date(Date.now() - (2 * 864e5)),
      endDate: new Date(Date.now() - 864e5)
    }).then(
      (rvRemunerationPoint)=> { rvRemunerationPoint3 = rvRemunerationPoint.dataValues; }
    );
  })
  it("it return the active rv remuneration points", function() {
    return RvRemunerationPoint.scope('actives').findAll({}).then((rvRemunerationPoints) => {
      dataValues = rvRemunerationPoints.map(function(rvRemunerationPoint) {
        return rvRemunerationPoint.dataValues
      });
      expect(dataValues).to.have.deep.members([rvRemunerationPoint1,rvRemunerationPoint2])
    });
  });
  it("it throws an exception when we try to create more than one rv remuneration point with same points", function() {
    promise = RvRemunerationPoint.bulkCreate([
      {
        minPoints: 1800,
        value: 1.15,
        startDate: new Date(),
        endDate: null
      },
      {
        minPoints: 1800,
        value: 1.19,
        startDate: new Date(),
        endDate: null
      }
    ]);
    return promise.should.be.rejectedWith(Error, 'Cannot insert the same punctuation more than once.');
  });
  it("it throws an exception when we try to create a rv remuneration point with values that are already active", function() {
    promise = RvRemunerationPoint.bulkCreate([
      {
        minPoints: 1900,
        value: 1.19,
        startDate: new Date(),
        endDate: null
      },
      {
        minPoints: 1800,
        value: 1.19,
        startDate: new Date(),
        endDate: null
      }
    ]);
    return promise.should.be.rejectedWith(Error, 'Cannot insert the same value more than once.');
  });
  it("it throws an exception when we try to create a rv remuneration point with values that are already active", function() {
    promise = RvRemunerationPoint.bulkCreate([{
      minPoints: 1700,
      value: 1.1,
      startDate: new Date(),
      endDate: null
    }]);
    return promise.should.be.rejectedWith(Error, 'There is already a remuneration active for the provided points or values: ' +
      'points= 1500, values= 1.1');
  });
  it("it throws an exception when we try to create a rv remuneration point with values that are already active", function() {
    promise = RvRemunerationPoint.bulkCreate([{
      minPoints: 1700,
      value: 1.1,
      startDate: new Date(),
      endDate: null
    }]);
    return promise.should.be.rejectedWith(Error, 'There is already a remuneration active for the provided points or values: ' +
      'points= 1500, values= 1.1');
  });
  it("it throws an exception when we try to create a rv remuneration point with negative points", function() {
    promise = RvRemunerationPoint.create({
      minPoints: -1700,
      value: 1.15,
      startDate: new Date(),
      endDate: null
    });
    return promise.should.be.rejectedWith(Error, 'Validation error: Validation min on minPoints failed');
  });
  it("it throws an exception when we try to create a rv remuneration point with negative values", function() {
    promise = RvRemunerationPoint.create({
      minPoints: 1700,
      value: -1.1,
      startDate: new Date(),
      endDate: null
    });
    return promise.should.be.rejectedWith(Error, 'Validation error: Validation min on value failed');
  });
});
