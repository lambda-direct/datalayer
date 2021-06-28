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
export class CitiesTable extends AbstractTable<CitiesModel, DbCity> {
    name = this.varchar({name: "name", size: 256});
    page = this.varchar({name: "page", size: 256});
    userId = this.int({name: "user_id"})

    tableName(): string {
        return "citiess";
    }

    toServiceModel(response: RowMapper): CitiesModel {
        return {
            name: response.getVarchar(this.name),
            page: response.getVarchar(this.page),
            userId: response.getInt(this.userId)
        };
    }

    toDbModel(citiesModel: CitiesModel): DbCity {
        return {
            name: citiesModel.name,
            page: citiesModel.page,
            user_id: citiesModel.userId
        };
    }
}

interface DbCity {
    name: string;
    page: string;
    user_id: number
}

export interface CitiesModel {
    name: string;
    page: string;
    userId: number
}
```

```typescript
export class UsersTable extends AbstractTable<UsersModel, DbUser> {
    id = this.int({name: "id"}).autoIncrement().primaryKey()
    name = this.varchar({name: "name", size: 256});
    city = this.varchar({name: "city", size: 256});
    country = this.varchar({name: "country", size: 256});

    tableName(): string {
        return "users";
    }

    toServiceModel(response: RowMapper): UsersModel {
        return {
            name: response.getVarchar(this.name),
            city: response.getVarchar(this.city),
            country: response.getVarchar(this.country),
        };
    }

    toDbModel(response: UsersModel): DbUser {
        return response;
    }

    map(response: RowMapper): UsersModel {
        return {
            name: response.getVarchar(this.name),
            city: response.getVarchar(this.city),
            country: response.getVarchar(this.country),
        };
    }
}

interface DbUser {
    name: string;
    city: string;
    country: string;
}

export interface UsersModel {
    name: string;
    city: string;
    country: string;
}
```

```typescript
(async () => {
    const usersTable = new UsersTable();
    const citiesTable = new CitiesTable();
    const testTable = new TestTable();

    const dbConnector: DbConnector = new DbConnector().host("localhost").user("postgres").port(5432).db("minor");
    const db: Db = await dbConnector.connect();
    // db.use(testTable);
    const migrator = new Migrator(db);

    await migrator.chain(3, (dbSession: SessionWrapper) => {
      dbSession.execute(Create.table(usersTable).build());
      dbSession.execute(Create.table(citiesTable).build());
      dbSession.execute(Create.table(testTable).build());
    }).execute();
  
    db.use(usersTable);
    db.use(citiesTable);
    
    const usersToInsert: UsersModel[] = [{
      city:'city',
      country:'country',
      name: 'name'
    },{
      city:'to_delete',
      country:'country',
      name: 'name'
    }];

    const insertedUsers = await usersTable.insert(usersToInsert).returningAll();
    const insertedCities = await citiesTable.insert([{page: 'page', name:'city_name', userId: 1}]).returningAll();

    const selectedUsers = await usersTable.select()
        .where(Where.eq(usersTable.city, 'city'))
        .first();

    const updatedUsers = await usersTable.update()
        .where(Where.eq(usersTable.city, 'city'))
        .set(Updates.set(usersTable.name, 'new_name'))
        .all();

    const deletedUsers = await usersTable.delete()
        .where(Where.eq(usersTable.city, 'to_delete'))
        .returningAll();

    const join = Join.with(usersTable).columns(citiesTable.userId, usersTable.id).joinStrategy(JoinStrategy.INNER_JOIN)

    const citiesWithUsers = await citiesTable.select()
        .join(join)
        .execute()
    
    const mappedJoinResponse = citiesWithUsers.mapByRow((city, user) => {
      return {
        userName: user.name,
        cityPage: city.page
      }
    })
    console.log(mappedJoinResponse);
  })().catch(err => console.log(err.stack))
```
