import { HttpException } from '@exceptions/HttpException';
import { BookTitle } from '@prisma/client';
import { isEmpty } from '@utils/util';
import prisma from '@/dbclient';
import { CreateBookTitleDto } from '@/dtos/booktitle.dto';
import { plainToClass, plainToClassFromExist } from 'class-transformer';

class BookTitleService {
    public bookTitles = prisma.bookTitle;

    public async findAllBookTitle(): Promise<BookTitle[]> {
        const BookTitles: BookTitle[] = await this.bookTitles.findMany();
        return BookTitles;
    }

    public async findBookTitleById(BookTitleId: number): Promise<BookTitle> {
        const findBookTitle: BookTitle = await this.bookTitles.findUnique({ where: { id: BookTitleId } })
        if (!findBookTitle) throw new HttpException(409, "You're not BookTitle");

        return findBookTitle;
    }

    public async createBookTitle(BookTitleData: CreateBookTitleDto): Promise<BookTitle> {
        if (isEmpty(BookTitleData)) throw new HttpException(400, "You're not BookTitleData");

        const findBookTitle: BookTitle = await this.bookTitles.findUnique({ where: { title: BookTitleData.title } });
        if (findBookTitle) throw new HttpException(409, `Your Book Title ${BookTitleData.title} already exists`);

        const categorys = BookTitleData.categoryIds.map(id => { return { id: id } })
        const books = BookTitleData.bookIds.map(id => { return { id: id } })
        const createBookTitleData: BookTitle = await this.bookTitles.create({
            data: {
                title: BookTitleData.title,
                author: BookTitleData.author,
                image: BookTitleData.image,
                description: BookTitleData.description,
                categorys: {
                    connect: categorys
                },
                books: {
                    connect: books
                }
            }
        });

        return createBookTitleData;
    }

    public async updateBookTitle(BookTitleId: number, BookTitleData: CreateBookTitleDto): Promise<BookTitle> {
        if (isEmpty(BookTitleData)) throw new HttpException(400, "Empty update data");

        var findBookTitle: BookTitle = await this.bookTitles.findUnique({ where: { id: BookTitleId } })
        if (!findBookTitle) throw new HttpException(409, "Your book title not exist");

        findBookTitle = await this.bookTitles.findUnique({ where: { title: BookTitleData.title } });
        if (findBookTitle) throw new HttpException(409, `Your Book Title ${BookTitleData.title} already exists`);

        const categorys = BookTitleData.categoryIds.map(id => { return { id: id } })
        const books = BookTitleData.bookIds.map(id => { return { id: id } })
        const updateBookTitleData = await this.bookTitles.update({
            where: { id: BookTitleId },
            data: {
                title: BookTitleData.title,
                author: BookTitleData.author,
                image: BookTitleData.image,
                description: BookTitleData.description,
                categorys: {
                    set: categorys
                },
                books: {
                    set: books
                }
            }
        });

        return updateBookTitleData;
    }

    public async deleteBookTitle(BookTitleId: number): Promise<BookTitle> {
        const findBookTitle: BookTitle = await this.bookTitles.findUnique({ where: { id: BookTitleId } });
        if (!findBookTitle) throw new HttpException(409, "You're not BookTitle");

        const deleteBookTitleData = await this.bookTitles.delete({ where: { id: BookTitleId } });
        return deleteBookTitleData;
    }
}

export default BookTitleService;
