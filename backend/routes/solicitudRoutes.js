const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');
const { verificarToken } = require('../middlewares/auth');

router.post('/', verificarToken, solicitudController.create);
router.get('/docente', verificarToken, solicitudController.getByDocente);
router.get('/alumno', verificarToken, solicitudController.getByAlumno);
router.put('/:id', verificarToken, solicitudController.updateEstado);

module.exports = router;