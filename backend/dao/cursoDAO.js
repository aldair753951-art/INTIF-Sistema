const { getConnection, sql } = require('../config/database');

class CursoDAO {
    // Obtener todos los cursos
    async getAll() {
    const pool = await getConnection();
    const result = await pool.request().query(`
        SELECT 
            c.id, 
            c.nombre, 
            c.docente_id, 
            c.horario, 
            c.dias, 
            c.capacidad,
            d.nombre as docente_nombre
        FROM TBL_CURSO c
        LEFT JOIN TBL_DOCENTE d ON c.docente_id = d.id
    `);
    // Asegurar que docente_id sea un número (no array)
    const cursos = result.recordset.map(curso => ({
        ...curso,
        docente_id: curso.docente_id !== null && !Array.isArray(curso.docente_id) ? Number(curso.docente_id) : null
    }));
    return cursos;
}

    // Obtener curso por ID
    async getById(id) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT c.*, d.nombre as docente_nombre
                FROM TBL_CURSO c
                LEFT JOIN TBL_DOCENTE d ON c.docente_id = d.id
                WHERE c.id = @id
            `);
        return result.recordset[0];
    }

    // Obtener cursos por docente
    async getByDocente(docenteId) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('docenteId', sql.Int, docenteId)
            .query(`
                SELECT c.*, d.nombre as docente_nombre
                FROM TBL_CURSO c
                LEFT JOIN TBL_DOCENTE d ON c.docente_id = d.id
                WHERE c.docente_id = @docenteId
                ORDER BY c.nombre
            `);
        return result.recordset;
    }

    // Obtener cursos por alumno
    async getByAlumno(alumnoId) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('alumnoId', sql.Int, alumnoId)
            .query(`
                SELECT c.*, d.nombre as docente_nombre
                FROM TBL_CURSO c
                JOIN TBL_MATRICULA m ON c.id = m.curso_id
                LEFT JOIN TBL_DOCENTE d ON c.docente_id = d.id
                WHERE m.alumno_id = @alumnoId AND m.estado = 'Activo'
                ORDER BY c.nombre
            `);
        return result.recordset;
    }

    // Crear curso
    async create(data) {
        const { nombre, docente_id, horario, dias, capacidad } = data;
        const pool = await getConnection();
        
        const result = await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('docente_id', sql.Int, docente_id || null)
            .input('horario', sql.VarChar, horario || null)
            .input('dias', sql.VarChar, dias || null)
            .input('capacidad', sql.Int, capacidad || 30)
            .query(`
                INSERT INTO TBL_CURSO (nombre, docente_id, horario, dias, capacidad)
                VALUES (@nombre, @docente_id, @horario, @dias, @capacidad);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        
        return { id: result.recordset[0].id, ...data };
    }

async update(id, data) {
    const { nombre, docente_id, horario, dias, capacidad } = data;
    const pool = await getConnection();

    await pool.request()
        .input('id', sql.Int, id)
        .input('nombre', sql.VarChar, nombre)
        .input('docente_id', sql.Int, docente_id === null ? null : docente_id)
        .input('horario', sql.VarChar, horario || null)
        .input('dias', sql.VarChar, dias || null)
        .input('capacidad', sql.Int, capacidad || 30)
        .query(`
            UPDATE TBL_CURSO 
            SET nombre = @nombre, 
                docente_id = @docente_id, 
                horario = @horario, 
                dias = @dias, 
                capacidad = @capacidad
            WHERE id = @id
        `);

    return { id, ...data };
}

    // Eliminar curso
    async delete(id) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM TBL_CURSO WHERE id = @id");
        return { success: true };
    }
}

module.exports = new CursoDAO();