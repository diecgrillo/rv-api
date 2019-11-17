const RvRemunerationPoint = require('../../models').RvRemunerationPoint;
const Sequelize = require('sequelize');
const config = require(__dirname + '/../../config/config.json')['test'];
const sequelize = new Sequelize(config.database, config.username, config.password, config);
const sinon = require("sinon");
var chai = require("chai");
var expect = chai.expect;
var supertest = require("supertest");
var app = require("../../app");

describe("rv-remuneration-point routes", function() {
  var date = new Date();
  var rvRemunerationPoint1, rvRemunerationPoint2, rvRemunerationPoint3;

  // clear the rv-remuneration-point table
  beforeEach(async function() {
    await RvRemunerationPoint.destroy({where: {}});
  });
  // insert some rv-remuneration-point
  beforeEach(async function() {
    await RvRemunerationPoint.create({
      minPoints: 1300,
      value: 1.0,
      startDate: date,
      endDate: null
    }).then(
      (rvRemunerationPoint) => { rvRemunerationPoint1 = rvRemunerationPoint.dataValues; }
    );
    await RvRemunerationPoint.create({
      minPoints: 1500,
      value: 1.1,
      startDate: date,
      endDate: new Date(Date.now() + 864e5)
    }).then(
      (rvRemunerationPoint)=> { rvRemunerationPoint2 = rvRemunerationPoint.dataValues; }
    );
    await RvRemunerationPoint.create({
      minPoints: 1600,
      value: 1.11,
      startDate: new Date(Date.now() - (2 * 864e5)),
      endDate: new Date(Date.now() - 864e5)
    }).then(
      (rvRemunerationPoint)=> { rvRemunerationPoint3 = rvRemunerationPoint.dataValues; }
    );
  });

  describe("get /rv-remuneration-points/", function() {
    it("it returns the active remuneration-points", function(done) {
      rvRemunerationPoints = {
        rv_remuneration_points: [
          { id: rvRemunerationPoint1.id, value: rvRemunerationPoint1.value, minPoints: rvRemunerationPoint1.minPoints },
          { id: rvRemunerationPoint2.id, value: rvRemunerationPoint2.value, minPoints: rvRemunerationPoint2.minPoints }
        ]
      }
      supertest(app)
      .get("/rv-remuneration-points/")
      .expect(200, rvRemunerationPoints)
      .end(done);
    });
    it("it responds with 400 when there is some exception trying to get the active remuneration points", function(done){
      stub = sinon.stub(RvRemunerationPoint, "findAll").rejects(new Error('error in findAll function'))
      supertest(app)
      .get("/rv-remuneration-points/")
      .expect(function(res){
        stub.restore();
      })
      .expect(400, "error in findAll function")
      .end(done);
    });
  });
  describe("post /rv-remuneration-points/", function() {
    it("it creates a new rv remuneration", function(done){
      rvRemunerationPoints = {
        value: "1.12",
        minPoints: "1300"
      }
      supertest(app)
      .post("/rv-remuneration-points/")
      .send({
        "rv_remuneration_points": [{
           "value": 1.12,
	         "min_points": 1300
         }]
      })
      .expect(function(res){
        expect(res.body[0]).to.deep.include(rvRemunerationPoints);
      })
      .expect(200)
      .end(done);
    });
    it("it fails to create a new rv remuneration when the value is negative", function(done){
      supertest(app)
      .post("/rv-remuneration-points/")
      .send({
        "rv_remuneration_points": [{
           "value": -1.12,
	         "min_points": 1300
         }]
      })
      .expect(function(res){
        expect(res.text).to.equal("Validation error: Validation min on value failed");
      })
      .expect(400)
      .end(done);
    });
    it("it fails to create a new rv remuneration when the minimum punctuation is negative", function(done){
      supertest(app)
      .post("/rv-remuneration-points/")
      .send({
        "rv_remuneration_points": [{
           "value": 1.12,
	         "min_points": -1300
         }]
      })
      .expect(function(res){
        expect(res.text).to.equal("Validation error: Validation min on minPoints failed");
      })
      .expect(400)
      .end(done);
    });
    it("it fails to create a new rv remuneration when the same punctuation are inserted more than once.", function(done){
      supertest(app)
      .post("/rv-remuneration-points/")
      .send({
        "rv_remuneration_points": [{
           "value": 1.12,
	         "min_points": 1300
         },{
          "value": 1.11,
 	         "min_points": 1300
         }]
      })
      .expect(function(res){
        expect(res.text).to.equal("Cannot insert the same punctuation more than once.");
      })
      .expect(400)
      .end(done);
    });
    it("it fails to create a new rv remuneration when the same values are inserted more than once.", function(done){
      supertest(app)
      .post("/rv-remuneration-points/")
      .send({
        "rv_remuneration_points": [{
           "value": 1.11,
	         "min_points": 1400
         },{
          "value": 1.11,
 	         "min_points": 1300
         }]
      })
      .expect(function(res){
        expect(res.text).to.equal("Cannot insert the same value more than once.");
      })
      .expect(400)
      .end(done);
    });
  });
});
