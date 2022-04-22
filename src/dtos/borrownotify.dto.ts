import { IsString } from "class-validator"

export class CreateBorrowNotifyDto {
    @IsString()
    public title: string

    @IsString()
    public content: string

    @IsString()
    public isRead: string
}