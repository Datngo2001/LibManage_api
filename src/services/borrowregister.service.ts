import { HttpException } from '@exceptions/HttpException';
import { BorrowRegister } from '@prisma/client';
import { isEmpty } from '@utils/util';
import prisma from '@/dbclient';
import { CreateBorrowRegisterDto, UpdateBorrowRegisterDto } from '@/dtos/borrowregister.dto';
import BorrowBillService from './borrowbill.service';
import Database from '@/Database';
import { FindBuilder } from '@/builder/FindBuilder';
import { CreateBuilder } from '@/builder/CreateBuilder';
import { UpdateBuilder } from '@/builder/UpdateBuilder';
import { DeleteBuilder } from '@/builder/DeleteBuilder';

class BorrowRegisterService {
    public findBuilder = new FindBuilder()
    public createBuilder = new CreateBuilder()
    public updateBuilder = new UpdateBuilder()
    public deleteBuilder = new DeleteBuilder()

    public BorrowRegisters = Database.getInstance().borrowRegister;
    public books = Database.getInstance().book;
    borrowBillService = new BorrowBillService()

    public async findAllBorrowRegister(): Promise<BorrowRegister[]> {
        const query = this.findBuilder
            .addOrderBy({ name: "createdAt", isDesc: true })
            .getQuery();

        const BorrowRegisters: BorrowRegister[] = await this.BorrowRegisters.findMany(query);
        return BorrowRegisters;
    }

    public async findBorrowRegisterById(BorrowRegisterId: number): Promise<BorrowRegister> {
        const query = this.findBuilder
            .whereId(BorrowRegisterId)
            .includeColumns(["user", "books"])
            .getQuery();

        const findBorrowRegister: BorrowRegister = await this.BorrowRegisters.findUnique(query)
        if (!findBorrowRegister) throw new HttpException(409, "You're not BorrowRegister");

        return findBorrowRegister;
    }

    public async createBorrowRegister(userId: number, BorrowRegisterData: CreateBorrowRegisterDto): Promise<BorrowRegister> {
        if (isEmpty(BorrowRegisterData)) throw new HttpException(400, "You're not BorrowRegisterData");

        try {
            BorrowRegisterData.planReturnDate = new Date(BorrowRegisterData.planReturnDate).toISOString()
        } catch (error) {
            throw new HttpException(409, "Plan return date invalid format");
        }

        const avalableIds = await this.getAvalableBookIds(BorrowRegisterData.bookTitileIds)
        if (avalableIds.length != BorrowRegisterData.bookTitileIds.length) {
            throw new HttpException(409, "One or all of your books not avalable");
        }

        const books = avalableIds.map(id => { return { id: id } })

        const query = this.createBuilder
            .addColumn({ name: "note", value: BorrowRegisterData.note })
            .addColumn({ name: "isConfirmed", value: false })
            .addColumn({ name: "planReturnDate", value: BorrowRegisterData.planReturnDate })
            .addColumn({ name: "user", value: { connect: { id: userId } } })
            .addColumn({ name: "books", value: { connect: books } })
            .getQuery();

        const createBorrowRegisterData: BorrowRegister = await this.BorrowRegisters.create(query);

        return createBorrowRegisterData;
    }

    public async updateBorrowRegister(BorrowRegisterId: number, BorrowRegisterData: UpdateBorrowRegisterDto): Promise<BorrowRegister> {
        if (isEmpty(BorrowRegisterData)) throw new HttpException(400, "Empty update data");

        const findBorrowRegister: BorrowRegister = await this.BorrowRegisters.findUnique({ where: { id: BorrowRegisterId } })
        if (!findBorrowRegister) throw new HttpException(409, "Your book title not exist");

        const avalableIds = await this.getAvalableBookIds(BorrowRegisterData.bookTitileIds)
        if (avalableIds.length != BorrowRegisterData.bookTitileIds.length) {
            throw new HttpException(409, "One or all of your books not avalable");
        }

        const books = avalableIds.map(id => { return { id: id } })

        const query = this.updateBuilder
            .addColumn({ name: "note", value: BorrowRegisterData.note })
            .addColumn({ name: "isConfirmed", value: false })
            .addColumn({ name: "planReturnDate", value: BorrowRegisterData.planReturnDate })
            .addColumn({ name: "user", value: { connect: { id: BorrowRegisterData.userId } } })
            .addColumn({ name: "books", value: { set: books } })
            .whereId(BorrowRegisterId)
            .getQuery();

        const updateBorrowRegisterData = await this.BorrowRegisters.update(query);

        return updateBorrowRegisterData;
    }

    public async confirmBorrowRegister(BorrowRegisterId: number): Promise<BorrowRegister> {
        const query = this.updateBuilder
            .addColumn({ name: "isConfirmed", value: true })
            .whereId(BorrowRegisterId)
            .getQuery();

        const updateBorrowRegisterData = await this.BorrowRegisters.update(query);

        return updateBorrowRegisterData;
    }

    public async deleteBorrowRegister(BorrowRegisterId: number): Promise<BorrowRegister> {
        const findBorrowRegister: BorrowRegister = await this.BorrowRegisters.findUnique({ where: { id: BorrowRegisterId } });
        if (!findBorrowRegister) throw new HttpException(409, "You're not BorrowRegister");

        const deleteBorrowRegisterData = await this.BorrowRegisters.delete(this.deleteBuilder.whereId(BorrowRegisterId).getQuery());
        return deleteBorrowRegisterData;
    }

    public async refectBorrowRegister(BorrowRegisterId: number): Promise<BorrowRegister> {
        const findBorrowRegister: BorrowRegister = await this.BorrowRegisters.findUnique({ where: { id: BorrowRegisterId } });
        if (!findBorrowRegister) throw new HttpException(409, "You're not BorrowRegister");

        const query = this.updateBuilder
            .addColumn({ name: "isRejected", value: true })
            .whereId(BorrowRegisterId)
            .getQuery();

        const borrowRegisterData = await this.BorrowRegisters.update(query);
        return borrowRegisterData;
    }

    private async getAvalableBookIds(bookTitileIds: number[]) {
        const findBooks = await this.books.findMany({
            where: {
                bookTitleId: {
                    in: bookTitileIds
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
