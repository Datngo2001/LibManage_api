import { IsArray, IsBoolean, IsDate, IsNumber, IsString } from "class-validator"

export class CreateBorrowRegisterDto {
    @IsString()
    public note: string

    @IsString()
    public planReturnDate: string

    @IsArray()
    public bookTitileIds: number[]
}

export class UpdateBorrowRegisterDto {
    @IsString()
    public note: string

    @IsBoolean()
    public isConfirmed: boolean

    @IsString()
    public planReturnDate: string

    @IsNumber()
    public userId: number

    @IsArray()
    public bookTitileIds: number[]
}