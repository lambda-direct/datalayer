import { ClientConfig, Pool } from "pg";
import { Db } from "./db";

export class DBStringConnector { 
    private _url: string;

    constructor(url: string) {
        this._url = url;
    }

    async connect(): Promise<Db> {
        const config = {
            connectionString: this._url
        } as ClientConfig;
        
        try {
            const pool = new Pool(config);

            await pool.connect();
            console.log("Db connected!");

            return new Db(pool);
        } catch (e) {
            console.log("Connection error: " + e.message);
            throw new Error("Connection error: " + e.message);
        }
    }
}

export class DbConnector {
    private _host: string;
    private _db: string;
    private _port: number;
    private _user: string;
    private _password: string;

    constructor() {

    }

    connectionString(url: string): DBStringConnector {
        return new DBStringConnector(url);
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

    async connect(): Promise<Db> {
        const config = {
            user: this._user,
            host: this._host,
            database: this._db,
            password: this._password,
            port: this._port,
        } as ClientConfig;
        
        try {
            const pool = new Pool(config);

            await pool.connect();
            console.log("Db connected!");

            return new Db(pool);
        } catch (e) {
            console.log("Connection error: " + e.message);
            throw new Error("Connection error: " + e.message);
        }
    }
}