import { CreateBorrowNotifyDto } from "@/dtos/borrownotify.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class BorrowNotifyController {
    @Get('/borrownotify')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getAll() {
        return { data: {}, message: 'OK' };
    }

    @Get('/borrownotify/:id')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getOne() {
        return { data: {}, message: 'OK' };
    }

    @Post('/borrownotify')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateBorrowNotifyDto, 'body'))
    @HttpCode(201)
    async create(@Body() notify: CreateBorrowNotifyDto) {
        return { data: {}, message: 'created' };
    }

    @Put('/borrownotify/:id')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateBorrowNotifyDto, 'body', true))
    async update(@Param('id') notifyId: number, @Body() notify: CreateBorrowNotifyDto) {
        return { data: {}, message: 'updated' };
    }

    @Delete('/borrownotify/:id')
    @UseBefore(authMiddleware([]))
    async delete(@Param('id') notifyId: number) {
        return { data: {}, message: 'deleted' };
    }
}