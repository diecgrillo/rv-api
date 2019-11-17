const RvTaskResult = require('../../models').RvTaskResult;
const Sequelize = require('sequelize');
const config = require(__dirname + '/../../config/config.json')['test'];
const sequelize = new Sequelize(config.database, config.username, config.password, config);
const sinon = require("sinon");
var chai = require("chai");
var expect = chai.expect;
var supertest = require("supertest");
var app = require("../../app");

describe("rv-task-results routes", function() {
  var date = new Date();
  var taskResult1, taskResult2, taskResult3;

  // clear the rv-task-results table
  beforeEach(async function() {
    await RvTaskResult.destroy({where: {}});
  });
  // insert some rv-task-results
  beforeEach(async function() {
    await RvTaskResult.create({
      userId: 1,
      taskNumber: 1,
      points: 10,
      taskValue: 30,
      baseDate: new Date()
    }).then(
      (taskResult) => { taskResult1 = taskResult.dataValues; }
    );
    await RvTaskResult.create({
      userId: 1,
      taskNumber: 2,
      points: 8,
      taskValue: 20,
      baseDate: new Date()
    }).then(
      (taskResult)=> { taskResult2 = taskResult.dataValues; }
    );
    await RvTaskResult.create({
      userId: 1,
      taskNumber: 3,
      points: 15,
      taskValue: 40,
      baseDate: new Date('2019/09/09')
    }).then(
      (taskResult)=> { taskResult3 = taskResult.dataValues; }
    );
  })

  describe("get /rv-task-results/", function() {
    it("it returns the rv-task-results for the user in the current base date", function(done) {
      rvTaskResults = {
        rv_task_results: [
          {
            id: taskResult1.id,
            userId: taskResult1.userId,
            taskNumber: taskResult1.taskNumber,
            points: taskResult1.points,
            taskValue: taskResult1.taskValue,
            baseDate: taskResult1.baseDate
          },
          {
            id: taskResult2.id,
            userId: taskResult2.userId,
            taskNumber: taskResult2.taskNumber,
            points: taskResult2.points,
            taskValue: taskResult2.taskValue,
            baseDate: taskResult2.baseDate
          }
        ]
      }
      supertest(app)
      .get("/rv-task-results/1")
      .expect(200, rvTaskResults)
      .end(done);
    });
    it("it return the rv-task-results for the user in the given base date", function(done) {
      rvTaskResults = {
        rv_task_results: [
          {
            id: taskResult3.id,
            userId: taskResult3.userId,
            taskNumber: taskResult3.taskNumber,
            points: taskResult3.points,
            taskValue: taskResult3.taskValue,
            baseDate: taskResult3.baseDate
          }
        ]
      }
      supertest(app)
      .get("/rv-task-results/1?base_date=2019-09-02")
      .expect(200, rvTaskResults)
      .end(done);
    });
    it("it responds with 400 when there is some exception trying to get the rv task results", function(done){
      stub = sinon.stub(RvTaskResult, "findAll").rejects(new Error('error in findAll function'))
      supertest(app)
      .get("/rv-task-results/1")
      .expect(function(res){
        stub.restore();
      })
      .expect(400, "error in findAll function")
      .end(done);
    });
  });
  describe("post /rv-task-results", function() {
    it("when there is already an active task resutl, it updates the existing task result", function(done){
      taskResult = [
        [
          {
            "userId": 1,
            "taskNumber": 3,
            "points": "30",
            "taskValue": "90",
            "baseDate": "2019-09-30"
          },
          false
        ]
      ]
      supertest(app)
      .post("/rv-task-results/")
      .send({
        "rv_task_results": [{
  		    "user_id": 1,
          "task_number": 3,
          "points": 30,
          "task_value": 90,
          "base_date": "2019-09-09"
        }]
      })
      .expect(function(res){
        expect(res.body[0][0]).to.deep.include(taskResult[0][0])
        expect(res.body[0][1]).to.equal(taskResult[0][1])
      })
      .expect(200)
      .end(done);
    });
    it("when there is no active task resutl, it creates a new task result", function(done){
      taskResult = [
        [
          {
            "userId": 2,
            "taskNumber": 1,
            "points": "30",
            "taskValue": "33",
            "baseDate": "2019-11-30"
          },
          true
        ]
      ]
      supertest(app)
      .post("/rv-task-results/")
      .send({
        "rv_task_results": [{
  		    "user_id": 2,
          "task_number": 1,
          "points": 30,
          "task_value": 33,
          "base_date": "2019-11-03"
        }]
      })
      .expect(function(res){
        expect(res.body[0][0]).to.deep.include(taskResult[0][0])
        expect(res.body[0][1]).to.equal(taskResult[0][1])
      })
      .expect(200)
      .end(done);
    });
    it("it responds with 400 when there is some exception trying to update a task", function(done){
      stub = sinon.stub(RvTaskResult, "upsert").rejects(new Error('error in upsert function'))

      supertest(app)
      .post("/rv-task-results/")
      .send({
        "rv_task_results": [{
  		    "user_id": 2,
          "task_number": 1,
          "points": 30,
          "task_value": 33,
          "base_date": "2019-11-03"
        }]
      })
      .expect(function(res){
        stub.restore();
      })
      .expect(400, "error in upsert function")
      .end(done);
    });
  });
});
