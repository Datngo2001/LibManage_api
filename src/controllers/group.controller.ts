import { CreateGroupDto } from "@/dtos/group.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class GroupController {
    @Get('/group')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getAll() {
        return { data: {}, message: 'OK' };
    }

    @Get('/group/:id')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getOne() {
        return { data: {}, message: 'OK' };
    }

    @Post('/group')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateGroupDto, 'body'))
    @HttpCode(201)
    async create(@Body() group: CreateGroupDto) {
        return { data: {}, message: 'created' };
    }

    @Put('/group/:id')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateGroupDto, 'body', true))
    async update(@Param('id') groupId: number, @Body() group: CreateGroupDto) {
        return { data: {}, message: 'updated' };
    }

    @Delete('/group/:id')
    @UseBefore(authMiddleware([]))
    async delete(@Param('id') groupId: number) {
        return { data: {}, message: 'deleted' };
    }
}