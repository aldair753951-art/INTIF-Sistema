const solicitudDAO = require('../dao/solicitudDAO');
const alumnoDAO = require('../dao/alumnoDAO');
const cursoDAO = require('../dao/cursoDAO');
const docenteDAO = require('../dao/docenteDAO');

class SolicitudController {
    async create(req, res) {
        try {
            const { alumno_id, curso_id, fecha_clase, motivo, evidencia } = req.body;
            const usuario = req.usuario; // del token

            // Obtener el alumno asociado al usuario
            const alumno = await alumnoDAO.getByUsuarioId(usuario.id);
            if (!alumno) return res.status(404).json({ mensaje: 'Perfil de alumno no encontrado' });

            // Obtener el curso para saber el docente responsable
            const curso = await cursoDAO.getById(curso_id);
            if (!curso) return res.status(404).json({ mensaje: 'Curso no encontrado' });
            if (!curso.docente_id) return res.status(400).json({ mensaje: 'El curso no tiene docente asignado' });

            const nueva = await solicitudDAO.create({
                alumno_id: alumno.id,
                curso_id,
                fecha_clase,
                motivo,
                evidencia,
                docente_id: curso.docente_id
            });
            res.status(201).json({ mensaje: 'Solicitud enviada', solicitud: nueva });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getByDocente(req, res) {
        try {
            const usuario = req.usuario;
            const docente = await docenteDAO.getByUsuarioId(usuario.id);
            if (!docente) return res.status(404).json({ mensaje: 'Perfil de docente no encontrado' });
            const solicitudes = await solicitudDAO.getByDocente(docente.id);
            res.json(solicitudes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getByAlumno(req, res) {
        try {
            const usuario = req.usuario;
            const alumno = await alumnoDAO.getByUsuarioId(usuario.id);
            if (!alumno) return res.status(404).json({ mensaje: 'Perfil de alumno no encontrado' });
            const solicitudes = await solicitudDAO.getByAlumno(alumno.id);
            res.json(solicitudes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateEstado(req, res) {
        try {
            const { id } = req.params;
            const { estado, respuesta } = req.body;
            const actualizada = await solicitudDAO.updateEstado(id, estado, respuesta);
            res.json({ mensaje: 'Solicitud actualizada', solicitud: actualizada });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new SolicitudController();