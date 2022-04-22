import App from '@/app';
import { AuthController } from '@controllers/auth.controller';
import { IndexController } from '@controllers/index.controller';
import { UsersController } from '@controllers/users.controller';
import validateEnv from '@utils/validateEnv';
import { BookController } from './controllers/book.controller';
import { BookTitleController } from './controllers/bookTitle.controller';
import { BorrowBillController } from './controllers/borrowbill.controller';
import { BorrowNotifyController } from './controllers/borrownotify.controller';
import { BorrowRegisterController } from './controllers/borrowregister.controller';
import { CategoryController } from './controllers/category.controller';

validateEnv();

const app = new App([
    AuthController,
    IndexController,
    UsersController,
    BookTitleController,
    BookController,
    BorrowBillController,
    BorrowNotifyController,
    BorrowRegisterController,
    CategoryController
]);
app.listen();
