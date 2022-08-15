const { addBookHandler, getAllBooksHandler, getBookByIdHandler, updatedBookByIdHandler, deletedBookById } = require("./handler");

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
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deletedBookById
  }
];

module.exports = routes;
