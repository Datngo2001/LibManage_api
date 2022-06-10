import { HttpException } from '@exceptions/HttpException';
import { Book } from '@prisma/client';
import { isEmpty } from '@utils/util';
import prisma from '@/dbclient';
import { CreateBookDto } from '@/dtos/book.dto';
import Database from '@/Database';
import { FindBuilder } from '@/builder/FindBuilder';
import { CreateBuilder } from '@/builder/CreateBuilder';
import { UpdateBuilder } from '@/builder/UpdateBuilder';
import { DeleteBuilder } from '@/builder/DeleteBuilder';

class BookService {
    public findBuilder = new FindBuilder()
    public createBuilder = new CreateBuilder()
    public updateBuilder = new UpdateBuilder()
    public deleteBuilder = new DeleteBuilder()

    public books = Database.getInstance().book;

    public async findAllBook(): Promise<Book[]> {
        const query = this.findBuilder
            .addOrderBy({ name: "createdAt", isDesc: true })
            .getQuery();

        const Books: Book[] = await this.books.findMany(query);
        return Books;
    }

    public async findBookById(BookId: number): Promise<Book> {
        const query = this.findBuilder
            .whereId(BookId)
            .includeColumns(["borrowRegisters", "BookTitle", "borrowBills"])
            .getQuery();

        const findBook: Book = await this.books.findUnique(query)
        if (!findBook) throw new HttpException(409, "You're not Book");

        return findBook;
    }

    public async createBook(BookData: CreateBookDto): Promise<Book> {
        if (isEmpty(BookData)) throw new HttpException(400, "You're not BorrowRegisterData");

        const query = this.createBuilder
            .addColumn({ name: "isGood", value: BookData.isGood })
            .addColumn({ name: "BookTitle", value: { connect: { id: BookData.bookTitleId } } })
            .getQuery();

        const createBookData: Book = await this.books.create(query);

        return createBookData;
    }

    public async updateBook(BookId: number, BookData: CreateBookDto): Promise<Book> {
        if (isEmpty(BookData)) throw new HttpException(400, "Empty update data");

        const findBook: Book = await this.books.findUnique({ where: { id: BookId } })
        if (!findBook) throw new HttpException(409, "Your book title not exist");

        const query = this.updateBuilder
            .addColumn({ name: "isGood", value: BookData.isGood })
            .addColumn({ name: "BookTitle", value: { connect: { id: BookData.bookTitleId } } })
            .whereId(BookId)
            .getQuery();

        const updateBookData = await this.books.update(query);

        return updateBookData;
    }

    public async deleteBook(BookId: number): Promise<Book> {
        const findBook: Book = await this.books.findUnique({ where: { id: BookId } });
        if (!findBook) throw new HttpException(409, "You're not Book");

        const deleteBookData = await this.books.delete(this.deleteBuilder.whereId(BookId).getQuery());
        return deleteBookData;
    }
}

export default BookService;
