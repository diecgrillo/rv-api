'use strict';
const RvResult = require('../../models').RvResult;
const sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../../app');

describe('rv-results routes', function() {
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
      baseDate: new Date(),
    }).then(
      (result) => { result1 = result.dataValues; },
    );
    await RvResult.create({
      userId: 1,
      points: 15,
      value: 400.00,
      origination: 300000,
      percentage: 0.95,
      remuneration: 1.15,
      baseDate: new Date('2019/09/09'),
    }).then(
      (result) => { result2 = result.dataValues; },
    );
  });

  describe('get /rv-results/', function() {
    it('it returns the rv-results for the user in the current base date', function(done) {
      var rvResults = {
        rv_result: {
          id: result1.id,
          userId: result1.userId,
          points: result1.points,
          value: result1.value,
          origination: result1.origination,
          percentage: result1.percentage,
          remuneration: result1.remuneration,
          baseDate: result1.baseDate,
        },
      };
      supertest(app)
        .get('/rv-results/1')
        .expect(200, rvResults)
        .end(done);
    });
    it('it return the rv-task-results for the user in the given base date', function(done) {
      var rvResults = {
        rv_result: {
          id: result2.id,
          userId: result2.userId,
          points: result2.points,
          value: result2.value,
          origination: result2.origination,
          percentage: result2.percentage,
          remuneration: result2.remuneration,
          baseDate: result2.baseDate,
        },
      };
      supertest(app)
        .get('/rv-results/1?base_date=2019-09-02')
        .expect(200, rvResults)
        .end(done);
    });
    it('it responds with 400 when there is some exception trying to get the results',
      function(done){
        var stub = sinon.stub(RvResult, 'findAll').rejects(new Error('error in findAll function'));
        supertest(app)
          .get('/rv-results/1')
          .expect(function(res){
            stub.restore();
          })
          .expect(400, 'error in findAll function')
          .end(done);
      });
  });
  describe('post /rv-results', function() {
    it('when there is already an active result, it updates the existing result', function(done){
      var result = [
        [
          {
            userId: 1,
            points: '30',
            value: '90',
            origination: '300000',
            percentage: '0.95',
            remuneration: '1.15',
            baseDate: '2019-09-30',
          },
          false,
        ],
      ];
      supertest(app)
        .post('/rv-results/')
        .send({
          rv_results: [{
            user_id: 1,
            points: 30,
            value: 90,
            origination: 300000,
            percentage: 0.95,
            remuneration: 1.15,
            base_date: '2019-09-09',
          }],
        })
        .expect(function(res){
          expect(res.body[0][0]).to.deep.include(result[0][0]);
          expect(res.body[0][1]).to.equal(result[0][1]);
        })
        .expect(200)
        .end(done);
    });
    it('when there is already an active result, it updates the existing result', function(done){
      var result = [
        [
          {
            userId: 2,
            points: '40',
            value: '70',
            origination: '800000',
            percentage: '0.95',
            remuneration: '1.15',
            baseDate: '2019-09-30',
          },
          true,
        ],
      ];
      supertest(app)
        .post('/rv-results/')
        .send({
          rv_results: [{
            user_id: 2,
            points: 40,
            value: 70,
            origination: 800000,
            percentage: 0.95,
            remuneration: 1.15,
            base_date: '2019-09-09',
          }],
        })
        .expect(function(res){
          expect(res.body[0][0]).to.deep.include(result[0][0]);
          expect(res.body[0][1]).to.equal(result[0][1]);
        })
        .expect(200)
        .end(done);
    });
    it('it fails to create a new rv result when the value is negative', function(done){
      supertest(app)
        .post('/rv-results/')
        .send({
          rv_results: [{
            user_id: 2,
            points: 40,
            value: -70,
            origination: 800000,
            percentage: 0.95,
            remuneration: 1.15,
            base_date: '2019-09-09',
          }],
        })
        .expect(function(res){
          expect(res.text).to.equal('Validation error: Validation min on value failed');
        })
        .expect(400)
        .end(done);
    });
    it('it fails to create a new rv result when the percentage is negative', function(done){
      supertest(app)
        .post('/rv-results/')
        .send({
          rv_results: [{
            user_id: 2,
            points: 40,
            value: 70,
            origination: 800000,
            percentage: -0.95,
            remuneration: 1.15,
            base_date: '2019-09-09',
          }],
        })
        .expect(function(res){
          expect(res.text).to.equal('Validation error: Validation min on percentage failed');
        })
        .expect(400)
        .end(done);
    });
    it('it fails to create a new rv result when the remuneration is negative', function(done){
      supertest(app)
        .post('/rv-results/')
        .send({
          rv_results: [{
            user_id: 2,
            points: 40,
            value: 70,
            origination: 800000,
            percentage: 0.95,
            remuneration: -1.15,
            base_date: '2019-09-09',
          }],
        })
        .expect(function(res){
          expect(res.text).to.equal('Validation error: Validation min on remuneration failed');
        })
        .expect(400)
        .end(done);
    });
  });
});
