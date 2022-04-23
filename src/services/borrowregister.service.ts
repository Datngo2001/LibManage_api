import { HttpException } from '@exceptions/HttpException';
import { BorrowRegister } from '@prisma/client';
import { isEmpty } from '@utils/util';
import prisma from '@/dbclient';
import { CreateBorrowRegisterDto, UpdateBorrowRegisterDto } from '@/dtos/borrowregister.dto';

class BorrowRegisterService {
    public BorrowRegisters = prisma.borrowRegister;

    public async findAllBorrowRegister(): Promise<BorrowRegister[]> {
        const BorrowRegisters: BorrowRegister[] = await this.BorrowRegisters.findMany();
        return BorrowRegisters;
    }

    public async findBorrowRegisterById(BorrowRegisterId: number): Promise<BorrowRegister> {
        const findBorrowRegister: BorrowRegister = await this.BorrowRegisters.findUnique({ where: { id: BorrowRegisterId } })
        if (!findBorrowRegister) throw new HttpException(409, "You're not BorrowRegister");

        return findBorrowRegister;
    }

    public async createBorrowRegister(userId: number, BorrowRegisterData: CreateBorrowRegisterDto): Promise<BorrowRegister> {
        if (isEmpty(BorrowRegisterData)) throw new HttpException(400, "You're not BorrowRegisterData");

        const books = BorrowRegisterData.bookIds.map(id => { return { id: id } })
        const createBorrowRegisterData: BorrowRegister = await this.BorrowRegisters.create({
            data: {
                note: BorrowRegisterData.note,
                isConfirmed: BorrowRegisterData.isConfirmed,
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

        const books = BorrowRegisterData.bookIds.map(id => { return { id: id } })
        const updateBorrowRegisterData = await this.BorrowRegisters.update({
            where: { id: BorrowRegisterId },
            data: {
                note: BorrowRegisterData.note,
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
}

export default BorrowRegisterService;
