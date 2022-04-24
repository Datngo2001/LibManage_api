import { Controller, Param, Body, Get, Post, Put, Delete, HttpCode, UseBefore, Req } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@prisma/client';
import userService from '@services/users.service';
import { validationMiddleware } from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import policyList from '@/policies';
import { RequestWithUser } from '@/interfaces/auth.interface';

@Controller('/api')
export class UsersController {
  public userService = new userService();

  @Get('/users')
  @UseBefore(authMiddleware([3]))
  @OpenAPI({ summary: 'Return a list of users' })
  async getUsers() {
    const findAllUsersData: User[] = await this.userService.findAllUser();
    return { data: findAllUsersData, message: 'findAll' };
  }

  @Get('/users/:id')
  @UseBefore(authMiddleware([3]))
  @OpenAPI({ summary: 'Return find a user' })
  async getUserById(@Param('id') userId: number) {
    const findOneUserData: User = await this.userService.findUserById(userId);
    return { data: findOneUserData, message: 'findOne' };
  }

  @Get('/users/borrow/status')
  @UseBefore(authMiddleware([21]))
  @OpenAPI({ summary: 'Return find a user and all relate data' })
  async getUserByIdIncludeAllData(@Req() req: RequestWithUser) {
    const findOneUserData: User = await this.userService.findUserByIdIncludeAllData(req.user.id);
    return { data: findOneUserData, message: 'All data' };
  }

  @Get('/users/borrow/notifies')
  @UseBefore(authMiddleware([21]))
  @OpenAPI({ summary: 'Return user notifies' })
  async getUserNotifies(@Req() req: RequestWithUser) {
    const userWithNotifies: User = await this.userService.findUserNotifies(req.user.id);
    return { data: userWithNotifies, message: 'Notifies' };
  }

  @Post('/users')
  @HttpCode(201)
  @UseBefore(authMiddleware([1]))
  @UseBefore(validationMiddleware(CreateUserDto, 'body'))
  @OpenAPI({ summary: 'Create a new user' })
  async createUser(@Body() userData: CreateUserDto) {
    const createUserData: User = await this.userService.createUser(userData);
    return { data: createUserData, message: 'created' };
  }

  @Put('/users/:id')
  @UseBefore(authMiddleware([4]))
  @UseBefore(validationMiddleware(CreateUserDto, 'body', true))
  @OpenAPI({ summary: 'Update a user' })
  async updateUser(@Param('id') userId: number, @Body() userData: CreateUserDto) {
    const updateUserData: User = await this.userService.updateUser(userId, userData);
    return { data: updateUserData, message: 'updated' };
  }

  @Put('/users/profile')
  @UseBefore(authMiddleware([22]))
  @UseBefore(validationMiddleware(CreateUserDto, 'body', true))
  @OpenAPI({ summary: 'Update a user profile' })
  async updateUserProfile(@Req() req: RequestWithUser, @Body() userData: CreateUserDto) {
    const updateUserData: User = await this.userService.updateUserProfile(req.user.id, userData);
    return { data: updateUserData, message: 'updated' };
  }

  @Delete('/users/:id')
  @UseBefore(authMiddleware([2]))
  @OpenAPI({ summary: 'Delete a user' })
  async deleteUser(@Param('id') userId: number) {
    const deleteUserData: User = await this.userService.deleteUser(userId);
    return { data: deleteUserData, message: 'deleted' };
  }
}
