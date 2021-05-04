import { Db } from "./src/db/db";
import { DbConnector } from "./src/db/dbConnector";
import { UsersTable } from "./src/examples/usersTable";

(async () => {
    const usersTable = new UsersTable();

    const db: Db = new DbConnector().host("localhost").user("postgres").port(5432).db("test2").connect();
    db.use(usersTable);

    const rows = await usersTable.select();
    console.log(rows);
  })().catch(err => console.log(err.stack))

export default '';