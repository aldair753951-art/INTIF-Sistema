const { getConnection } = require('./config/database');

async function test() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT @@VERSION as version');
        console.log('✅ Conexión exitosa!');
        console.log('Versión SQL:', result.recordset[0].version);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

test();