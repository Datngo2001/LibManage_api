export class UpdateBuilder {
    private query: any = { data: {}, where: {} };

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

    public whereId(id: number) {
        this.query.where = { id: id };
        return this;
    }

    public addColumn({ name, value }) {
        this.query.data[name] = value
        return this
    }

    public removeColumn(name) {
        delete this.query[name]
        return this
    }

    public getQuery(): any {
        const result = this.query;
        this.reset();
        return result;
    }
}