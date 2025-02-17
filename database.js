import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10
}).promise();

async function getBand(thisID) {
    const [result] = await pool.query(`
        SELECT * FROM bands
        WHERE id = ?
        `, [thisID]);
    return result[0];
}

async function getBands() {
    const [result] = await pool.query(`
        SELECT * FROM bands
        `);
    return result;
}

async function createBand(name) {
    const result = await pool.query(`
        INSERT INTO bands (name)
        VALUES (?)
        `, [name]);
    return result[0];
}

async function updateBand(id, name) {
    const result = await pool.query(`
        UPDATE bands
        
    `)
}
export { getBand, createBand, getBands };
