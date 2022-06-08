import { CreateBorrowBillDto } from "@/dtos/borrowbill.dto";
import { HttpException } from "@/exceptions/HttpException";
import BorrowBillService from "@/services/borrowbill.service";
import BorrowRegisterService from "@/services/borrowregister.service";

export class ConfirmRegisterFacade {
    protected registerService: BorrowRegisterService;

    protected billService: BorrowBillService;

    /**
     * Depending on your application's needs, you can provide the Facade with
     * existing subsystem objects or force the Facade to create them on its own.
     */
    constructor(registerService: BorrowRegisterService = null, billService: BorrowBillService = null) {
        this.registerService = registerService || new BorrowRegisterService();
        this.billService = billService || new BorrowBillService();
    }


    public async confirmRegister(registerId: number) {
        let currentRegister = await this.registerService.findBorrowRegisterById(registerId) as any
        var bill = new CreateBorrowBillDto;
        bill.userId = currentRegister.userId
        bill.planReturnDate = currentRegister.planReturnDate
        let bookIds = currentRegister.books.map(book => book.id)
        bill.bookIds = bookIds
        const createdBill = await this.billService.createBorrowBill(bill)

        if (!createdBill) {
            throw new HttpException(500, `Something error went create borrowbill`);
        }

        const deletedRegister = await this.registerService.deleteBorrowRegister(registerId)

        return {
            createdBill, deletedRegister
        };
    }
}