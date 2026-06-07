const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken } = require('../middlewares/auth');

// Login es público (sin token)
router.post('/login', usuarioController.login);

// El resto requieren autenticación y solo deberían ser accesibles por administradores
router.get('/', verificarToken, usuarioController.getAll);
router.get('/:id', verificarToken, usuarioController.getById);
router.post('/', verificarToken, usuarioController.create);
router.put('/:id', verificarToken, usuarioController.update);
router.delete('/:id', verificarToken, usuarioController.delete);

module.exports = router;