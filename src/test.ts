import { Db } from "./db/db";
import { DbConnector } from "./db/dbConnector";
import { UsersTable } from "./examples/usersTable";
import { MigrationsModel, MigrationsTable } from "./tables/migrationsTable";
import { Where } from './builders/where'
import { Create } from "./builders/create";
import { Pool } from "pg";
import { QueryResponseMapper } from "./builders/requestBuilders";

(async () => {
    // const usersTable = new UsersTable();
    const migrationsTable = new MigrationsTable();
    
    const db: Db = new DbConnector().host("localhost").user("postgres").password("Jawa-350").port(5432).db("datalayer").connect();
    db.use(migrationsTable);

    const migrationsArray: MigrationsModel[] = [
      {id: 0, version: 1, created_at: new Date()},
      {id: 0, version: 2, created_at: new Date()}
    ];
    
    const res = migrationsTable.insert(migrationsArray).returningAll();
    res.then(migrations => migrations.forEach(migration => console.log(migration)));

    // console.log(Create.from(usersTable).build());
    // console.log(Create.from(migrationsTable).build());
    // await db._pool.query(Create.from(migrationsTable).build())

    // const start = Date.now()
    // console.log(await db._pool.query("SELECT * FROM test_config"));
    // console.log("test: " + (Date.now() - start) + " ms");


    // const rows1 = await usersTable.select(Where.eq(usersTable.name, "name"));
    // console.log(rows1);
    // const start2 = Date.now()
    // const rows2 = await usersTable.select();
    // console.log("2 simple select execution time: " + (Date.now() - start2) + " ms");

    // const start3 = Date.now()
    // const rows3 = await usersTable.select();
    // console.log("3 simple select execution time: " + (Date.now() - start3) + " ms");

    // const start4 = Date.now()
    // const rows4 = await usersTable.select();
    // console.log("4 simple select execution time: " + (Date.now() - start4) + " ms");
    // console.log(rows);
  })().catch(err => console.log(err.stack))

export default '';