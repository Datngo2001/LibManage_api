import { CreateBorrowBillDto, UpdateBorrowBillDto } from "@/dtos/borrowbill.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import BorrowBillService from "@/services/borrowbill.service";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class BorrowBillController {
    borrowBillService = new BorrowBillService()

    @Get('/borrowbill')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getAll() {
        const bills = this.borrowBillService.findAllBorrowBill()
        return { data: bills, message: 'OK' };
    }

    @Get('/borrowbill/:id')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getOne(@Param('id') billId: number) {
        const bill = this.borrowBillService.findBorrowBillById(billId)
        return { data: bill, message: 'OK' };
    }

    @Post('/borrowbill')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateBorrowBillDto, 'body'))
    @HttpCode(201)
    async create(@Body() bill: CreateBorrowBillDto) {
        const createdBill = this.borrowBillService.createBorrowBill(bill)
        return { data: createdBill, message: 'created' };
    }

    @Put('/borrowbill/:id')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateBorrowBillDto, 'body', true))
    async update(@Param('id') billId: number, @Body() bill: UpdateBorrowBillDto) {
        const updateBill = this.borrowBillService.updateBorrowBill(billId, bill)
        return { data: updateBill, message: 'updated' };
    }

    @Delete('/borrowbill/:id')
    @UseBefore(authMiddleware([]))
    async delete(@Param('id') billId: number) {
        const deleteBill = this.borrowBillService.deleteBorrowBill(billId)
        return { data: deleteBill, message: 'deleted' };
    }
}