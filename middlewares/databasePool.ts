import { createPool, Pool } from 'mariadb';
import * as dotenv from 'dotenv';

dotenv.config();

const pool: Pool = createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    database: process.env.DB
});

let conn = 0;

console.log("[Fur'Agora] MySQL Database initializing...")

pool.on("connection", event => { // Initialisation quand il y a connexion DB
    conn ++;
    if(conn === 10) console.log(`[Fur'Agora] MySQL Database connected to ${process.env.DBHOST} with user ${process.env.DBUSER}`)
})

// console.log(`[Fur'Agora] MySQL Database connecting to ${process.env.DBHOST} with user ${process.env.DBUSER}`)

export default pool;