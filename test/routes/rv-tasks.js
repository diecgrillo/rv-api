'use strict';
const RvTask = require('../../models').RvTask;
const sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../../app');

describe('rv-task routes', function() {
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

  describe('get /rv-tasks/', function() {
    it('it returns the active tasks', function(done) {
      var rvTasks = {
        rv_tasks: [
          { id: task1.id, task_number: task1.taskNumber, name: task1.name, points: task1.points },
          { id: task2.id, task_number: task2.taskNumber, name: task2.name, points: task2.points },
        ],
      };
      supertest(app)
        .get('/rv-tasks/')
        .expect(200, rvTasks)
        .end(done);
    });
    it('it responds with 400 when there is some exception ' +
    'trying to get the active rv tasks', function(done){
      var stub = sinon.stub(RvTask, 'findAll').rejects(new Error('error in findAll function'));
      supertest(app)
        .get('/rv-tasks/')
        .expect(function(res){
          stub.restore();
        })
        .expect(400, 'error in findAll function')
        .end(done);
    });
  });
  describe('post /rv-tasks/rv-task', function() {
    it('it creates a new task', function(done){
      var rvTask = {
        name: 'Rolagem',
        points: '-300',
        taskNumber: 3,
      };
      supertest(app)
        .post('/rv-tasks/rv-task')
        .send({
          task_number: 3,
          name: 'Rolagem',
          points: -300,
        })
        .expect(function(res){
          expect(res.body).to.deep.include(rvTask);
        })
        .expect(200)
        .end(done);
    });
    it(
      'responds with 400 when there is some exception trying to update a task',
      function(done){
        var stub = sinon.stub(RvTask, 'update').rejects(new Error('error in update function'));

        supertest(app)
          .post('/rv-tasks/rv-task')
          .send({
            task_number: 3,
            name: 'Rolagem',
            points: -300,
          })
          .expect(function(res){
            stub.restore();
          })
          .expect(400, 'error in update function')
          .end(done);
      });
  });
});
