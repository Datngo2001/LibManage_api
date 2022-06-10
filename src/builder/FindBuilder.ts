
export class FindBuilder {
    private query: any = {};

    constructor() {
        this.reset();
    }

    public reset(): void {
        this.query = {};
    }

    public where(whereContent) {
        this.query.where = whereContent;
        return this;
    }

    public orderby(orderbyContent) {
        this.query.orderBy = orderbyContent;
        return this;
    }

    public include(includeContent) {
        this.query.include = includeContent;
        return this;
    }

    public count(countContent) {
        this.createInclude()

        if (this.query.include._count == undefined) {
            this.query.include._count = {
                select: {}
            }
        }

        this.query.include._count = countContent;
        return this;
    }

    public whereId(id: number) {
        this.query.where = { id: id };
        return this;
    }

    public includeColumns(columns: string[]) {
        this.createInclude()
        columns.forEach(col => {
            this.query.include[col] = true;
        })
        return this;
    }

    public notIncludeColumns(columns: string[]) {
        this.createInclude()
        columns.forEach(col => {
            this.query.include[col] = false;
        })
        return this;
    }

    public countColumns(columns: string[]) {
        this.createInclude()

        if (this.query.include._count == undefined) {
            this.query.include._count = {
                select: {}
            }
        }

        columns.forEach(col => {
            this.query.include._count.select[col] = true;
        })

        return this;
    }

    public addOrderBy({ name, isDesc }) {
        if (this.query.orderBy == undefined) {
            this.query.orderBy = []
        }

        this.query.orderBy.push({
            [name]: (isDesc) ? "desc" : "asc"
        })

        return this;
    }

    protected createInclude() {
        if (this.query.include == undefined) {
            this.query.include = {}
        }
    }

    public getQuery(): any {
        const result = this.query;
        this.reset();
        return result;
    }

}