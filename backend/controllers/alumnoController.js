const alumnoDAO = require('../dao/alumnoDAO');
const usuarioDAO = require('../dao/usuarioDAO');
const matriculaDAO = require('../dao/matriculaDAO');
const logger = require('../utils/logger');

class AlumnoController {
    async getAll(req, res) {
        try {
            const usuario = req.usuario;
            if (!usuario) return res.status(401).json({ mensaje: 'No autenticado' });

            if (usuario.rol === 'administrativo') {
                const alumnos = await alumnoDAO.getAll();
                return res.json(alumnos);
            } else if (usuario.rol === 'alumno') {
                const alumno = await alumnoDAO.getByUsuarioId(usuario.id);
                return res.json(alumno ? [alumno] : []);
            } else {
                return res.json([]);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    // Obtener un alumno por ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const alumno = await alumnoDAO.getById(id);
            if (!alumno) return res.status(404).json({ mensaje: 'Alumno no encontrado' });
            res.json(alumno);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Crear alumno (con usuario automático)
    async create(req, res) {
    try {
        const { nombre, dni, codigo, programa, usuario, contrasena, curso_id } = req.body;

        // Validaciones
        if (!nombre || !dni || !codigo || !usuario || !contrasena) {
            logger.warn(`Intento de crear alumno sin datos completos: faltan campos`);
            return res.status(400).json({ mensaje: 'Faltan datos: nombre, dni, código, usuario y contraseña son obligatorios' });
        }
        if (dni.length !== 8) {
            logger.warn(`Intento de crear alumno con DNI inválido: ${dni}`);
            return res.status(400).json({ mensaje: 'El DNI debe tener 8 dígitos' });
        }

        // 1. Crear usuario (rol = 'alumno')
        const nuevoUsuario = await usuarioDAO.create({
            usuario,
            contrasena,
            nombre,
            rol: 'alumno'
        });
        logger.info(`Usuario creado para alumno: ${usuario} (id: ${nuevoUsuario.id})`);

        // 2. Crear alumno vinculado al usuario_id
        const nuevoAlumno = await alumnoDAO.create({
            nombre,
            dni,
            codigo,
            programa: programa || null,
            usuario_id: nuevoUsuario.id
        });
        logger.info(`Alumno creado: ${nombre} (id: ${nuevoAlumno.id})`);

        // 3. (Opcional) Matricularlo en un curso si se envió curso_id
        if (curso_id) {
            await matriculaDAO.create({
                alumno_id: nuevoAlumno.id,
                curso_id: Number(curso_id),
                fecha: new Date().toISOString().split('T')[0],
                estado: 'Activo'
            });
            logger.info(`Alumno ${nombre} matriculado en curso ${curso_id}`);
        }

        res.status(201).json({ mensaje: 'Alumno y usuario creados', alumno: nuevoAlumno });
    } catch (error) {
        logger.error(`Error al crear alumno: ${error.message}`);
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

    // Actualizar alumno (solo datos personales, no usuario)
    async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre, dni, codigo, programa } = req.body;

            const existe = await alumnoDAO.getById(id);
            if (!existe) return res.status(404).json({ mensaje: 'Alumno no encontrado' });

            const actualizado = await alumnoDAO.update(id, { nombre, dni, codigo, programa });
            res.json({ mensaje: 'Alumno actualizado', alumno: actualizado });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Eliminar alumno (y su usuario asociado)
    async delete(req, res) {
        try {
            const { id } = req.params;
            const alumno = await alumnoDAO.getById(id);
            if (!alumno) return res.status(404).json({ mensaje: 'Alumno no encontrado' });

            // Eliminar el usuario asociado (si existe)
            if (alumno.usuario_id) {
                await usuarioDAO.delete(alumno.usuario_id);
            }
            // Eliminar el alumno (y sus matrículas/asistencias por cascada)
            await alumnoDAO.delete(id);

            res.json({ mensaje: 'Alumno y usuario eliminados' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Búsqueda de alumnos
    async search(req, res) {
        try {
            const { q } = req.query;
            if (!q) return res.json([]);
            const resultados = await alumnoDAO.search(q);
            res.json(resultados);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new AlumnoController();