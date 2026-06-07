const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciaController');
const { verificarToken } = require('../middlewares/auth');

router.get('/', verificarToken, asistenciaController.getAll);
router.get('/reporte/consolidado', verificarToken, asistenciaController.getReporteConsolidado);
router.get('/estadisticas', verificarToken, asistenciaController.getEstadisticas);
router.get('/alumno/:alumnoId', verificarToken, asistenciaController.getByAlumno);
router.get('/curso/:cursoId', verificarToken, asistenciaController.getByCurso);
router.post('/batch', verificarToken, asistenciaController.createBatch);
router.put('/:id', verificarToken, asistenciaController.update);
router.delete('/:id', verificarToken, asistenciaController.delete);

module.exports = router;