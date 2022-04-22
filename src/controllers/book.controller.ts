import { CreateBookDto } from "@/dtos/book.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class BookController {
    @Get('/book')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getAll() {
        return { data: {}, message: 'OK' };
    }

    @Get('/book/:id')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getOne() {
        return { data: {}, message: 'OK' };
    }

    @Post('/book')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateBookDto, 'body'))
    @HttpCode(201)
    async create(@Body() book: CreateBookDto) {
        return { data: {}, message: 'created' };
    }

    @Put('/book/:id')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateBookDto, 'body', true))
    async update(@Param('id') bookId: number, @Body() book: CreateBookDto) {
        return { data: {}, message: 'updated' };
    }

    @Delete('/book/:id')
    @UseBefore(authMiddleware([]))
    async delete(@Param('id') bookId: number) {
        return { data: {}, message: 'deleted' };
    }
}