import { CreateBorrowRegisterDto } from "@/dtos/borrowregister.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class BorrowRegisterController {
    @Get('/borrowregister')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getAll() {
        return { data: {}, message: 'OK' };
    }

    @Get('/borrowregister/:id')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getOne() {
        return { data: {}, message: 'OK' };
    }

    @Post('/borrowregister')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateBorrowRegisterDto, 'body'))
    @HttpCode(201)
    async create(@Body() register: CreateBorrowRegisterDto) {
        return { data: {}, message: 'created' };
    }

    @Put('/borrowregister/:id')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateBorrowRegisterDto, 'body', true))
    async update(@Param('id') registerId: number, @Body() register: CreateBorrowRegisterDto) {
        return { data: {}, message: 'updated' };
    }

    @Delete('/borrowregister/:id')
    @UseBefore(authMiddleware([]))
    async delete(@Param('id') registerId: number) {
        return { data: {}, message: 'deleted' };
    }
}