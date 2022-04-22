import { response, Response } from 'express';
import { Controller, Req, Body, Post, UseBefore, HttpCode, Res } from 'routing-controllers';
import { CreateUserDto, LoginDto, SignupDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import authMiddleware from '@middlewares/auth.middleware';
import { validationMiddleware } from '@middlewares/validation.middleware';
import AuthService from '@services/auth.service';
import { User } from '@prisma/client';
  
@Controller('/api')
export class AuthController {
  public authService = new AuthService();

  @Post('/signup')
  @UseBefore(validationMiddleware(SignupDto, 'body'))
  @HttpCode(201)
  async signUp(@Body() userData: SignupDto) {
    const signUpUserData: User = await this.authService.signup(userData);
    return { data: signUpUserData, message: 'signup' };
  }

  @Post('/login')
  @UseBefore(validationMiddleware(LoginDto, 'body'))
  async logIn(@Res() res: Response, @Body() userData: LoginDto) {
    const { cookie, findUser, permissionCodes } = await this.authService.login(userData);

    res.setHeader('Set-Cookie', [cookie]);

    var sesponseData: any = {}
    sesponseData.id = findUser.id
    sesponseData.username = findUser.username
    sesponseData.email = findUser.email
    sesponseData.permissionCodes = permissionCodes

    return { data: sesponseData, message: 'login' };
  }

  @Post('/logout')
  @UseBefore(authMiddleware([]))
  async logOut(@Req() req: RequestWithUser, @Res() res: Response) {
    const userData: User = req.user;
    const logOutUserData: User = await this.authService.logout(userData);

    const cookie = this.authService.createCookie(null)
    res.setHeader('Set-Cookie', [cookie]);
    return { data: logOutUserData, message: 'logout' };
  }
}
