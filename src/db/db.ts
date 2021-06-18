import { AbstractTable } from '../tables/abstractTable';
import { Pool } from 'pg';

export class Db {
    _pool: Pool;

    constructor(pool: Pool){
        this._pool = pool;
    }

    use<T extends AbstractTable<{}>>(table: T){
        table.withConnection(this._pool);
    }
}