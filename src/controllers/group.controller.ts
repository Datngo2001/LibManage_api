import { CreateGroupDto } from "@/dtos/group.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import GroupService from "@/services/group.service";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class GroupController {
    groupService = new GroupService();

    @Get('/group')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getAll() {
        const groups = await this.groupService.findAllGroup();
        return { data: groups, message: 'OK' };
    }

    @Get('/group/:id')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getOne(@Param('id') categoryId: number) {
        const group = await this.groupService.findGroupById(categoryId);
        return { data: group, message: 'OK' };
    }

    @Post('/group')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateGroupDto, 'body'))
    @HttpCode(201)
    async create(@Body() group: CreateGroupDto) {
        const createdGroup = await this.groupService.createGroup(group);
        return { data: createdGroup, message: 'created' };
    }

    @Put('/group/:id')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateGroupDto, 'body', true))
    async update(@Param('id') groupId: number, @Body() group: CreateGroupDto) {
        const updatedGroup = await this.groupService.updateGroup(groupId, group);
        return { data: updatedGroup, message: 'updated' };
    }

    @Delete('/group/:id')
    @UseBefore(authMiddleware([]))
    async delete(@Param('id') groupId: number) {
        const deleteGroup = await this.groupService.deleteGroup(groupId);
        return { data: deleteGroup, message: 'deleted' };
    }
}