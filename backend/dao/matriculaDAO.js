const { getConnection, sql } = require('../config/database');

class MatriculaDAO {
    // Obtener todas las matrículas
    async getAll() {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT m.*, a.nombre as alumno_nombre, a.codigo, c.nombre as curso_nombre, c.horario
            FROM TBL_MATRICULA m
            JOIN TBL_ALUMNO a ON m.alumno_id = a.id
            JOIN TBL_CURSO c ON m.curso_id = c.id
            ORDER BY m.fecha DESC
        `);
        return result.recordset;
    }

    // Obtener matrícula por ID
    async getById(id) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT m.*, a.nombre as alumno_nombre, c.nombre as curso_nombre
                FROM TBL_MATRICULA m
                JOIN TBL_ALUMNO a ON m.alumno_id = a.id
                JOIN TBL_CURSO c ON m.curso_id = c.id
                WHERE m.id = @id
            `);
        return result.recordset[0];
    }

    // Obtener matrículas por alumno
    async getByAlumno(alumnoId) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('alumnoId', sql.Int, alumnoId)
            .query(`
                SELECT m.*, c.nombre as curso_nombre, c.horario, c.dias, c.capacidad
                FROM TBL_MATRICULA m
                JOIN TBL_CURSO c ON m.curso_id = c.id
                WHERE m.alumno_id = @alumnoId AND m.estado = 'Activo'
                ORDER BY c.nombre
            `);
        return result.recordset;
    }

    // Obtener matrículas por curso
    async getByCurso(cursoId) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('cursoId', sql.Int, cursoId)
            .query(`
                SELECT m.*, a.nombre as alumno_nombre, a.codigo
                FROM TBL_MATRICULA m
                JOIN TBL_ALUMNO a ON m.alumno_id = a.id
                WHERE m.curso_id = @cursoId AND m.estado = 'Activo'
                ORDER BY a.nombre
            `);
        return result.recordset;
    }

    // Verificar si ya existe matrícula
    async existeMatricula(alumnoId, cursoId) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('alumnoId', sql.Int, alumnoId)
            .input('cursoId', sql.Int, cursoId)
            .query(`
                SELECT id FROM TBL_MATRICULA 
                WHERE alumno_id = @alumnoId AND curso_id = @cursoId AND estado = 'Activo'
            `);
        return result.recordset.length > 0;
    }

    // Contar alumnos por curso
    async contarAlumnosPorCurso(cursoId) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('cursoId', sql.Int, cursoId)
            .query(`
                SELECT COUNT(*) as total
                FROM TBL_MATRICULA
                WHERE curso_id = @cursoId AND estado = 'Activo'
            `);
        return result.recordset[0].total;
    }

    // Crear matrícula
    async create(data) {
        const { alumno_id, curso_id, fecha, estado } = data;
        const pool = await getConnection();
        
        // Verificar si ya existe
        const existe = await this.existeMatricula(alumno_id, curso_id);
        if (existe) {
            throw new Error('El alumno ya está matriculado en este curso');
        }
        
        // Verificar cupo
        const curso = await pool.request()
            .input('cursoId', sql.Int, curso_id)
            .query('SELECT capacidad FROM TBL_CURSO WHERE id = @cursoId');
        
        const alumnosActuales = await this.contarAlumnosPorCurso(curso_id);
        
        if (curso.recordset[0] && alumnosActuales >= curso.recordset[0].capacidad) {
            throw new Error('El curso ha alcanzado su capacidad máxima');
        }
        
        const result = await pool.request()
            .input('alumno_id', sql.Int, alumno_id)
            .input('curso_id', sql.Int, curso_id)
            .input('fecha', sql.Date, fecha || new Date().toISOString().split('T')[0])
            .input('estado', sql.VarChar, estado || 'Activo')
            .query(`
                INSERT INTO TBL_MATRICULA (alumno_id, curso_id, fecha, estado)
                VALUES (@alumno_id, @curso_id, @fecha, @estado);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        
        return { id: result.recordset[0].id, ...data };
    }

    // Actualizar matrícula
    async update(id, data) {
        const { estado } = data;
        const pool = await getConnection();
        
        await pool.request()
            .input('id', sql.Int, id)
            .input('estado', sql.VarChar, estado)
            .query(`
                UPDATE TBL_MATRICULA 
                SET estado = @estado
                WHERE id = @id
            `);
        
        return { id, ...data };
    }

    // Eliminar matrícula (dar de baja)
    async delete(id) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM TBL_MATRICULA WHERE id = @id");
        return { success: true };
    }

    // Dar de baja (soft delete)
    async darBaja(id) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query("UPDATE TBL_MATRICULA SET estado = 'Inactivo' WHERE id = @id");
        return { success: true };
    }
}

module.exports = new MatriculaDAO();