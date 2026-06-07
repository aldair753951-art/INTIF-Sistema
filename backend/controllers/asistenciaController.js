const asistenciaDAO = require('../dao/asistenciaDAO');
const alumnoDAO = require('../dao/alumnoDAO');
const cursoDAO = require('../dao/cursoDAO');

class AsistenciaController {
    async getAll(req, res) {
    try {
        const usuario = req.usuario;
        let asistencias;
        if (usuario.rol === 'administrativo') {
            asistencias = await asistenciaDAO.getAll();
        } else if (usuario.rol === 'alumno') {
            const alumno = await alumnoDAO.getByUsuarioId(usuario.id);
            if (alumno) {
                asistencias = await asistenciaDAO.getByAlumno(alumno.id);
            } else {
                asistencias = [];
            }
        } else {
            asistencias = [];
        }
        res.json(asistencias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

    async getByAlumno(req, res) {
        try {
            const { alumnoId } = req.params;
            const asistencias = await asistenciaDAO.getByAlumno(alumnoId);
            res.json(asistencias);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getByCurso(req, res) {
        try {
            const { cursoId } = req.params;
            const asistencias = await asistenciaDAO.getByCurso(cursoId);
            res.json(asistencias);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createBatch(req, res) {
        try {
            const { asistencias } = req.body;
            
            if (!asistencias || !Array.isArray(asistencias) || asistencias.length === 0) {
                return res.status(400).json({ mensaje: 'Debe enviar un array de asistencias' });
            }
            
            const resultados = await asistenciaDAO.createBatch(asistencias);
            res.status(201).json({
                mensaje: `${resultados.length} asistencias registradas`,
                asistenciasGuardadas: resultados
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { estado, observacion } = req.body;
            const actualizada = await asistenciaDAO.update(id, { estado, observacion });
            res.json({ mensaje: 'Asistencia actualizada', asistencia: actualizada });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await asistenciaDAO.delete(id);
            res.json({ mensaje: 'Asistencia eliminada' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getReporteConsolidado(req, res) {
        try {
            const { cursoId } = req.query;
            const reporte = await asistenciaDAO.getReporteConsolidado(cursoId);
            res.json(reporte);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getEstadisticas(req, res) {
        try {
            const stats = await asistenciaDAO.getEstadisticas();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new AsistenciaController();