import { HttpException } from '@exceptions/HttpException';
import { BorrowBill } from '@prisma/client';
import { isEmpty } from '@utils/util';
import prisma from '@/dbclient';
import { CreateBorrowBillDto, UpdateBorrowBillDto } from '@/dtos/borrowbill.dto';

class BorrowBillService {
    public BorrowBills = prisma.borrowBill;

    public async findAllBorrowBill(): Promise<BorrowBill[]> {
        const BorrowBills: BorrowBill[] = await this.BorrowBills.findMany();
        return BorrowBills;
    }

    public async findBorrowBillById(BorrowBillId: number): Promise<BorrowBill> {
        const findBorrowBill: BorrowBill = await this.BorrowBills.findUnique({ where: { id: BorrowBillId } })
        if (!findBorrowBill) throw new HttpException(409, "You're not BorrowBill");

        return findBorrowBill;
    }

    public async createBorrowBill(BorrowBillData: CreateBorrowBillDto): Promise<BorrowBill> {
        if (isEmpty(BorrowBillData)) throw new HttpException(400, "You're not BorrowBillData");

        const books = BorrowBillData.bookIds.map(id => { return { id: id } })
        const createBorrowBillData: BorrowBill = await this.BorrowBills.create({
            data: {
                isReturned: false,
                user: {
                    connect: { id: BorrowBillData.userId }
                },
                books: {
                    connect: books
                }
            }
        });

        return createBorrowBillData;
    }

    public async updateBorrowBill(BorrowBillId: number, BorrowBillData: UpdateBorrowBillDto): Promise<BorrowBill> {
        if (isEmpty(BorrowBillData)) throw new HttpException(400, "Empty update data");

        const findBorrowBill: BorrowBill = await this.BorrowBills.findUnique({ where: { id: BorrowBillId } })
        if (!findBorrowBill) throw new HttpException(409, "Your book title not exist");

        const books = BorrowBillData.bookIds.map(id => { return { id: id } })
        const notifies = BorrowBillData.notifyIds.map(id => { return { id: id } })
        const updateBorrowBillData = await this.BorrowBills.update({
            where: { id: BorrowBillId },
            data: {
                isReturned: BorrowBillData.isReturned,
                user: {
                    connect: { id: BorrowBillData.userId }
                },
                books: {
                    set: books
                },
                notifies: {
                    set: notifies
                }
            }
        });

        return updateBorrowBillData;
    }

    public async deleteBorrowBill(BorrowBillId: number): Promise<BorrowBill> {
        const findBorrowBill: BorrowBill = await this.BorrowBills.findUnique({ where: { id: BorrowBillId } });
        if (!findBorrowBill) throw new HttpException(409, "You're not BorrowBill");

        const deleteBorrowBillData = await this.BorrowBills.delete({ where: { id: BorrowBillId } });
        return deleteBorrowBillData;
    }
}

export default BorrowBillService;
