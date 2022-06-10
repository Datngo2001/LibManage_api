import { compare, hash } from 'bcrypt';
import { CreateReaderDto, CreateUserDto, UpdateUserDto, UpdateUserProfileDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { BorrowNotify, User } from '@prisma/client';
import { isEmpty } from '@utils/util';
import BorrowBillService from './borrowbill.service';
import Database from '@/Database';
import { FindBuilder } from '@/builder/FindBuilder';
import { CreateBuilder } from '@/builder/CreateBuilder';
import { UpdateBuilder } from '@/builder/UpdateBuilder';
import { DeleteBuilder } from '@/builder/DeleteBuilder';

class UserService {
  public findBuilder = new FindBuilder()
  public createBuilder = new CreateBuilder()
  public updateBuilder = new UpdateBuilder()
  public deleteBuilder = new DeleteBuilder()

  public users = Database.getInstance().user;
  public borrowNotifies = Database.getInstance().borrowNotify;
  public borrowBillService = new BorrowBillService();

  public async findAllUser(): Promise<User[]> {
    const query = this.findBuilder
      .addOrderBy({ name: "createdAt", isDesc: true })
      .getQuery();

    const users: User[] = await this.users.findMany(query);
    return users;
  }

  public async findAllBorrower(): Promise<User[]> {
    const query = this.findBuilder
      .orderby(
        [
          {
            borrowRegister: {
              _count: "desc"
            }
          },
          {
            borrowBills: {
              _count: "desc"
            },
          },
          {
            createdAt: "desc",
          }
        ]
      )
      .countColumns(["borrowBills", "borrowRegister"])
      .getQuery();

    const users: User[] = await this.users.findMany(query);
    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    const query = this.findBuilder
      .whereId(userId)
      .includeColumns(["groups"])
      .getQuery();

    const findUser: User = await this.users.findUnique(query)
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public async findUserByIdIncludeAllData(userId: number): Promise<User> {
    //await this.borrowBillService.createOverdueNotify(userId)
    const findUser: User = await this.users.findUnique({
      where: { id: userId },
      include: {
        borrowRegister: {
          orderBy: {
            createDate: "desc"
          },
          include: {
            books: {
              include: {
                BookTitle: true
              }
            }
          }
        },
        borrowBills: {
          include: {
            notifies: {
              orderBy: {
                createDate: "desc"
              }
            },
            books: {
              include: {
                BookTitle: true
              }
            }
          },
          orderBy: {
            planReturnDate: "desc"
          }
        },
      }
    })
    if (!findUser) throw new HttpException(409, "Borrwer not exist");

    return findUser;
  }

  public async findBorrowerByIdIncludeAllData(userId: number): Promise<User> {
    //await this.borrowBillService.createOverdueNotify(userId)
    const findUser: User = await this.users.findUnique({
      where: { id: userId },
      include: {
        borrowRegister: {
          orderBy: [
            { isConfirmed: "asc" },
            { createDate: "desc" }
          ],
          include: {
            books: {
              include: {
                BookTitle: true
              }
            }
          }
        },
        borrowBills: {
          include: {
            notifies: {
              orderBy: {
                createDate: "desc"
              }
            },
            books: {
              include: {
                BookTitle: true
              }
            }
          },
          orderBy: [
            { isReturned: "asc" },
            { planReturnDate: "desc" }
          ]
        },
      }
    })
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }


  public async findUserNotifies(userId: number): Promise<User> {
    //await this.borrowBillService.createOverdueNotify(userId)
    const userWithNotify: User = await this.users.findUnique({
      where: { id: userId },
      include: {
        borrowBills: {
          include: {
            notifies: true
          }
        }
      }
    })
    if (!userWithNotify) throw new HttpException(409, "You're not user");

    return userWithNotify;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findUnique({ where: { username: userData.username } });
    if (findUser) throw new HttpException(409, `Your username ${userData.username} already exists`);

    const findUser2: User = await this.users.findUnique({ where: { email: userData.email } });
    if (findUser2) throw new HttpException(409, `Your email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const groups = userData.groupIds.map(id => { return { id: id } })

    const query = this.createBuilder
      .addColumn({ name: "username", value: userData.username })
      .addColumn({ name: "password", value: hashedPassword })
      .addColumn({ name: "fname", value: userData.fname })
      .addColumn({ name: "lname", value: userData.lname })
      .addColumn({ name: "groups", value: { connect: groups } })
      .addColumn({ name: "email", value: userData.email })
      .getQuery();

    const createUserData: User = await this.users.create(query);

    return createUserData;
  }

  public async createReader(readerData: CreateReaderDto): Promise<User> {
    if (isEmpty(readerData)) throw new HttpException(400, "No Reader data");

    const findUser: User = await this.users.findUnique({ where: { username: readerData.username } });
    if (findUser) throw new HttpException(409, `Reader username ${readerData.username} already exists`);

    const findUser2: User = await this.users.findUnique({ where: { email: readerData.email } });
    if (findUser2) throw new HttpException(409, `Reader email ${readerData.email} already exists`);

    const readerGroupName = "_" + readerData.username;
    const hashedPassword = await hash(readerData.password, 10);

    const query = this.createBuilder
      .addColumn({ name: "username", value: readerData.username })
      .addColumn({ name: "password", value: hashedPassword })
      .addColumn({ name: "fname", value: readerData.fname })
      .addColumn({ name: "lname", value: readerData.lname })
      .addColumn({ name: "groups", value: { create: { name: readerGroupName }, connect: { id: 4 } } })
      .addColumn({ name: "email", value: readerData.email })
      .getQuery();

    const createUserData: User = await this.users.create(query);

    return createUserData;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "Empty parameter");

    const findUser: User = await this.users.findUnique({ where: { id: userId } })
    if (!findUser) throw new HttpException(409, "User ID not exist");

    const findUserWithEmail: User[] = await this.users.findMany({ where: { email: userData.email } })
    if (findUserWithEmail.some(u => u.id != userId)) {
      throw new HttpException(409, "User Email existed!");
    }

    const groups = userData.groupIds.map(id => { return { id: id } })
    let updateUserData: User;

    this.updateBuilder
      .addColumn({ name: "username", value: userData.username })
      .addColumn({ name: "fname", value: userData.fname })
      .addColumn({ name: "lname", value: userData.lname })
      .addColumn({ name: "groups", value: { set: groups } })
      .addColumn({ name: "email", value: userData.email })
      .whereId(userId);

    if (userData.password == "") {
      const query = this.updateBuilder.getQuery()
      updateUserData = await this.users.update(query);
    } else {
      const hashedPassword = await hash(userData.password, 10);
      const query = this.updateBuilder.addColumn({ name: "password", value: hashedPassword }).getQuery()
      updateUserData = await this.users.update(query);
    }
    return updateUserData;
  }

  public async updateProfile(userId: number, userData: UpdateUserProfileDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findUnique({ where: { id: userId } })
    if (!findUser) throw new HttpException(409, "You're not user");

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "Your old password not matching");

    var updateUserData: User;

    this.updateBuilder
      .addColumn({ name: "fname", value: userData.fname })
      .addColumn({ name: "lname", value: userData.lname })
      .addColumn({ name: "email", value: userData.email })
      .whereId(userId);

    if (userData.newPassword === "") {
      const query = this.updateBuilder.getQuery()
      updateUserData = await this.users.update(query);
    } else {
      const hashedPassword = await hash(userData.newPassword, 10);
      const query = this.updateBuilder.addColumn({ name: "password", value: hashedPassword }).getQuery()
      updateUserData = await this.users.update(query);
    }

    return updateUserData;
  }


  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await this.users.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "You're not user");

    const deleteUserData = await this.users.delete(this.deleteBuilder.whereId(userId).getQuery());
    return deleteUserData;
  }
}

export default UserService;
