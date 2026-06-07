const express = require('express');
const router = express.Router();
const docenteController = require('../controllers/docenteController');
const { verificarToken } = require('../middlewares/auth');

router.get('/', verificarToken, docenteController.getAll);
router.get('/:id', verificarToken, docenteController.getById);
router.get('/:id/cursos', verificarToken, docenteController.getCursos);
router.post('/', verificarToken, docenteController.create);
router.put('/:id', verificarToken, docenteController.update);
router.delete('/:id', verificarToken, docenteController.delete);

module.exports = router;