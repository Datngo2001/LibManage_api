import { Request, Response } from 'express';
import path from 'path';
import { Controller, Get, Render, Req, Res } from 'routing-controllers';

@Controller()
export class IndexController {
  @Get('/')
  index(@Req() req: Request, @Res() res: Response) {
    res.sendFile(path.resolve(__dirname, '../../client/index.html'))
    return res
  }
}
