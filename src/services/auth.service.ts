import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto, LoginDto, SignupDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { isEmpty } from '@utils/util';
import prisma from '@/dbclient';
import { User } from '@prisma/client';

class AuthService {
  public users = prisma.user;

  public async signup(userData: SignupDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findUnique({ where: { username: userData.username } });
    if (findUser) throw new HttpException(409, `You're username ${userData.username} already exists`);

    const userGroupName = "_" + userData.username;
    const hashedPassword = await hash(userData.password, 10);
    const createUserData: Promise<User> = this.users.create(
      {
        data: {
          ...userData,
          password: hashedPassword,
          groups: {
            create: { name: userGroupName },
            connect: { id: 4 }
          }
        }
      }
    );

    return createUserData;
  }

  public async login(userData: LoginDto): Promise<{ cookie: string; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findUnique({ where: { username: userData.username } });
    if (!findUser) throw new HttpException(409, `You're username ${userData.username} not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const permissionCodes = await this.getPermissionCode(findUser);

    const tokenData = this.createToken(findUser, permissionCodes);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findFirst({
      where: {
        username: userData.username,
        password: userData.password
      }
    });

    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public createToken(user: User, perCodes: number[]): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id, permisionCodes: perCodes, username: user.username };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    var sameSite;
    if (process.env.SAMESITE === undefined) {
      sameSite = 'Lax' // Defaut same site attrubute
    } else {
      sameSite = process.env.SAMESITE
    }

    if (tokenData === null) {
      return `Authorization=; Max-Age=0;  Secure=true; SameSite=${sameSite}; httpOnly=false`;
    } else {
      return `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn};  Secure=true; httpOnly=false; SameSite=${sameSite}`;
    }
  }

  public async getPermissionCode(findUser: User) {
    var groups = await prisma.group.findMany({
      select: { permissions: { select: { id: true } } },
      where: {
        users: { some: { id: { equals: findUser.id } } }
      }
    })

    var permisionCodes = []
    groups.forEach(g => {
      g.permissions.forEach(p => {
        permisionCodes.push(p.id)
      })
    })
    console.log(permisionCodes)

    return permisionCodes
  }
}

export default AuthService;
