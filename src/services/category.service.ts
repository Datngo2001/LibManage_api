import { HttpException } from '@exceptions/HttpException';
import { Category } from '@prisma/client';
import { isEmpty } from '@utils/util';
import prisma from '@/dbclient';
import { CreateCategoryDto } from '@/dtos/category.dto';
import Database from '@/Database';
import { FindBuilder } from '@/builder/FindBuilder';
import { UpdateBuilder } from '@/builder/UpdateBuilder';
import { CreateBuilder } from '@/builder/CreateBuilder';
import { DeleteBuilder } from '@/builder/DeleteBuilder';

class CategoryService {
    public findBuilder = new FindBuilder()
    public createBuilder = new CreateBuilder()
    public updateBuilder = new UpdateBuilder()
    public deleteBuilder = new DeleteBuilder()

    public Categorys = Database.getInstance().category;

    public async findAllCategory(): Promise<Category[]> {
        const query = this.findBuilder
            .addOrderBy({ name: "createdAt", isDesc: true })
            .getQuery();

        const Categorys: Category[] = await this.Categorys.findMany(query);
        return Categorys;
    }

    public async findCategoryById(CategoryId: number): Promise<Category> {
        const query = this.findBuilder
            .whereId(CategoryId)
            .includeColumns(["bookTitles"])
            .getQuery();

        const findCategory: Category = await this.Categorys.findUnique(query)
        if (!findCategory) throw new HttpException(409, "You're not Category");

        return findCategory;
    }

    public async createCategory(CategoryData: CreateCategoryDto): Promise<Category> {
        if (isEmpty(CategoryData)) throw new HttpException(400, "You're not CategoryData");

        const findCategory: Category = await this.Categorys.findUnique({ where: { name: CategoryData.name } });
        if (findCategory) throw new HttpException(409, `Your name ${CategoryData.name} already exists`);

        const query = this.createBuilder
            .addColumn({ name: "name", value: CategoryData.name })
            .getQuery();

        const createCategoryData: Category = await this.Categorys.create(query);

        return createCategoryData;
    }

    public async updateCategory(CategoryId: number, CategoryData: CreateCategoryDto): Promise<Category> {
        if (isEmpty(CategoryData)) throw new HttpException(400, "Empty update data");

        var findCategory: Category = await this.Categorys.findUnique({ where: { id: CategoryId } })
        if (!findCategory) throw new HttpException(409, "Your book title not exist");

        // findCategory = await this.Categorys.findUnique({ where: { name: CategoryData.name } });
        // if (findCategory) throw new HttpException(409, `Your name ${CategoryData.name} already exists`);

        const query = this.updateBuilder
            .addColumn({ name: "name", value: CategoryData.name })
            .whereId(CategoryId)
            .getQuery();

        const updateCategoryData = await this.Categorys.update(query);

        return updateCategoryData;
    }

    public async deleteCategory(CategoryId: number): Promise<Category> {
        const findCategory: Category = await this.Categorys.findUnique({ where: { id: CategoryId } });
        if (!findCategory) throw new HttpException(409, "You're not Category");

        const deleteCategoryData = await this.Categorys.delete(this.deleteBuilder.whereId(CategoryId).getQuery());
        return deleteCategoryData;
    }
}

export default CategoryService;
