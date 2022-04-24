import { CreateBorrowBillDto } from "@/dtos/borrowbill.dto";
import { CreateBorrowRegisterDto, UpdateBorrowRegisterDto } from "@/dtos/borrowregister.dto";
import { RequestWithUser } from "@/interfaces/auth.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import BorrowBillService from "@/services/borrowbill.service";
import BorrowRegisterService from "@/services/borrowregister.service";
import { BorrowBill } from "@prisma/client";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Req, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class BorrowRegisterController {
    borrowRegisterService = new BorrowRegisterService();
    borrowBillService = new BorrowBillService();

    @Get('/borrowregister')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getAll() {
        const borrowRegisters = await this.borrowRegisterService.findAllBorrowRegister()
        return { data: borrowRegisters, message: 'OK' };
    }

    @Get('/borrowregister/:id')
    @UseBefore(authMiddleware([]))
    @OpenAPI({ summary: '' })
    async getOne(@Param('id') registerId: number) {
        const borrowRegister = await this.borrowRegisterService.findBorrowRegisterById(registerId)
        return { data: borrowRegister, message: 'OK' };
    }

    @Post('/borrowregister')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateBorrowRegisterDto, 'body'))
    @HttpCode(201)
    async create(@Req() req: RequestWithUser, @Body() register: CreateBorrowRegisterDto) {
        const borrowRegister = await this.borrowRegisterService.createBorrowRegister(req.user.id, register)
        return { data: borrowRegister, message: 'created' };
    }

    @Put('/borrowregister/:id')
    @UseBefore(authMiddleware([]))
    @UseBefore(validationMiddleware(CreateBorrowRegisterDto, 'body', true))
    async update(@Param('id') registerId: number, @Body() register: UpdateBorrowRegisterDto) {
        const borrowRegister = await this.borrowRegisterService.updateBorrowRegister(registerId, register)
        if (borrowRegister.isConfirmed == true) {
            var bill = register as CreateBorrowBillDto;
            const createdBill = await this.borrowBillService.createBorrowBill(bill)
            const deletedRegister = await this.borrowRegisterService.deleteBorrowRegister(registerId)
            return { data: { createdBill, deletedRegister }, message: 'created bill and deleted register' };
        }
        return { data: borrowRegister, message: 'updated' };
    }

    @Delete('/borrowregister/:id')
    @UseBefore(authMiddleware([]))
    async delete(@Param('id') registerId: number) {
        const borrowRegister = await this.borrowRegisterService.deleteBorrowRegister(registerId)
        return { data: borrowRegister, message: 'deleted' };
    }
}