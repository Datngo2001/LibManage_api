import { IsArray, IsBoolean, IsDate, IsNumber, IsString } from "class-validator"

export class CreateBorrowRegisterDto {
    @IsString()
    public note: string

    @IsBoolean()
    public isConfirmed: boolean

    @IsDate()
    public planReturnDate: Date

    @IsArray()
    public bookIds: number[]
}

export class UpdateBorrowRegisterDto {
    @IsString()
    public note: string

    @IsBoolean()
    public isConfirmed: boolean

    @IsDate()
    public planReturnDate: Date

    @IsNumber()
    public userId: number

    @IsArray()
    public bookIds: number[]
}