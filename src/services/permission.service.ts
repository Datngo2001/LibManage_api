import { HttpException } from '@exceptions/HttpException';
import { Permission } from '@prisma/client';
import Database from '@/Database';

class PermissionService {
    public Permissions = Database.getInstance().permission;

    public async findAllPermission(): Promise<Permission[]> {
        const Permissions: Permission[] = await this.Permissions.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        return Permissions;
    }

    public async findPermissionById(PermissionId: number): Promise<Permission> {
        const findPermission: Permission = await this.Permissions.findUnique({ where: { id: PermissionId }, include: { groups: true } })
        if (!findPermission) throw new HttpException(409, "You're not Permission");

        return findPermission;
    }
}

export default PermissionService;
