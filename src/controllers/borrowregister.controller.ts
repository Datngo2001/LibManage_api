import { CreateBorrowBillDto } from "@/dtos/borrowbill.dto";
import { CreateBorrowRegisterDto, UpdateBorrowRegisterDto } from "@/dtos/borrowregister.dto";
import { HttpException } from "@/exceptions/HttpException";
import { ConfirmRegisterFacade } from "@/facade/ConfirmRegisterFacade";
import { RequestWithUser } from "@/interfaces/auth.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import { validationMiddleware } from "@/middlewares/validation.middleware";
import BorrowBillService from "@/services/borrowbill.service";
import BorrowRegisterService from "@/services/borrowregister.service";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Req, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller('/api')
export class BorrowRegisterController {
    borrowRegisterService = new BorrowRegisterService();
    borrowBillService = new BorrowBillService();
    confirmRegisterFacade = new ConfirmRegisterFacade(this.borrowRegisterService, this.borrowBillService)

    @Get('/borrowregister')
    @UseBefore(authMiddleware([12]))
    @OpenAPI({ summary: '' })
    async getAll() {
        const borrowRegisters = await this.borrowRegisterService.findAllBorrowRegister()
        return { data: borrowRegisters, message: 'OK' };
    }

    @Get('/borrowregister/:id')
    @UseBefore(authMiddleware([12]))
    @OpenAPI({ summary: '' })
    async getOne(@Param('id') registerId: number) {
        const borrowRegister = await this.borrowRegisterService.findBorrowRegisterById(registerId)
        return { data: borrowRegister, message: 'OK' };
    }

    @Post('/borrowregister')
    @UseBefore(authMiddleware([20]))
    @UseBefore(validationMiddleware(CreateBorrowRegisterDto, 'body'))
    @HttpCode(201)
    async create(@Req() req: RequestWithUser, @Body() register: CreateBorrowRegisterDto) {
        const borrowRegister = await this.borrowRegisterService.createBorrowRegister(req.user.id, register)
        return { data: borrowRegister, message: 'created' };
    }

    @Put('/borrowregister/:id')
    @UseBefore(authMiddleware([13, 17]))
    @UseBefore(validationMiddleware(CreateBorrowRegisterDto, 'body', true))
    @OpenAPI({ summary: 'Update borrow reigister, when isConfirm == true create bill and delete current register' })
    async update(@Param('id') registerId: number, @Body() register: UpdateBorrowRegisterDto) {
        if (register.isConfirmed == true) {
            let data = this.confirmRegisterFacade.confirmRegister(registerId);

            return { data: data, message: 'created bill and deleted register' };
        } else {
            const borrowRegister = await this.borrowRegisterService.updateBorrowRegister(registerId, register)
            return { data: borrowRegister, message: 'updated' };
        }
    }

    @Put('/borrowregister/confirm/:id')
    @UseBefore(authMiddleware([13, 17]))
    @OpenAPI({ summary: 'Confirm borrow register' })
    async confirm(@Param('id') registerId: number) {
        let data = this.confirmRegisterFacade.confirmRegister(registerId);

        return { data: data, message: 'created bill and deleted register' };
    }

    @Put('/borrowregister/reject/:id')
    @UseBefore(authMiddleware([14]))
    async reject(@Param('id') registerId: number) {
        const borrowRegister = await this.borrowRegisterService.refectBorrowRegister(registerId)
        return { data: borrowRegister, message: 'rejected' };
    }

    @Delete('/borrowregister/:id')
    @UseBefore(authMiddleware([14]))
    async delete(@Param('id') registerId: number) {
        const borrowRegister = await this.borrowRegisterService.deleteBorrowRegister(registerId)
        return { data: borrowRegister, message: 'deleted' };
    }
}