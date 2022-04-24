import { CreateBookTitleDto } from "@/dtos/booktitle.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import BookTitleService from "@/services/booktitle.service";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class BookTitleController {
    bookTitleService = new BookTitleService();

    @Get('/booktitle')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getAll() {
        const bookTitles = this.bookTitleService.findAllBookTitle();
        return { data: bookTitles, message: 'OK' };
    }

    @Get('/booktitle/:id')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getOne(@Param('id') bookTitleId: number) {
        const bookTitle = await this.bookTitleService.findBookTitleById(bookTitleId);
        return { data: bookTitle, message: 'OK' };
    }

    @Get('/booktitle/:id')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getOneIncludeBooks(@Param('id') bookTitleId: number) {
        const bookTitle = await this.bookTitleService.findBookTitleByIdIncludeBooks(bookTitleId);
        return { data: bookTitle, message: 'OK' };
    }

    @Post('/booktitle')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateBookTitleDto, 'body'))
    @HttpCode(201)
    async create(@Body() bookTitle: CreateBookTitleDto) {
        const createBookTitle = await this.bookTitleService.createBookTitle(bookTitle);
        return { data: createBookTitle, message: 'created' };
    }

    @Put('/booktitle/:id')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateBookTitleDto, 'body', true))
    async update(@Param('id') bookTitleId: number, @Body() bookTitle: CreateBookTitleDto) {
        const updateBookTitle = await this.bookTitleService.updateBookTitle(bookTitleId, bookTitle);
        return { data: updateBookTitle, message: 'updated' };
    }

    @Delete('/booktitle/:id')
    @UseBefore(authMiddleware([]))
    async delete(@Param('id') bookTitleId: number) {
        const deleteBookTitle = await this.bookTitleService.deleteBookTitle(bookTitleId);
        return { data: deleteBookTitle, message: 'deleted' };
    }
}