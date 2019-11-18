'use strict';
const RvGoalRangeParam = require('../../models').RvGoalRangeParam;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;
chai.use(chaiAsPromised);
chai.should();

describe('rv-goal-range-param', function() {
  var date = new Date();
  var rvGoalRangeParam1, rvGoalRangeParam2;

  // clear the rv-goal-range-param table
  beforeEach(async function() {
    await RvGoalRangeParam.destroy({where: {}});
  });
  // insert some rv-goal-range-param
  beforeEach(async function() {
    await RvGoalRangeParam.create({
      percentage: 0.85,
      startDate: date,
      endDate: null,
    }).then(
      (rvGoalRangeParam) => { rvGoalRangeParam1 = rvGoalRangeParam.dataValues; },
    );
    await RvGoalRangeParam.create({
      percentage: 0.95,
      startDate: date,
      endDate: new Date(Date.now() + 864e5),
    }).then(
      (rvGoalRangeParam) => { rvGoalRangeParam2 = rvGoalRangeParam.dataValues; },
    );
    await RvGoalRangeParam.create({
      percentage: 0.95,
      startDate: new Date(Date.now() - (2 * 864e5)),
      endDate: new Date(Date.now() - 864e5),
    });
  });
  it('it return the actives rv goal range params', function() {
    return RvGoalRangeParam.scope('actives').findAll({}).then((rvGoalRangeParams) => {
      var dataValues = rvGoalRangeParams.map(function(rvGoalRangeParam) {
        return rvGoalRangeParam.dataValues;
      });
      expect(dataValues).to.have.deep.members([rvGoalRangeParam1, rvGoalRangeParam2]);
    });
  });
  it('it throws an exception when we try to create more than one rv goal range ' +
    'param with same percentage', function() {
    var promise = RvGoalRangeParam.bulkCreate([
      {
        percentage: 1.15,
        startDate: new Date(),
        endDate: null,
      },
      {
        percentage: 1.15,
        startDate: new Date(),
        endDate: null,
      },
    ]);
    return promise.should.be.rejectedWith(
      Error, 'Cannot insert the same percentage more than once.',
    );
  });
  it('it throws an exception when we try to create a rv goal range param with ' +
    'values that are already active', function() {
    var promise = RvGoalRangeParam.bulkCreate([{
      percentage: 0.95,
      startDate: new Date(),
      endDate: null,
    }]);
    return promise.should.be.rejectedWith(Error, 'Percentages 0.95 are already active.');
  });
  it('it throws an exception when we try to create a rv goal range param with ' +
    'negative percentage', function() {
    var promise = RvGoalRangeParam.create({
      percentage: -1.1,
      startDate: new Date(),
      endDate: null,
    });
    return promise.should.be.rejectedWith(
      Error, 'Validation error: Validation min on percentage failed',
    );
  });
});
