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
  readonly defaultRole = 'user'

  public async signup(userData: SignupDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findUnique({ where: { username: userData.username } });
    if (findUser) throw new HttpException(409, `You're username ${userData.username} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: Promise<User> = this.users.create({ data: { ...userData, password: hashedPassword, roleName: this.defaultRole } });

    return createUserData;
  }

  public async login(userData: LoginDto): Promise<{ cookie: string; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findUnique({ where: { username: userData.username } });
    if (!findUser) throw new HttpException(409, `You're username ${userData.username} not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = this.createToken(findUser);
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

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id, role: user.roleName, username: user.username };
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

    return `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn};  Secure=true; SameSite=${sameSite}`;
  }
}

export default AuthService;
