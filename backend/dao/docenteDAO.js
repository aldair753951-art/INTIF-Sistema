const { getConnection, sql } = require('../config/database');

class DocenteDAO {
    async create(data) {
    const { id, nombre, dni, especialidad, telefono, email, estado } = data;
    const pool = await getConnection();
    // Usamos SET IDENTITY_INSERT para poder especificar el id
    await pool.request()
        .query('SET IDENTITY_INSERT TBL_DOCENTE ON');
    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('nombre', sql.VarChar, nombre)
        .input('dni', sql.VarChar, dni)
        .input('especialidad', sql.VarChar, especialidad || null)
        .input('telefono', sql.VarChar, telefono || null)
        .input('email', sql.VarChar, email || null)
        .input('estado', sql.VarChar, estado || 'Activo')
        .query(`
            INSERT INTO TBL_DOCENTE (id, nombre, dni, especialidad, telefono, email, estado)
            VALUES (@id, @nombre, @dni, @especialidad, @telefono, @email, @estado)
        `);
    await pool.request().query('SET IDENTITY_INSERT TBL_DOCENTE OFF');
    return { id, ...data };
}

    // Obtener todos los docentes
    async getAll() {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT id, nombre, dni, especialidad, telefono, email, estado FROM TBL_DOCENTE");
    return result.recordset;
}

    // Obtener docente por ID
    async getById(id) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query("SELECT * FROM TBL_DOCENTE WHERE id = @id");
        return result.recordset[0];
    }

    // Buscar por DNI
    async getByDni(dni) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('dni', sql.VarChar, dni)
            .query("SELECT * FROM TBL_DOCENTE WHERE dni = @dni");
        return result.recordset[0];
    }

    // Buscar por nombre
    async search(filtro) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('filtro', sql.VarChar, `%${filtro}%`)
            .query(`
                SELECT * FROM TBL_DOCENTE 
                WHERE nombre LIKE @filtro 
                   OR dni LIKE @filtro 
                   OR especialidad LIKE @filtro
                ORDER BY nombre
            `);
        return result.recordset;
    }

    // Crear docente
    async create(data) {
        const { nombre, dni, especialidad, telefono, email } = data;
        const pool = await getConnection();
        
        const result = await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('dni', sql.VarChar, dni)
            .input('especialidad', sql.VarChar, especialidad || null)
            .input('telefono', sql.VarChar, telefono || null)
            .input('email', sql.VarChar, email || null)
            .query(`
                INSERT INTO TBL_DOCENTE (nombre, dni, especialidad, telefono, email, estado)
                VALUES (@nombre, @dni, @especialidad, @telefono, @email, 'Activo');
                SELECT SCOPE_IDENTITY() AS id;
            `);
        
        return { id: result.recordset[0].id, ...data, estado: 'Activo' };
    }

    // Actualizar docente
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

    // Eliminar docente
    async delete(id) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM TBL_DOCENTE WHERE id = @id");
        return { success: true };
    }

    // Obtener cursos del docente
    async getCursos(docenteId) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('docenteId', sql.Int, docenteId)
            .query(`
                SELECT id, nombre, horario, dias, capacidad
                FROM TBL_CURSO
                WHERE docente_id = @docenteId
                ORDER BY nombre
            `);
        return result.recordset;
    }
}

module.exports = new DocenteDAO();