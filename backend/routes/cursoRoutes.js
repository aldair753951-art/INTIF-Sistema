const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');
const { verificarToken } = require('../middlewares/auth');

router.get('/', verificarToken, cursoController.getAll);
router.get('/docente/:docenteId', verificarToken, cursoController.getByDocente);
router.get('/alumno/:alumnoId', verificarToken, cursoController.getByAlumno);
router.get('/:id', verificarToken, cursoController.getById);
router.post('/', verificarToken, cursoController.create);
router.put('/:id', verificarToken, cursoController.update);
router.delete('/:id', verificarToken, cursoController.delete);

module.exports = router;