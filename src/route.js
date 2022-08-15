const { addBookHandler, getAllBooksHandler, getBookByIdHandler, updatedBookByIdHandler } = require("./handler");

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler
  },
  {
    method:'GET',
    path: '/books',
    handler: getAllBooksHandler
  },
  {
    method:'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updatedBookByIdHandler
  }
];

module.exports = routes;
