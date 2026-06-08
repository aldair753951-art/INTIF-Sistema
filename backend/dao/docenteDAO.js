const { getConnection, sql } = require('../config/database');

class DocenteDAO {
    async getAll() {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT d.*, u.usuario, u.estado as usuario_estado
            FROM TBL_DOCENTE d
            LEFT JOIN TBL_USUARIO u ON d.usuario_id = u.id
            ORDER BY d.nombre
        `);
        return result.recordset;
    }

    async getById(id) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM TBL_DOCENTE WHERE id = @id');
        return result.recordset[0];
    }

    async getByUsuarioId(usuarioId) {
    const pool = await getConnection();
    const result = await pool.request()
        .input('usuarioId', sql.Int, usuarioId)
        .query('SELECT * FROM TBL_DOCENTE WHERE usuario_id = @usuarioId');
    return result.recordset[0];
}

    async create(data) {
    const { nombre, dni, especialidad, telefono, email, usuario_id, estado } = data;
    const pool = await getConnection();
    const result = await pool.request()
        .input('nombre', sql.VarChar, nombre)
        .input('dni', sql.VarChar, dni)
        .input('especialidad', sql.VarChar, especialidad || null)
        .input('telefono', sql.VarChar, telefono || null)
        .input('email', sql.VarChar, email || null)
        .input('usuario_id', sql.Int, usuario_id)   // ← asegurar que se guarda
        .input('estado', sql.VarChar, estado || 'Activo')
        .query(`
            INSERT INTO TBL_DOCENTE (nombre, dni, especialidad, telefono, email, usuario_id, estado)
            VALUES (@nombre, @dni, @especialidad, @telefono, @email, @usuario_id, @estado);
            SELECT SCOPE_IDENTITY() AS id;
        `);
    return { id: result.recordset[0].id, ...data };
}

    async update(id, data) {
        const { nombre, dni, especialidad, telefono, email, estado } = data;
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, nombre)
            .input('dni', sql.VarChar, dni)
            .input('especialidad', sql.VarChar, especialidad || null)
            .input('telefono', sql.VarChar, telefono || null)
            .input('email', sql.VarChar, email || null)
            .input('estado', sql.VarChar, estado || 'Activo')
            .query(`
                UPDATE TBL_DOCENTE
                SET nombre = @nombre, dni = @dni, especialidad = @especialidad,
                    telefono = @telefono, email = @email, estado = @estado
                WHERE id = @id
            `);
        return { id, ...data };
    }

    async delete(id) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM TBL_DOCENTE WHERE id = @id');
        return { success: true };
    }

    async getCursos(docenteId) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('docenteId', sql.Int, docenteId)
            .query(`
                SELECT c.* FROM TBL_CURSO c
                WHERE c.docente_id = @docenteId
                ORDER BY c.nombre
            `);
        return result.recordset;
    }
}

module.exports = new DocenteDAO();