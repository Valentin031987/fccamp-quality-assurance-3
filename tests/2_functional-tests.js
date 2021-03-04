/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
var ObjectId = require('mongoose').Types.ObjectId;

const bookObj = {
  _id: ObjectId(),
  title: 'Test Book Title'
}

const id_not_exist = '604158c50f1c5f0717624f43';

chai.use(chaiHttp);

suite('Functional Tests', function () {

   suite('Routing tests', function () {
 
     suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post('/api/books')
          .send(bookObj)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title', 'Books should contain title');
            assert.property(res.body, '_id', 'Books should contain _id');
            done(); 
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/' + id_not_exist)
          .query({ id: id_not_exist })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get('/api/books/' + bookObj._id)
          .end(function (err, res) {
            assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            done();
          });
      });
  
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
          .post('/api/books/' + bookObj._id)
          .send({ _id: bookObj._id, comment: 'Test Comment' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body, 'comments', 'Books in array should contain comments');
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            assert.equal(res.body._id, bookObj._id);
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server)
          .post('/api/books/' + bookObj._id)
          .send({ _id: bookObj._id })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai.request(server)
          .post('/api/books/' + id_not_exist)
          .send({ _id: id_not_exist, comment: 'Test comment' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .delete('/api/books/' + bookObj._id)
          .send({ id: bookObj._id })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
          .delete('/api/books/' + id_not_exist)
          .send({ _id: id_not_exist })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});
