import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator"

export class CreateBorrowRegisterDto {
    @IsString()
    public note: string

    @IsBoolean()
    public isConfirmed: boolean

    @IsNumber()
    public userId: number

    @IsArray()
    public bookIds: number[]
}