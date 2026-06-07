const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'aldair',
    server: 'localhost',
    database: 'INTIF_DB',
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectTimeout: 30000
    }
};

let pool = null;

async function getConnection() {
    try {
        if (!pool) {
            console.log('🔄 Conectando a SQL Server...');
            pool = await sql.connect(config);
            console.log('✅ Conectado a SQL Server exitosamente');
        }
        return pool;
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        throw error;
    }
}

module.exports = { getConnection, sql };