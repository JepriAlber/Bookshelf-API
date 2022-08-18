const { nanoid } = require ('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
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
            });

            response.code(400);
            return response;
        }

    //buat variabel baru untuk menampung data 
    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    books.push(newBook);
        //lakukan filter untuk mengecekan apakah data dengan id yang baru sudah masuk atau belum, jika ada berati data berhasil dimasukan.
        const isSuccess = books.filter((book) => book.id === id).length > 0;

        //jika berhasil atau gagal data untuk disimpan maka berikan pesan.
        if(isSuccess){
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data:{
                    bookId: id
                },
            });

            response.code(201);
            return response;
        }else{
            const response = h.response({
                status: 'error',
                message: 'Buku gagal ditambahkan',
            });

            response.code(500);
            return response;
        }

}

const getAllBooksHandler = (request, h) => {

    let filterBooks = books;

    const { name, reading, finished } = request.query;

    //hasil tidak sesuia, tidak didapatkan
    if(name !== undefined){
        filterBooks = filterBooks.filter( (book) => book.name.toLowerCase().includes(name.toLowerCase()) ); //include untuk mencari apakah suatu substring berada dalam suatu string
    }

    if(reading !== undefined){
        filterBooks = filterBooks.filter( (book) => book.reading === !!Number(reading) ); //!!Number() akan memberikan nilai true atau false jika 0 false 1 true
    }

    if(finished !== undefined){
        filterBooks = filterBooks.filter( (book) => book.finished === !!Number(finished) );
    }

    const response = h.response({
        status: 'success',
        data: {
            books: filterBooks.map( (book) => ({ 
                id: book.id,
                name: book.name,
                publisher: book.publisher
            })),
        } 
    });
    response.code(200);
    return response;

};

const getBookByIdHandler = (request, h) => {

    const { bookId } = request.params;
    const book = books.filter( (book) => book.id === bookId)[0];

        if(book !== undefined){
            const response = h.response({
                status: 'success',
                data: {
                    book,
                },
            });

            response.code(200);
            return response;
        }else{
            const response = h.response({
                status: 'fail',
                message: 'Buku tidak ditemukan',
            });
    
            response.code(404);
            return response;
        }
        
}

const updatedBookByIdHandler = (request, h) => {

    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const updatedAt = new Date().toISOString();
    let finished;
    
        //untuk memastikan nilai banding (page dan read) bertipe number
        if( typeof pageCount == 'number' && typeof readPage == 'number'){
            //status membaca buku menjadi true ketika halaman baca sama dengan total halaman buku
            if(pageCount === readPage){
                finished = true
            }else if(readPage > pageCount){ //gagal disebabkan halaman baca lebih besar daripada total halaman buku
                const response = h.response({
                    status: 'fail',
                    message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
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
            });

            response.code(400);
            return response;
        }

        const index = books.findIndex( (book) => book.id === bookId );

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
                    message: 'Buku berhasil diperbarui',
                });

                response.code(200);
                return response;
            
            }else{
                const response = h.response({
                    status: 'fail',
                    message: 'Gagal memperbarui buku. Id tidak ditemukan',
                });
                
                response.code(404);
                return response;
            } 

}

const deletedBookById = (request, h) => {

    const { bookId } = request.params;
    const index = books.findIndex( (book) => book.id === bookId );

        if(index !== -1){
            books.splice(bookId, 1);

            const response = h.response({
                status: 'success',
                message: 'Buku berhasil dihapus'
            });

            response.code(200);
            return response;
        }else{
            const response = h.response({
                status: 'fail',
                message: 'Buku gagal dihapus. Id tidak ditemukan'
            });

            response.code(404);
            return response;
        }

}

module.exports = {
    addBookHandler, getAllBooksHandler, getBookByIdHandler, updatedBookByIdHandler, deletedBookById
}