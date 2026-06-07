const { getConnection, sql } = require('../config/database');

class AsistenciaDAO {
    // Obtener todas las asistencias
    async getAll() {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT a.*, al.nombre as alumno_nombre, al.codigo, c.nombre as curso_nombre
            FROM TBL_ASISTENCIA a
            JOIN TBL_ALUMNO al ON a.alumno_id = al.id
            JOIN TBL_CURSO c ON a.curso_id = c.id
            ORDER BY a.fecha DESC
        `);
        return result.recordset;
    }

    // Obtener asistencias por alumno
    async getByAlumno(alumnoId) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('alumnoId', sql.Int, alumnoId)
            .query(`
                SELECT a.*, c.nombre as curso_nombre, c.horario
                FROM TBL_ASISTENCIA a
                JOIN TBL_CURSO c ON a.curso_id = c.id
                WHERE a.alumno_id = @alumnoId
                ORDER BY a.fecha DESC
            `);
        return result.recordset;
    }

    // Obtener asistencias por curso
    async getByCurso(cursoId) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('cursoId', sql.Int, cursoId)
            .query(`
                SELECT a.*, al.nombre as alumno_nombre, al.codigo
                FROM TBL_ASISTENCIA a
                JOIN TBL_ALUMNO al ON a.alumno_id = al.id
                WHERE a.curso_id = @cursoId
                ORDER BY a.fecha DESC
            `);
        return result.recordset;
    }

    // Obtener asistencias por fecha
    async getByFecha(fecha) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('fecha', sql.Date, fecha)
            .query(`
                SELECT a.*, al.nombre as alumno_nombre, c.nombre as curso_nombre
                FROM TBL_ASISTENCIA a
                JOIN TBL_ALUMNO al ON a.alumno_id = al.id
                JOIN TBL_CURSO c ON a.curso_id = c.id
                WHERE a.fecha = @fecha
                ORDER BY a.fecha DESC
            `);
        return result.recordset;
    }

    // Obtener asistencias por curso y fecha
    async getByCursoYFecha(cursoId, fecha) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('cursoId', sql.Int, cursoId)
            .input('fecha', sql.Date, fecha)
            .query(`
                SELECT a.*, al.nombre as alumno_nombre, al.codigo
                FROM TBL_ASISTENCIA a
                JOIN TBL_ALUMNO al ON a.alumno_id = al.id
                WHERE a.curso_id = @cursoId AND a.fecha = @fecha
                ORDER BY al.nombre
            `);
        return result.recordset;
    }

    // Verificar si ya existe registro
    async existeRegistro(alumnoId, cursoId, fecha) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('alumnoId', sql.Int, alumnoId)
            .input('cursoId', sql.Int, cursoId)
            .input('fecha', sql.Date, fecha)
            .query(`
                SELECT id FROM TBL_ASISTENCIA 
                WHERE alumno_id = @alumnoId 
                  AND curso_id = @cursoId 
                  AND fecha = @fecha
            `);
        return result.recordset.length > 0;
    }

    // Crear asistencia individual
    async create(data) {
        const { alumno_id, curso_id, fecha, estado, observacion } = data;
        const pool = await getConnection();
        
        const result = await pool.request()
            .input('alumno_id', sql.Int, alumno_id)
            .input('curso_id', sql.Int, curso_id)
            .input('fecha', sql.Date, fecha)
            .input('estado', sql.VarChar, estado)
            .input('observacion', sql.VarChar, observacion || '')
            .query(`
                INSERT INTO TBL_ASISTENCIA (alumno_id, curso_id, fecha, estado, observacion)
                VALUES (@alumno_id, @curso_id, @fecha, @estado, @observacion);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        
        return { id: result.recordset[0].id, ...data };
    }

    // Crear múltiples asistencias (batch)
    async createBatch(asistencias) {
        const resultados = [];
        for (const asistencia of asistencias) {
            const existe = await this.existeRegistro(
                asistencia.alumno_id,
                asistencia.curso_id,
                asistencia.fecha
            );
            
            if (!existe) {
                const nueva = await this.create(asistencia);
                resultados.push(nueva);
            }
        }
        return resultados;
    }

    // Actualizar asistencia
    async update(id, data) {
        const { estado, observacion } = data;
        const pool = await getConnection();
        
        await pool.request()
            .input('id', sql.Int, id)
            .input('estado', sql.VarChar, estado)
            .input('observacion', sql.VarChar, observacion || '')
            .query(`
                UPDATE TBL_ASISTENCIA 
                SET estado = @estado, observacion = @observacion
                WHERE id = @id
            `);
        
        return { id, ...data };
    }

    // Eliminar asistencia
    async delete(id) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM TBL_ASISTENCIA WHERE id = @id");
        return { success: true };
    }

    // Reporte consolidado de asistencia por alumno
    async getReporteConsolidado(cursoId = null) {
        const pool = await getConnection();
        let query = `
            SELECT 
                al.id,
                al.nombre,
                al.codigo,
                al.programa,
                COUNT(a.id) as total_clases,
                SUM(CASE WHEN a.estado = 'Asistió' THEN 1 ELSE 0 END) as asistencias,
                SUM(CASE WHEN a.estado = 'Falta' THEN 1 ELSE 0 END) as faltas,
                SUM(CASE WHEN a.estado = 'Tardanza' THEN 1 ELSE 0 END) as tardanzas,
                SUM(CASE WHEN a.estado = 'Justificado' THEN 1 ELSE 0 END) as justificados
            FROM TBL_ALUMNO al
            LEFT JOIN TBL_ASISTENCIA a ON al.id = a.alumno_id
        `;
        
        if (cursoId) {
            query += ` AND a.curso_id = @cursoId`;
        }
        
        query += ` GROUP BY al.id, al.nombre, al.codigo, al.programa ORDER BY al.nombre`;
        
        const request = pool.request();
        if (cursoId) {
            request.input('cursoId', sql.Int, cursoId);
        }
        
        const result = await request.query(query);
        
        return result.recordset.map(r => ({
            ...r,
            porcentaje: r.total_clases > 0 ? Math.round((r.asistencias / r.total_clases) * 100) : 0
        }));
    }

    // Estadísticas rápidas
    async getEstadisticas() {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT 
                COUNT(*) as total_registros,
                SUM(CASE WHEN estado = 'Asistió' THEN 1 ELSE 0 END) as total_presentes,
                SUM(CASE WHEN estado = 'Falta' THEN 1 ELSE 0 END) as total_faltas,
                SUM(CASE WHEN estado = 'Tardanza' THEN 1 ELSE 0 END) as total_tardanzas
            FROM TBL_ASISTENCIA
        `);
        return result.recordset[0];
    }
}

module.exports = new AsistenciaDAO();