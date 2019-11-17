const RvGoalRangeParam = require('../../models').RvGoalRangeParam;
const Sequelize = require('sequelize');
const config = require(__dirname + '/../../config/config.json')['test'];
const sequelize = new Sequelize(config.database, config.username, config.password, config);
var chai = require("chai");
var expect = chai.expect;
var supertest = require("supertest");
var app = require("../../app");

describe("rv-goal-range-param routes", function() {
  var date = new Date();
  var rvGoalRangeParam1, rvGoalRangeParam2, rvGoalRangeParam3;

  // clear the rv-goal-range-param table
  beforeEach(async function() {
    await RvGoalRangeParam.destroy({where: {}});
  });
  // insert some rv-goal-range-param
  beforeEach(async function() {
    await RvGoalRangeParam.create({
      percentage: 0.85,
      startDate: date,
      endDate: null
    }).then(
      (rvGoalRangeParam) => { rvGoalRangeParam1 = rvGoalRangeParam.dataValues; }
    );
    await RvGoalRangeParam.create({
      percentage: 0.95,
      startDate: date,
      endDate: new Date(Date.now() + 864e5)
    }).then(
      (rvGoalRangeParam)=> { rvGoalRangeParam2 = rvGoalRangeParam.dataValues; }
    );
    await RvGoalRangeParam.create({
      percentage: 0.95,
      startDate: new Date(Date.now() - (2 * 864e5)),
      endDate: new Date(Date.now() - 864e5)
    }).then(
      (rvGoalRangeParam)=> { rvGoalRangeParam3 = rvGoalRangeParam.dataValues; }
    );
  });

  describe("get /rv-goal-range-params/", function() {
    it("it returns the actives rv goal range params", function(done) {
      rvGoalRangeParams = {
        rv_goal_range_params: [
          { id: rvGoalRangeParam1.id, percentage: rvGoalRangeParam1.percentage },
          { id: rvGoalRangeParam2.id, percentage: rvGoalRangeParam2.percentage }
        ]
      }
      supertest(app)
      .get("/rv-goal-range-params/")
      .expect(200, rvGoalRangeParams)
      .end(done);
    });
  });
  describe("post /rv-goal-range-params/", function() {
    it("it creates a new rv goal range params", function(done){
      rvGoalRangeParams = {
        percentage: "1.12",
      }
      supertest(app)
      .post("/rv-goal-range-params/")
      .send({
        "rv_goal_range_params": [{
           "percentage": 1.12
         }]
      })
      .expect(function(res){
        expect(res.body[0]).to.deep.include(rvGoalRangeParams);
      })
      .expect(200)
      .end(done);
    });
    it("it fails to create a new rv goal range param when the value is negative", function(done){
      supertest(app)
      .post("/rv-goal-range-params/")
      .send({
        "rv_goal_range_params": [{
           "percentage": -1.12
         }]
      })
      .expect(function(res){
        expect(res.text).to.equal("Validation error: Validation min on percentage failed");
      })
      .expect(400)
      .end(done);
    });
    it("it fails to create a new rv remuneration when the same percentage are inserted more than once.", function(done){
      supertest(app)
      .post("/rv-goal-range-params/")
      .send({
        "rv_goal_range_params": [{
           "value": 1.12
         },{
           "value": 1.12
         }]
      })
      .expect(function(res){
        expect(res.text).to.equal("Cannot insert the same percentage more than once.");
      })
      .expect(400)
      .end(done);
    });
  });
});
