import { HttpException } from '@exceptions/HttpException';
import { Group } from '@prisma/client';
import { isEmpty } from '@utils/util';
import prisma from '@/dbclient';
import { CreateGroupDto } from '@/dtos/group.dto';
import Database from '@/Database';
import { FindBuilder } from '@/builder/FindBuilder';
import { CreateBuilder } from '@/builder/CreateBuilder';
import { UpdateBuilder } from '@/builder/UpdateBuilder';
import { DeleteBuilder } from '@/builder/DeleteBuilder';

class GroupService {
    public findBuilder = new FindBuilder()
    public createBuilder = new CreateBuilder()
    public updateBuilder = new UpdateBuilder()
    public deleteBuilder = new DeleteBuilder()

    public Groups = Database.getInstance().group;

    public async findAllGroup(): Promise<Group[]> {
        const query = this.findBuilder
            .addOrderBy({ name: "createdAt", isDesc: true })
            .getQuery();

        const Groups: Group[] = await this.Groups.findMany(query);
        return Groups;
    }

    public async findGroupById(GroupId: number): Promise<Group> {
        const query = this.findBuilder
            .whereId(GroupId)
            .includeColumns(["permissions", "users"])
            .getQuery();

        const findGroup: any = await this.Groups.findUnique(query)
        if (!findGroup) throw new HttpException(409, "Your Group ID not exist");

        return findGroup;
    }

    public async createGroup(GroupData: CreateGroupDto): Promise<Group> {
        if (isEmpty(GroupData)) throw new HttpException(400, "You're not BorrowRegisterData");

        const findGroup: Group = await this.Groups.findUnique({ where: { name: GroupData.name } });
        if (findGroup) throw new HttpException(409, `Your name ${GroupData.name} already exists`);

        const users = GroupData.userIds.map(id => { return { id: id } })
        const permissions = GroupData.permissionIds.map(id => { return { id: id } })

        const query = this.createBuilder
            .addColumn({ name: "name", value: GroupData.name })
            .addColumn({ name: "users", value: { connect: users } })
            .addColumn({ name: "permissions", value: { connect: permissions } })
            .getQuery();

        const createGroupData: Group = await this.Groups.create(query);

        return createGroupData;
    }

    public async updateGroup(GroupId: number, GroupData: CreateGroupDto): Promise<Group> {
        if (isEmpty(GroupData)) throw new HttpException(400, "Empty update data");

        var findGroup: Group = await this.Groups.findUnique({ where: { id: GroupId } })
        if (!findGroup) throw new HttpException(409, "Your Group ID not exist");

        const findUserWithEmail: Group[] = await this.Groups.findMany({ where: { name: GroupData.name } })
        if (findUserWithEmail.some(u => u.id != GroupId)) {
            throw new HttpException(409, `Group ${GroupData.name} existed!`);
        }

        const users = GroupData.userIds.map(id => { return { id: id } })
        const permissions = GroupData.permissionIds.map(id => { return { id: id } })

        const query = this.updateBuilder
            .addColumn({ name: "name", value: GroupData.name })
            .addColumn({ name: "users", value: { set: users } })
            .addColumn({ name: "permissions", value: { set: permissions } })
            .whereId(GroupId)
            .getQuery();

        const updateGroupData: Group = await this.Groups.update(query);

        return updateGroupData;
    }

    public async deleteGroup(GroupId: number): Promise<Group> {
        const findGroup: Group = await this.Groups.findUnique({ where: { id: GroupId } });
        if (!findGroup) throw new HttpException(409, "Your Group ID not exist");

        const deleteGroupData = await this.Groups.delete(this.deleteBuilder.whereId(GroupId).getQuery());
        return deleteGroupData;
    }
}

export default GroupService;
