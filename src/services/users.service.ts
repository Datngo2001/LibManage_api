import { hash } from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@prisma/client';
import { isEmpty } from '@utils/util';
import prisma from '@/dbclient';

class UserService {
  public users = prisma.user;

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await this.users.findMany();
    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await this.users.findUnique({ where: { id: userId } })
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findUnique({ where: { username: userData.username } });
    if (findUser) throw new HttpException(409, `Your username ${userData.username} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const groups = userData.groupIds.map(id => { return { id: id } })
    const createUserData: User = await this.users.create({
      data: {
        username: userData.username,
        password: hashedPassword,
        fname: userData.fname,
        lname: userData.lname,
        groups: {
          connect: groups
        }
      }
    });

    return createUserData;
  }

  public async updateUser(userId: number, userData: UpdateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findUnique({ where: { id: userId } })
    if (!findUser) throw new HttpException(409, "You're not user");

    const hashedPassword = await hash(userData.password, 10);
    const groups = userData.groupIds.map(id => { return { id: id } })
    const updateUserData: User = await this.users.update({
      where: { id: userId },
      data: {
        username: userData.username,
        password: hashedPassword,
        fname: userData.fname,
        lname: userData.lname,
        groups: {
          set: groups
        }
      }
    });

    return updateUserData;
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await this.users.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "You're not user");

    const deleteUserData = await this.users.delete({ where: { id: userId } });
    return deleteUserData;
  }
}

export default UserService;
