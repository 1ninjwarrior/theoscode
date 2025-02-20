import mysql from 'mysql2';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

console.log('Attempting database connection...');

// Read the SSL certificate
const sslCert = fs.readFileSync('./certs/us-west-2-bundle.pem');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    ssl: {
        ca: sslCert,  // Use the certificate for SSL verification
        minVersion: 'TLSv1.2'
    }
}).promise();

// Test database connection
pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection error:', err.message);
    });

async function getBands() {
    try {
        const [rows] = await pool.query('SELECT * FROM bands');
        return rows;
    } catch (error) {
        console.error('Error in getBands:', error);
        throw error;
    }
}

async function createBand(name) {
    try {
        const [result] = await pool.query(
            'INSERT INTO bands (name) VALUES (?)',
            [name]
        );
        return { id: result.insertId, name };
    } catch (error) {
        console.error('Error in createBand:', error);
        throw error;
    }
}

async function getBand(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM bands WHERE id = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error in getBand:', error);
        throw error;
    }
}

async function updateBand(id, name) {
    const result = await pool.query(`
        UPDATE bands
        
    `)
}

export { getBand, createBand, getBands };
