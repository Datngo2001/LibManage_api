import { CreateCategoryDto } from "@/dtos/category.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class CategoryController {
    @Get('/category')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getAll() {
        return { data: {}, message: 'OK' };
    }

    @Get('/category/:id')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getOne() {
        return { data: {}, message: 'OK' };
    }

    @Post('/category')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateCategoryDto, 'body'))
    @HttpCode(201)
    async create(@Body() category: CreateCategoryDto) {
        return { data: {}, message: 'created' };
    }

    @Put('/category/:id')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateCategoryDto, 'body', true))
    async update(@Param('id') categoryId: number, @Body() category: CreateCategoryDto) {
        return { data: {}, message: 'updated' };
    }

    @Delete('/category/:id')
    @UseBefore(authMiddleware([]))
    async delete(@Param('id') categoryId: number) {
        return { data: {}, message: 'deleted' };
    }
}