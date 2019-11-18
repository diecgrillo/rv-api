'use strict';
const RvTask = require('../../models').RvTask;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;
chai.use(chaiAsPromised);
chai.should();

describe('rv-tasks', function() {
  var date = new Date();
  var task1, task2;

  // clear the rv-tasks table
  beforeEach(async function() {
    await RvTask.destroy({where: {}});
  });
  // insert some rv-tasks
  beforeEach(async function() {
    await RvTask.create({
      name: 'Task 1',
      taskNumber: 1,
      points: 10,
      startDate: date,
      endDate: null,
    }).then(
      (task) => { task1 = task.dataValues; },
    );
    await RvTask.create({
      name: 'Task 2',
      taskNumber: 2,
      points: 8,
      startDate: date,
      endDate: new Date(Date.now() + 864e5),
    }).then(
      (task) => { task2 = task.dataValues; },
    );
    await RvTask.create({
      name: 'Task 3',
      taskNumber: 3,
      points: 15,
      startDate: new Date(Date.now() - (2 * 864e5)),
      endDate: new Date(Date.now() - 864e5),
    });
  });
  it('it return the active tasks', function() {
    return RvTask.scope('actives').findAll({}).then((tasks) => {
      var dataValues = tasks.map(function(task) {
        return task.dataValues;
      });
      expect(dataValues).to.have.deep.members([task1, task2]);
    });
  });
  it('it return the active task by task number', function() {
    return RvTask.scope((
      { method: ['active', task1.taskNumber]}
    )).findAll({}).then((tasks) => {
      var dataValues = tasks.map(function(task) {
        return task.dataValues;
      });
      expect(dataValues).to.have.deep.members([task1]);
    });
  });
  it('it throws an exception when we try to create a task that is already active', function() {
    var promise = RvTask.create({
      name: 'Task 4',
      taskNumber: 1,
      points: 15,
      startDate: new Date(),
      endDate: null,
    });
    return promise.should.be.rejectedWith(Error, 'The task 1 is already active.');
  });
});
