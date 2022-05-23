import { HttpException } from '@exceptions/HttpException';
import { BorrowRegister } from '@prisma/client';
import { isEmpty } from '@utils/util';
import prisma from '@/dbclient';
import { CreateBorrowRegisterDto, UpdateBorrowRegisterDto } from '@/dtos/borrowregister.dto';
import BorrowBillService from './borrowbill.service';

class BorrowRegisterService {
    public BorrowRegisters = prisma.borrowRegister;
    public books = prisma.book;
    borrowBillService = new BorrowBillService()

    public async findAllBorrowRegister(): Promise<BorrowRegister[]> {
        const BorrowRegisters: BorrowRegister[] = await this.BorrowRegisters.findMany();
        return BorrowRegisters;
    }

    public async findBorrowRegisterById(BorrowRegisterId: number): Promise<BorrowRegister> {
        const findBorrowRegister: BorrowRegister = await this.BorrowRegisters.findUnique({ where: { id: BorrowRegisterId }, include: { user: true, books: true } })
        if (!findBorrowRegister) throw new HttpException(409, "You're not BorrowRegister");

        return findBorrowRegister;
    }

    public async createBorrowRegister(userId: number, BorrowRegisterData: CreateBorrowRegisterDto): Promise<BorrowRegister> {
        if (isEmpty(BorrowRegisterData)) throw new HttpException(400, "You're not BorrowRegisterData");

        const avalableIds = await this.avalableBookIds(BorrowRegisterData.bookIds)
        if (avalableIds.length != BorrowRegisterData.bookIds.length) {
            throw new HttpException(409, "One or all of your books not avalable");
        }

        const books = avalableIds.map(id => { return { id: id } })
        const createBorrowRegisterData: BorrowRegister = await this.BorrowRegisters.create({
            data: {
                note: BorrowRegisterData.note,
                isConfirmed: BorrowRegisterData.isConfirmed,
                planReturnDate: BorrowRegisterData.planReturnDate,
                user: {
                    connect: { id: userId }
                },
                books: {
                    connect: books
                }
            }
        });

        return createBorrowRegisterData;
    }

    public async updateBorrowRegister(BorrowRegisterId: number, BorrowRegisterData: UpdateBorrowRegisterDto): Promise<BorrowRegister> {
        if (isEmpty(BorrowRegisterData)) throw new HttpException(400, "Empty update data");

        const findBorrowRegister: BorrowRegister = await this.BorrowRegisters.findUnique({ where: { id: BorrowRegisterId } })
        if (!findBorrowRegister) throw new HttpException(409, "Your book title not exist");

        const avalableIds = await this.avalableBookIds(BorrowRegisterData.bookIds)
        if (avalableIds.length != BorrowRegisterData.bookIds.length) {
            throw new HttpException(409, "One or all of your books not avalable");
        }

        const books = avalableIds.map(id => { return { id: id } })
        const updateBorrowRegisterData = await this.BorrowRegisters.update({
            where: { id: BorrowRegisterId },
            data: {
                note: BorrowRegisterData.note,
                planReturnDate: BorrowRegisterData.planReturnDate,
                isConfirmed: BorrowRegisterData.isConfirmed,
                user: {
                    connect: { id: BorrowRegisterData.userId }
                },
                books: {
                    set: books
                }
            }
        });

        return updateBorrowRegisterData;
    }

    public async deleteBorrowRegister(BorrowRegisterId: number): Promise<BorrowRegister> {
        const findBorrowRegister: BorrowRegister = await this.BorrowRegisters.findUnique({ where: { id: BorrowRegisterId } });
        if (!findBorrowRegister) throw new HttpException(409, "You're not BorrowRegister");

        const deleteBorrowRegisterData = await this.BorrowRegisters.delete({ where: { id: BorrowRegisterId } });
        return deleteBorrowRegisterData;
    }

    private async avalableBookIds(bookIds: number[]) {
        const findBooks = await this.books.findMany({
            where: {
                id: {
                    in: bookIds
                },
                borrowBills: {
                    none: {
                        isReturned: false
                    }
                },
                borrowRegisters: {
                    none: {}
                }
            }
        })

        if (!findBooks) throw new HttpException(409, "No book avalable");

        const ids = findBooks.map(book => {
            return book.id
        })

        return ids
    }
}

export default BorrowRegisterService;
