'use strict';
const RvGoalParam = require('../../models').RvGoalParam;
const sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../../app');

describe('rv-goal-param routes', function() {
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

  describe('get /rv-goal-params/', function() {
    it('it returns the active goal-params', function(done) {
      var rvGoalParams = {
        rv_goal_params: [
          { id: rvGoalParam1.id,
            individualGoalWeight: rvGoalParam1.individualGoalWeight,
            teamGoalWeight: rvGoalParam1.teamGoalWeight },
        ],
      };
      supertest(app)
        .get('/rv-goal-params/')
        .expect(200, rvGoalParams)
        .end(done);
    });
    it('it responds with 400 when there is some exception trying to get the active ' +
      'goal params', function(done){
      var stub = sinon.stub(RvGoalParam, 'findAll').rejects(new Error('error in findAll function'));
      supertest(app)
        .get('/rv-goal-params/')
        .expect(function(res){
          stub.restore();
        })
        .expect(400, 'error in findAll function')
        .end(done);
    });
  });
  describe('post /rv-goal-params/', function() {
    it('it responds with validation error when the sum of team goal and individual ' +
      'goal is not 1.', function(done){
      supertest(app)
        .post('/rv-goal-params/rv-goal-param/')
        .send({
          individual_goal_weight: 0.75,
          team_goal_weight: 0.35,
        })
        .expect(function(res){
          expect(res.text).to.equal('Validation error: ' +
          'Sum of team goal and individual goal should be 1. individual= 0.35, team= 0.75');
        })
        .expect(400)
        .end(done);
    });
    it('it creates a new rv goal param', function(done){
      var rvGoalParam = {
        individualGoalWeight: '0.75',
        teamGoalWeight: '0.25',
      };
      supertest(app)
        .post('/rv-goal-params/rv-goal-param/')
        .send({
          individual_goal_weight: 0.75,
          team_goal_weight: 0.25,
        })
        .expect(function(res){
          expect(res.body).to.deep.include(rvGoalParam);
        })
        .expect(200)
        .end(done);
    });
  });
});
