const RvTaskResult = require('../../models').RvTaskResult;
const Sequelize = require('sequelize');
const config = require(__dirname + '/../../config/config.json')['test'];
const sequelize = new Sequelize(config.database, config.username, config.password, config);
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
chai.use(chaiAsPromised);
chai.should();

describe("rv-task-results", function() {
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
      taskValue: 30
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
      baseDate: new Date(Date.now() - 31 * 864e5)
    }).then(
      (taskResult)=> { taskResult3 = taskResult.dataValues; }
    );
  })
  it("it return the active task results", function() {
    return RvTaskResult.scope(
      { method: ['fromBaseDate', 1, new Date()]}
    ).findAll({}).then((taskResults) => {
      dataValues = taskResults.map(function(taskResult) {
        return taskResult.dataValues
      });
      expect(dataValues).to.have.deep.members([taskResult1,taskResult2])
    });
  });
  it("it sets the base date to the last day of the month before save", function() {
    date = new Date();
    expect(new Date(taskResult1.baseDate).setHours(0,0,0,0)).to.eq(new Date(date.getFullYear(), date.getMonth() + 1, 0).setHours(0,0,0,0));
  });
  it("it throws an exception when we try to create a task result for a base date that already exists", function() {
    promise = RvTaskResult.create({
      userId: 1,
      taskNumber: 1,
      points: 15,
      taskValue: 30,
      baseDate: new Date()
    });
    return promise.should.be.rejectedWith(Error, 'Validation error');
  });
});
