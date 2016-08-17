var  app = require('../app');
var supertest = require("supertest");

describe("Express Server API", function () {
  describe("should return users json on get /users", function () {
    it("returns status code 200", function (done) {
      supertest(app)
        .get('/movies')
        .set('Accept', 'text/html')
        .expect('Content-Type', /json/)
        .expect(200,done);
    });

  });

  it('returns status 404 when name is not found', function(done) {
   console.log("in 404 test");
   supertest(app)
     .get('/users/junius')
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .expect(404);
     done();
 });
});
