const { getConnection, sql } = require('../config/database');

class SolicitudDAO {
    async create(data) {
        const { alumno_id, curso_id, fecha_clase, motivo, evidencia, docente_id } = data;
        const pool = await getConnection();
        const result = await pool.request()
            .input('alumno_id', sql.Int, alumno_id)
            .input('curso_id', sql.Int, curso_id)
            .input('fecha_clase', sql.Date, fecha_clase)
            .input('motivo', sql.Text, motivo)
            .input('evidencia', sql.VarChar, evidencia || null)
            .input('docente_id', sql.Int, docente_id)
            .query(`
                INSERT INTO TBL_SOLICITUD_RECUPERACION 
                (alumno_id, curso_id, fecha_clase, motivo, evidencia, docente_id, estado, fecha_solicitud)
                VALUES (@alumno_id, @curso_id, @fecha_clase, @motivo, @evidencia, @docente_id, 'pendiente', GETDATE());
                SELECT SCOPE_IDENTITY() AS id;
            `);
        return { id: result.recordset[0].id, ...data, estado: 'pendiente' };
    }

    async getByDocente(docenteId) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('docenteId', sql.Int, docenteId)
            .query(`
                SELECT s.*, a.nombre as alumno_nombre, c.nombre as curso_nombre
                FROM TBL_SOLICITUD_RECUPERACION s
                JOIN TBL_ALUMNO a ON s.alumno_id = a.id
                JOIN TBL_CURSO c ON s.curso_id = c.id
                WHERE s.docente_id = @docenteId
                ORDER BY s.fecha_solicitud DESC
            `);
        return result.recordset;
    }

    async getByAlumno(alumnoId) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('alumnoId', sql.Int, alumnoId)
            .query(`
                SELECT s.*, c.nombre as curso_nombre
                FROM TBL_SOLICITUD_RECUPERACION s
                JOIN TBL_CURSO c ON s.curso_id = c.id
                WHERE s.alumno_id = @alumnoId
                ORDER BY s.fecha_solicitud DESC
            `);
        return result.recordset;
    }

    async updateEstado(id, estado, respuesta) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('estado', sql.VarChar, estado)
            .input('respuesta', sql.Text, respuesta || null)
            .query(`
                UPDATE TBL_SOLICITUD_RECUPERACION
                SET estado = @estado, respuesta = @respuesta
                WHERE id = @id
            `);
        return { id, estado };
    }
}

module.exports = new SolicitudDAO();