import { HttpException } from '@exceptions/HttpException';
import { Permission } from '@prisma/client';
import Database from '@/Database';
import { FindBuilder } from '@/builder/FindBuilder';

class PermissionService {
    public findBuilder = new FindBuilder()

    public Permissions = Database.getInstance().permission;

    public async findAllPermission(): Promise<Permission[]> {
        const query = this.findBuilder
            .addOrderBy({ name: "createdAt", isDesc: true })
            .getQuery();

        const Permissions: Permission[] = await this.Permissions.findMany(query);
        return Permissions;
    }

    public async findPermissionById(PermissionId: number): Promise<Permission> {
        const query = this.findBuilder
            .whereId(PermissionId)
            .includeColumns(["groups"])
            .getQuery();

        const findPermission: Permission = await this.Permissions.findUnique(query)
        if (!findPermission) throw new HttpException(409, "You're not Permission");

        return findPermission;
    }
}

export default PermissionService;
