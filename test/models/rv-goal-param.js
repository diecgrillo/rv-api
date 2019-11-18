'use strict';
const RvGoalParam = require('../../models').RvGoalParam;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;
chai.use(chaiAsPromised);
chai.should();

describe('rv-goal-params', function() {
  var date = new Date();
  var rvGoalParam1;

  // clear the rv-goal-param table
  beforeEach(async function() {
    await RvGoalParam.destroy({where: {}});
  });
  // insert some rv-goal-param
  beforeEach(async function() {
    await RvGoalParam.create({
      individualGoalWeight: 0.8,
      teamGoalWeight: 0.2,
      startDate: date,
      endDate: null,
    }).then(
      (rvGoalParam) => { rvGoalParam1 = rvGoalParam.dataValues; },
    );
    await RvGoalParam.create({
      individualGoalWeight: 0.7,
      teamGoalWeight: 0.3,
      startDate: new Date(Date.now() - (2 * 864e5)),
      endDate: new Date(Date.now() - 864e5),
    });
  });
  it('it return the active rv goal params', function() {
    return RvGoalParam.scope('actives').findAll({}).then((rvGoalParams) => {
      var dataValues = rvGoalParams.map(function(rvGoalParam) {
        return rvGoalParam.dataValues;
      });
      expect(dataValues).to.have.deep.members([rvGoalParam1]);
    });
  });
  it('it throws an exception when we try to create a param that is already active', function() {
    var promise = RvGoalParam.create({
      individualGoalWeight: 0.7,
      teamGoalWeight: 0.3,
      startDate: new Date(),
      endDate: null,
    });
    return promise.should.be.rejectedWith(Error, 'Only one active param is allowed.');
  });
  it('it throws an exception when we try to create a param which the sum of ' +
    'individual and team goal is not 1.', function() {
    var promise = RvGoalParam.create({
      individualGoalWeight: 0.7,
      teamGoalWeight: 0.4,
      startDate: new Date(),
      endDate: null,
    });
    return promise.should.be.rejectedWith(
      Error, 'Sum of team goal and individual goal should be 1. individual= ' +
        0.4 + ', team= ' + 0.7,
    );
  });
});
