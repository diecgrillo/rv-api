const RvTask = require('../models').RvTask;
const sinon = require("sinon");
var chai = require("chai");
var expect = chai.expect;
var supertest = require("supertest");
var app = require("../app");

describe("rv-task routes", function() {
  describe("404, Not Found", function() {
    it("it returns 404 when the requested page is not found", function(done) {
      supertest(app)
      .get("/pudim/")
      .expect(404, '<h1>Not Found</h1>\n<h2></h2>\n<pre></pre>\n')
      .end(done);
    });
  });
  describe("500, error handler", function() {
    it("it returns 500 when there is an error not handled", function(done) {
      stub = sinon.stub(RvTask, "findAll").throws(new Error('error in findAll function'))
      supertest(app)
      .get("/rv-tasks/")
      .expect(function(res){
        stub.restore();
      })
      .expect(500)
      .end(done);
    });
  });
});
