const docenteDAO = require('../dao/docenteDAO');
const usuarioDAO = require('../dao/usuarioDAO');
const logger = require('../utils/logger'); // al inicio del archivo

class DocenteController {
    async getAll(req, res) {
        try {
            const docentes = await docenteDAO.getAll();
            res.json(docentes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const docente = await docenteDAO.getById(id);
            if (!docente) return res.status(404).json({ mensaje: 'Docente no encontrado' });
            res.json(docente);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
    try {
        const { nombre, dni, especialidad, telefono, email, usuario, contrasena } = req.body;

        if (!nombre || !dni || !usuario || !contrasena) {
            logger.warn(`Intento de crear docente sin datos completos`);
            return res.status(400).json({ mensaje: 'Faltan datos: nombre, dni, usuario y contraseña son obligatorios' });
        }
        if (dni.length !== 8) {
            logger.warn(`Intento de crear docente con DNI inválido: ${dni}`);
            return res.status(400).json({ mensaje: 'El DNI debe tener 8 dígitos' });
        }

        const nuevoUsuario = await usuarioDAO.create({
            usuario,
            contrasena,
            nombre,
            rol: 'docente'
        });
        logger.info(`Usuario creado para docente: ${usuario} (id: ${nuevoUsuario.id})`);

        const nuevoDocente = await docenteDAO.create({
            nombre,
            dni,
            especialidad: especialidad || null,
            telefono: telefono || null,
            email: email || null,
            usuario_id: nuevoUsuario.id,
            estado: 'Activo'
        });
        logger.info(`Docente creado: ${nombre} (id: ${nuevoDocente.id})`);

        res.status(201).json({ mensaje: 'Docente y usuario creados', docente: nuevoDocente });
    } catch (error) {
        logger.error(`Error al crear docente: ${error.message}`);
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre, dni, especialidad, telefono, email, estado } = req.body;
            const actualizado = await docenteDAO.update(id, { nombre, dni, especialidad, telefono, email, estado });
            res.json({ mensaje: 'Docente actualizado', docente: actualizado });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const docente = await docenteDAO.getById(id);
            if (!docente) return res.status(404).json({ mensaje: 'Docente no encontrado' });
            if (docente.usuario_id) await usuarioDAO.delete(docente.usuario_id);
            await docenteDAO.delete(id);
            res.json({ mensaje: 'Docente y usuario eliminados' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCursos(req, res) {
        try {
            const { id } = req.params; // id del docente (TBL_DOCENTE.id)
            const cursos = await docenteDAO.getCursos(id);
            res.json(cursos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new DocenteController();