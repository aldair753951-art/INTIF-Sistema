const express = require('express');
const router = express.Router();
const matriculaController = require('../controllers/matriculaController');
const { verificarToken } = require('../middlewares/auth');

router.get('/', verificarToken, matriculaController.getAll);
router.get('/alumno/:alumnoId', verificarToken, matriculaController.getByAlumno);
router.get('/curso/:cursoId', verificarToken, matriculaController.getByCurso);
router.get('/:id', verificarToken, matriculaController.getById);
router.post('/', verificarToken, matriculaController.create);
router.put('/:id', verificarToken, matriculaController.update);
router.put('/:id/baja', verificarToken, matriculaController.darBaja);
router.delete('/:id', verificarToken, matriculaController.delete);

module.exports = router;