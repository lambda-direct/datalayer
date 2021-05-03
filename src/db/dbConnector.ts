import { ClientConfig, Pool } from "pg";
import { Db } from "./db";

export class DbConnector {
    private _host: string;
    private _db: string;
    private _port: number;
    private _user: string;
    private _password: string;

    constructor() {

    }

    host(host: string): DbConnector {
        this._host = host;
        return this;
    }

    port(port: number): DbConnector {
        this._port = port
        return this;
    }

    db(db: string): DbConnector {
        this._db = db;
        return this;
    }

    user(user: string): DbConnector {
        this._user = user;
        return this;
    }

    password(password: string): DbConnector {
        this._password = password;
        return this;
    }

    connect(): Db {
        const config = {
            user: this._user,
            host: this._host,
            database: this._db,
            password: this._password,
            port: this._port,
        } as ClientConfig;
        
        try {
            const pool = new Pool(config);
            return new Db(pool);
        } catch(e) {
            // Proper error handling
            console.log(e);
            // Not sure if we should throw new Error??
            throw new Error();
        };
    }
}