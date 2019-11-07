const RvResult = require('../../models').RvResult;
const Sequelize = require('sequelize');
const config = require(__dirname + '/../../config/config.json')['test'];
const sequelize = new Sequelize(config.database, config.username, config.password, config);
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
chai.use(chaiAsPromised);
chai.should();

describe("rv-results", function() {
  var date = new Date();
  var result1, result2;

  // clear the rv-results table
  beforeEach(async function() {
    await RvResult.destroy({where: {}});
  });
  // insert some rv-results
  beforeEach(async function() {
    await RvResult.create({
      userId: 1,
      points: 10,
      value: 300.00,
      origination: 100000,
      percentage: 0.9,
      remuneration: 1.1,
      baseDate: new Date()
    }).then(
      (result) => { result1 = result.dataValues; }
    );
    await RvResult.create({
      userId: 1,
      points: 15,
      value: 400.00,
      origination: 300000,
      percentage: 0.95,
      remuneration: 1.15,
      baseDate: new Date(Date.now() - 31 * 864e5)
    }).then(
      (result)=> { result2 = result.dataValues; }
    );
  })
  it("it return the active task results", function() {
    return RvResult.scope(
      { method: ['fromBaseDate', 1, new Date()]}
    ).findAll({}).then((results) => {
      dataValues = results.map(function(result) {
        return result.dataValues
      });
      expect(dataValues).to.have.deep.members([result1])
    });
  });
  it("it sets the base date to the last day of the month before save", function() {
    date = new Date();
    expect(new Date(result1.baseDate).setHours(0,0,0,0)).to.eq(new Date(date.getFullYear(), date.getMonth() + 1, 0).setHours(0,0,0,0));
  });
  it("it throws an exception when we try to create a rasult for a base date that already exists", function() {
    promise = RvResult.create({
      userId: 1,
      points: 15,
      value: 300.00,
      origination: 100000,
      percentage: 0.9,
      remuneration: 1.0,
      baseDate: new Date()
    });
    return promise.should.be.rejectedWith(Error, 'Validation error');
  });
  it("it throws an exception when we try to create a result with negative value", function() {
    promise = RvResult.create({
      userId: 2,
      points: 15,
      value: -300.00,
      origination: 100000,
      percentage: 0.9,
      remuneration: 1.0,
      baseDate: new Date()
    });
    return promise.should.be.rejectedWith(Error, 'Validation error: Validation min on value failed');
  });
  it("it throws an exception when we try to create a result with negative percentage", function() {
    promise = RvResult.create({
      userId: 2,
      points: 15,
      value: 300.00,
      origination: 100000,
      percentage: -0.9,
      remuneration: 1.0,
      baseDate: new Date()
    });
    return promise.should.be.rejectedWith(Error, 'Validation error: Validation min on percentage failed');
  });
  it("it throws an exception when we try to create a result with negative percentage", function() {
    promise = RvResult.create({
      userId: 2,
      points: 15,
      value: 300.00,
      origination: 100000,
      percentage: 0.9,
      remuneration: -1.0,
      baseDate: new Date()
    });
    return promise.should.be.rejectedWith(Error, 'Validation error: Validation min on remuneration failed');
  });
});
