import { CreateBookTitleDto } from "@/dtos/booktitle.dto";
import { RequestWithUser } from "@/interfaces/auth.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import BookTitleService from "@/services/booktitle.service";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, QueryParam, Req, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class BookTitleController {
    bookTitleService = new BookTitleService();

    @Get('/booktitle/search')
    @OpenAPI({ summary: '' })
    async search(@QueryParam("title") title: string, @QueryParam("page") page: number, @QueryParam("limit") limit: number) {
        const searchPromise = this.bookTitleService.searchBookTitle(title, page, limit);
        const countPromise = this.bookTitleService.searchBookTitleTotalFound(title);
        const result = await Promise.all([countPromise, searchPromise])
        return { title: title, page: page, limit: limit, data: result[1], total: result[0], message: 'OK' };
    }

    @Get('/booktitle')
    @UseBefore(authMiddleware([5]))
    @OpenAPI({ summary: '' })
    async getAll() {
        const bookTitles = await this.bookTitleService.findAllBookTitle();
        return { data: bookTitles, message: 'OK' };
    }

    @Get('/booktitle/:id')
    @UseBefore(authMiddleware([5]))
    @OpenAPI({ summary: '' })
    async getOne(@Param('id') bookTitleId: number) {
        const bookTitle = await this.bookTitleService.findBookTitleByIdIncludeBooks(bookTitleId);
        return { data: bookTitle, message: 'OK' };
    }

    @Get('/booktitle/:id/books/avalable')
    @UseBefore(authMiddleware([5]))
    @OpenAPI({ summary: 'Return all book that not be borrowed' })
    async getAvalableBooks(@Param('id') bookTitleId: number) {
        const bookTitle = await this.bookTitleService.findAvailableBooks(bookTitleId);
        return { data: bookTitle, message: 'OK' };
    }


    @Post('/booktitle')
    @UseBefore(authMiddleware([6]))
    @UseBefore(validationMiddleware(CreateBookTitleDto, 'body'))
    @HttpCode(201)
    async create(@Body() bookTitle: CreateBookTitleDto) {
        const createBookTitle = await this.bookTitleService.createBookTitle(bookTitle);
        return { data: createBookTitle, message: 'created' };
    }

    @Put('/booktitle/:id')
    @UseBefore(authMiddleware([8]))
    @UseBefore(validationMiddleware(CreateBookTitleDto, 'body', true))
    async update(@Param('id') bookTitleId: number, @Body() bookTitle: CreateBookTitleDto) {
        const updateBookTitle = await this.bookTitleService.updateBookTitle(bookTitleId, bookTitle);
        return { data: updateBookTitle, message: 'updated' };
    }

    @Delete('/booktitle/:id')
    @UseBefore(authMiddleware([10]))
    async delete(@Param('id') bookTitleId: number) {
        const deleteBookTitle = await this.bookTitleService.deleteBookTitle(bookTitleId);
        return { data: deleteBookTitle, message: 'deleted' };
    }
}