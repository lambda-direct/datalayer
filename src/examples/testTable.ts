// import { AbstractTable, RowMapper } from "../tables/abstractTable";

// export class TestTable extends AbstractTable<TestsModel, DbTest> {
//     id = this.int({name: "id"}).autoIncrement().primaryKey();
//     name = this.varchar({name: "name", size: 256});
//     url = this.text({name: "url"}).isNullable();
//     price = this.decimal({name: "price", precision: 15, scale: 2});
//     deleted = this.bool({name: "deleted"}).defaultValue(false);
//     created_at = this.timestamp({name: "created_at"});
//     updated_at = this.time({name: "updated_at"});

//     tableName(): string {
//         return "tests";
//     }

//     toServiceModel(res: RowMapper): TestsModel {
//         return {
//             id: res.getInt(this.id),
//             name: res.getVarchar(this.name),
//             url: res.getText(this.url),
//             price: res.getDecimal(this.price),
//             deleted: res.getBool(this.deleted),
//             createdAt: res.getTimestamp(this.created_at),
//             updatedAt: res.getTime(this.updated_at),
//         };
//     }

//     toDbModel(response: TestsModel): DbTest{
//         return {
//             id: response.id,
//             name: response.name,
//             url: response.url,
//             price: response.price,
//             deleted: response.deleted,
//             created_at: response.createdAt,
//             updated_at: response.updatedAt
//         }
//     }
// }

// export interface DbTest {
//     id?: number;
//     name: string;
//     url: string;
//     price: number;
//     deleted: boolean;
//     created_at: Date;
//     updated_at: Date;
// }

// export interface TestsModel {
//     id?: number;
//     name: string;
//     url: string;
//     price: number;
//     deleted: boolean;
//     createdAt: Date;
//     updatedAt: Date;
// }