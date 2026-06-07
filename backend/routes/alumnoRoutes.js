const express = require('express');
const router = express.Router();
const alumnoController = require('../controllers/alumnoController');
const { verificarToken } = require('../middlewares/auth');

// Todas las rutas requieren autenticación, la lógica de filtrado por rol está en el controlador
router.get('/', verificarToken, alumnoController.getAll);
router.get('/search', verificarToken, alumnoController.search);
router.get('/:id', verificarToken, alumnoController.getById);
router.post('/', verificarToken, alumnoController.create);
router.put('/:id', verificarToken, alumnoController.update);
router.delete('/:id', verificarToken, alumnoController.delete);

module.exports = router;