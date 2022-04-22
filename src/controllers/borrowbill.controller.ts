import { CreateBorrowBillDto } from "@/dtos/borrowbill.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class BorrowBillController {
    @Get('/borrowbill')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getAll() {
        return { data: {}, message: 'OK' };
    }

    @Get('/borrowbill/:id')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getOne() {
        return { data: {}, message: 'OK' };
    }

    @Post('/borrowbill')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateBorrowBillDto, 'body'))
    @HttpCode(201)
    async create(@Body() bill: CreateBorrowBillDto) {
        return { data: {}, message: 'created' };
    }

    @Put('/borrowbill/:id')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateBorrowBillDto, 'body', true))
    async update(@Param('id') billId: number, @Body() bill: CreateBorrowBillDto) {
        return { data: {}, message: 'updated' };
    }

    @Delete('/borrowbill/:id')
    @UseBefore(authMiddleware([]))
    async delete(@Param('id') billId: number) {
        return { data: {}, message: 'deleted' };
    }
}