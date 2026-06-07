const cursoDAO = require('../dao/cursoDAO');

class CursoController {
    async getAll(req, res) {
    try {
        let cursos = await cursoDAO.getAll();
        // Fuerza conversión por si algún array se cuela
        cursos = cursos.map(curso => ({
            ...curso,
            docente_id: curso.docente_id && !Array.isArray(curso.docente_id) ? Number(curso.docente_id) : null
        }));
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

        const existe = await cursoDAO.getById(id);
        if (!existe) {
            return res.status(404).json({ mensaje: 'Curso no encontrado' });
        }

        // Actualizar
        const actualizado = await cursoDAO.update(id, {
            nombre,
            docente_id: docente_id || null,   // Asegurar que sea null si no viene
            horario,
            dias,
            capacidad
        });

        // Obtener el curso actualizado (con el nuevo docente_id)
        const cursoActualizado = await cursoDAO.getById(id);

        res.json({ mensaje: 'Curso actualizado', curso: cursoActualizado });
    } catch (error) {
        console.error(error);
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