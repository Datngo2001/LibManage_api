import { IsArray, IsBoolean, IsDate, IsNumber, IsString } from "class-validator"

export class CreateBorrowBillDto {
    @IsNumber()
    public userId: number

    @IsString()
    public planReturnDate: string

    @IsArray()
    public bookIds: number[]
}


export class UpdateBorrowBillDto {
    @IsNumber()
    public userId: number

    @IsString()
    public planReturnDate: string

    @IsArray()
    public bookIds: number[]

    @IsBoolean()
    public isReturned: boolean

    @IsArray()
    public notifyIds: number[]
}
