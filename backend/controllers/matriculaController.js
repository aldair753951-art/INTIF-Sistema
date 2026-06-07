const matriculaDAO = require('../dao/matriculaDAO');
const alumnoDAO = require('../dao/alumnoDAO');

class MatriculaController {
    async getAll(req, res) {
        try {
            const usuario = req.usuario;
            if (usuario.rol === 'administrativo') {
                const matriculas = await matriculaDAO.getAll();
                return res.json(matriculas);
            } else if (usuario.rol === 'alumno') {
                const alumno = await alumnoDAO.getByUsuarioId(usuario.id);
                if (!alumno) return res.json([]);
                const matriculas = await matriculaDAO.getByAlumno(alumno.id);
                return res.json(matriculas);
            } else {
                return res.json([]);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const matricula = await matriculaDAO.getById(id);
            if (!matricula) return res.status(404).json({ mensaje: 'Matrícula no encontrada' });
            res.json(matricula);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getByAlumno(req, res) {
        try {
            const { alumnoId } = req.params;
            const matriculas = await matriculaDAO.getByAlumno(alumnoId);
            res.json(matriculas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getByCurso(req, res) {
        try {
            const { cursoId } = req.params;
            const matriculas = await matriculaDAO.getByCurso(cursoId);
            res.json(matriculas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const { alumno_id, curso_id, fecha, estado } = req.body;
            if (!alumno_id || !curso_id) {
                return res.status(400).json({ mensaje: 'Alumno y curso son obligatorios' });
            }
            const nuevaMatricula = await matriculaDAO.create({
                alumno_id,
                curso_id,
                fecha: fecha || new Date().toISOString().split('T')[0],
                estado: estado || 'Activo'
            });
            res.status(201).json({ mensaje: 'Matrícula creada', matricula: nuevaMatricula });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            const actualizada = await matriculaDAO.update(id, { estado });
            res.json({ mensaje: 'Matrícula actualizada', matricula: actualizada });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async darBaja(req, res) {
        try {
            const { id } = req.params;
            const actualizada = await matriculaDAO.update(id, { estado: 'Inactivo' });
            res.json({ mensaje: 'Matrícula dada de baja', matricula: actualizada });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await matriculaDAO.delete(id);
            res.json({ mensaje: 'Matrícula eliminada' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new MatriculaController();