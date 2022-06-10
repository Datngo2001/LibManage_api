export class CreateBuilder {
    private query: any = { data: {} };

    constructor() {
        this.reset();
    }

    public reset(): void {
        this.query = {};
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