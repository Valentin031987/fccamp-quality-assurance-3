'use strict';
const service = require('../service')

module.exports = function (app) {

  app.route('/api/books/')
    .get(async function (req, res) {
      let response = await service.getBooks();
      if (response.error) {
        return res.send(response.error)
      }
      res.json(response);
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      let { _id, title } = req.body;
      let response = await service.createAndSaveBook({ _id, title })
      if (response.error) {
        return res.send(response.error)
      }
      res.json(response);
    })

    .delete(async function (req, res) {
      let response = await service.removeAll();
      if (response.error) {
        return res.send(response.error)
      }
      res.send(response);
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {

      let _id = req.params.id;
      let response = await service.getBooks({ _id });
      if (response.error) {
        return res.send(response.error)
      }
      res.json(response[0]);
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      let response = await service.addComment(bookid, comment);
      if (response.error) {
        return res.send(response.error)
      }
      res.json(response);
      //json res format same as .get
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      let response = await service.removeById(bookid);
      if (response.error) {
        return res.send(response.error)
      }
      res.send(response);
    });

};
