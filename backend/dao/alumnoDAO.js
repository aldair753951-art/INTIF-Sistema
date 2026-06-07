const { getConnection, sql } = require('../config/database');

class AlumnoDAO {
    async getAll() {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT a.id, a.nombre, a.dni, a.codigo, a.programa, a.usuario_id,
                   CASE WHEN a.usuario_id IS NULL THEN 'Sin usuario' ELSE 'Con usuario' END as estado
            FROM TBL_ALUMNO a
            ORDER BY a.nombre
        `);
        return result.recordset;
    }

    async getById(id) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM TBL_ALUMNO WHERE id = @id');
        return result.recordset[0];
    }

    async getByDni(dni) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('dni', sql.VarChar, dni)
            .query('SELECT * FROM TBL_ALUMNO WHERE dni = @dni');
        return result.recordset[0];
    }

    async getByCodigo(codigo) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('codigo', sql.VarChar, codigo)
            .query('SELECT * FROM TBL_ALUMNO WHERE codigo = @codigo');
        return result.recordset[0];
    }

    async create(data) {
        const { nombre, dni, codigo, programa, usuario_id } = data;
        const pool = await getConnection();

        const result = await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('dni', sql.VarChar, dni)
            .input('codigo', sql.VarChar, codigo)
            .input('programa', sql.VarChar, programa || null)
            .input('usuario_id', sql.Int, usuario_id)
            .query(`
                INSERT INTO TBL_ALUMNO (nombre, dni, codigo, programa, usuario_id)
                VALUES (@nombre, @dni, @codigo, @programa, @usuario_id);
                SELECT SCOPE_IDENTITY() AS id;
            `);

        return { id: result.recordset[0].id, nombre, dni, codigo, programa, usuario_id };
    }

    async update(id, data) {
        const { nombre, dni, codigo, programa } = data;
        const pool = await getConnection();

        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, nombre)
            .input('dni', sql.VarChar, dni)
            .input('codigo', sql.VarChar, codigo)
            .input('programa', sql.VarChar, programa || null)
            .query(`
                UPDATE TBL_ALUMNO
                SET nombre = @nombre, dni = @dni, codigo = @codigo, programa = @programa
                WHERE id = @id
            `);

        return { id, nombre, dni, codigo, programa };
    }

    async delete(id) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM TBL_ALUMNO WHERE id = @id');
        return { success: true };
    }

    async search(filtro) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('filtro', sql.VarChar, `%${filtro}%`)
            .query(`
                SELECT * FROM TBL_ALUMNO
                WHERE nombre LIKE @filtro
                   OR codigo LIKE @filtro
                   OR dni LIKE @filtro
                ORDER BY nombre
            `);
        return result.recordset;
    }

    // Obtener alumnos por curso (para reportes)
    async getByCurso(cursoId) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('cursoId', sql.Int, cursoId)
            .query(`
                SELECT a.id, a.nombre, a.codigo, a.dni
                FROM TBL_ALUMNO a
                JOIN TBL_MATRICULA m ON a.id = m.alumno_id
                WHERE m.curso_id = @cursoId AND m.estado = 'Activo'
                ORDER BY a.nombre
            `);
        return result.recordset;
    }

    // backend/dao/alumnoDAO.js
async getByUsuarioId(usuarioId) {
    const pool = await getConnection();
    const result = await pool.request()
        .input('usuarioId', sql.Int, usuarioId)
        .query('SELECT * FROM TBL_ALUMNO WHERE usuario_id = @usuarioId');
    return result.recordset[0];
}

}


module.exports = new AlumnoDAO();