import { CreateBookTitleDto } from "@/dtos/booktitle.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class BookTitleController {
    @Get('/booktitle')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getAll() {
        return { data: {}, message: 'OK' };
    }

    @Get('/booktitle/:id')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getOne() {
        return { data: {}, message: 'OK' };
    }

    @Post('/booktitle')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateBookTitleDto, 'body'))
    @HttpCode(201)
    async create(@Body() bookTitle: CreateBookTitleDto) {
        return { data: {}, message: 'created' };
    }

    @Put('/booktitle/:id')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateBookTitleDto, 'body', true))
    async update(@Param('id') bookTitleId: number, @Body() bookTitle: CreateBookTitleDto) {
        return { data: {}, message: 'updated' };
    }

    @Delete('/booktitle/:id')
    @UseBefore(authMiddleware([]))
    async delete(@Param('id') userId: number) {
        return { data: {}, message: 'deleted' };
    }
}