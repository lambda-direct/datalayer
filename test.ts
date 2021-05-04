import { Db } from "./src/db/db";
import { DbConnector } from "./src/db/dbConnector";
import { UsersTable } from "./src/examples/usersTable";
import { Where } from './src/builders/where'

(async () => {
    const usersTable = new UsersTable();

    const db: Db = new DbConnector().host("localhost").user("postgres").port(5432).db("test2").connect();
    db.use(usersTable);

    // const start = Date.now()
    // console.log(await db._pool.query("SELECT * FROM test_config"));
    // console.log("test: " + (Date.now() - start) + " ms");


    const rows1 = await usersTable.select(Where.eq(usersTable.name, "name"));
    console.log(rows1);
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