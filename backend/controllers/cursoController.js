const cursoDAO = require('../dao/cursoDAO');
const docenteDAO = require('../dao/docenteDAO');

class CursoController {
    async getAll(req, res) {
        try {
            const usuario = req.usuario;
            let cursos = [];

            if (usuario.rol === 'administrativo') {
                cursos = await cursoDAO.getAll();
            } 
            else if (usuario.rol === 'docente') {
                const docente = await docenteDAO.getByUsuarioId(usuario.id);
                if (docente) {
                    cursos = await cursoDAO.getByDocente(docente.id);
                }
            }
            // Para alumno, podrías devolver cursos de sus matrículas (opcional)
            res.json(cursos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const curso = await cursoDAO.getById(id);
            if (!curso) return res.status(404).json({ mensaje: 'Curso no encontrado' });
            res.json(curso);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getByDocente(req, res) {
        try {
            const { docenteId } = req.params;
            const cursos = await cursoDAO.getByDocente(docenteId);
            res.json(cursos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getByAlumno(req, res) {
        try {
            const { alumnoId } = req.params;
            const cursos = await cursoDAO.getByAlumno(alumnoId);
            res.json(cursos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const { nombre, docente_id, horario, dias, capacidad } = req.body;
            if (!nombre) return res.status(400).json({ mensaje: 'El nombre del curso es obligatorio' });
            
            const nuevoCurso = await cursoDAO.create({ nombre, docente_id, horario, dias, capacidad });
            res.status(201).json({ mensaje: 'Curso creado', curso: nuevoCurso });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

async update(req, res) {
    try {
        const { id } = req.params;
        const { nombre, docente_id, horario, dias, capacidad } = req.body;
        const actualizado = await cursoDAO.update(id, { nombre, docente_id, horario, dias, capacidad });
        res.json({ mensaje: 'Curso actualizado', curso: actualizado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

    async delete(req, res) {
        try {
            const { id } = req.params;
            const existe = await cursoDAO.getById(id);
            if (!existe) return res.status(404).json({ mensaje: 'Curso no encontrado' });
            
            await cursoDAO.delete(id);
            res.json({ mensaje: 'Curso eliminado' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new CursoController();