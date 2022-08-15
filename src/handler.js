const { nanoid } = require ('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const bookId = nanoid(16);
    const insertedAT = new Date().toISOString();
    const updatedAt = insertedAT;
    let finished = false;

        //untuk memastikan nilai banding (page dan read) bertipe number
        if( typeof pageCount == 'number' && typeof readPage == 'number'){
            //status membaca buku menjadi true ketika halaman baca sama dengan total halaman buku
            if(pageCount === readPage){
                finished = true
            }else if(readPage > pageCount){ //gagal disebabkan halaman baca lebih besar daripada total halaman buku
                const response = h.response({
                    status: 'fail',
                    message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
                });
                
                response.code(400);
                return response;
            }else{
                finished = false;
            }
        }

        //untuk mengecek apakah request membawa properti name atau tidak
        if( typeof name === 'undefined'){
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku',
                data:{
                    name: name
                }
                
            });

            response.code(400);
            return response;
        }

    //buat variabel baru untuk menampung data 
    const newBook = {
        bookId, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAT, updatedAt,
    };

    books.push(newBook);
        //lakukan filter untuk mengecekan apakah data dengan id yang baru sudah masuk atau belum, jika ada berati data berhasil dimasukan.
        const isSuccess = books.filter((book) => book.bookId === bookId).length > 0;

        //jika berhasil atau gagal data untuk disimpan maka berikan pesan.
        if(isSuccess){
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data:{
                    bookId: bookId
                },
            });

            response.code(200);
            return response;
        }
            const response = h.response({
                status: 'error',
                message: 'Buku gagal ditambahkan',
                data:newBook
            });

            response.code(500);
            return response;

}

const getAllBooksHandler = () => ({
    status: 'success',
    data: {
        books: books.map( (book) => ({ 
            id: book.bookId,
            name: book.name,
            publisher: book.publisher
        })),
    } 
});

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter( (n) => n.bookId === bookId)[0];

        if(book !== undefined){
           return {
                status: 'success',
                data: {
                    book
                },
           }
        }else{
            const response = h.response({
                status: 'fail',
                message: 'Buku tidak ditemukan'
            });

            response.code(404);
            return response;
        }
}

const updatedBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

        //untuk memastikan nilai banding (page dan read) bertipe number
        if( typeof pageCount == 'number' && typeof readPage == 'number'){
            //status membaca buku menjadi true ketika halaman baca sama dengan total halaman buku
            if(pageCount === readPage){
                finished = true
            }else if(readPage > pageCount){ //gagal disebabkan halaman baca lebih besar daripada total halaman buku
                const response = h.response({
                    status: 'fail',
                    message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
                });
                
                response.code(400);
                return response;
            }else{
                finished = false;
            }
        }

        //untuk mengecek apakah request membawa properti name atau tidak
        if( typeof name === 'undefined'){
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
                data:{
                    name: name
                }
                
            });

            response.code(400);
            return response;
        }

        const index = books.findIndex( (book) => book.bookId === bookId);

            if(index !== -1){
                books[index] = {
                    ...books[index],
                    name, 
                    year, 
                    author, 
                    summary,
                    publisher, 
                    pageCount, 
                    readPage, 
                    finished, 
                    reading, 
                    updatedAt,
                };

                const response = h.response({
                    status: 'success',
                    message: 'Buku berhasil diperbarui'
                });

                response.code(200);
                return response;
            }else{
                const response = h.response({
                    status: 'success',
                    message: 'Gagal memperbarui buku. Id tidak ditemukan'
                });
                
                response.code(400);
                return response;
            }

}

module.exports = {
    addBookHandler, getAllBooksHandler, getBookByIdHandler, updatedBookByIdHandler
}