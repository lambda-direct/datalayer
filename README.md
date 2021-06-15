# MinorORM

**MinorORM** is an ORM framework for 
[TypeScript](https://www.typescriptlang.org/).
It offers you several levels of Database communication:
* Typesafe Table View approach 
* Typesafe Query Builder
* Simple SQL query execution

Minor ORM is highly influenced by [Exposed](https://github.com/JetBrains/Exposed) and Jetbrains development methodology

## Supported Databases

* PostgreSQL

## Links

In Progress

## Examples

### Table View

```typescript
export class UsersTable extends AbstractTable<UsersModel> {
    id = this.int({name: "id"}).autoIncrement().primaryKey()
    name = this.varchar({name: "name", size: 256});
    city = this.varchar({name: "city", size: 256});
    country = this.varchar({name: "country", size: 256});

    tableName(): string {
        return "users";
    }

    map(response: RowMapper): UsersModel {
        return {
            name: response.getVarchar(this.name),
            city: response.getVarchar(this.city),
            country: response.getVarchar(this.country),
        };
    }
}

export interface UsersModel {
    name: string;
    city: string;
    country: string;
}
```
