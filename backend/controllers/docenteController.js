const docenteDAO = require('../dao/docenteDAO');

class DocenteController {

    async create(req, res) {
        try {
            const { nombre, dni, especialidad, telefono, email, usuario, contrasena } = req.body;

            // Validaciones
            if (!nombre || !dni) {
                return res.status(400).json({ mensaje: 'Nombre y DNI son obligatorios' });
            }
            if (!usuario || !contrasena) {
                return res.status(400).json({ mensaje: 'Usuario y contraseña son obligatorios para el docente' });
            }

            // 1. Crear el usuario en TBL_USUARIO (rol = 'docente')
            const nuevoUsuario = await usuarioDAO.create({
                usuario: usuario,
                contrasena: contrasena,
                nombre: nombre,
                rol: 'docente'
            });

            // 2. Crear el docente en TBL_DOCENTE con el mismo ID del usuario
            const nuevoDocente = await docenteDAO.create({
                id: nuevoUsuario.id,   // forzamos el mismo ID
                nombre: nombre,
                dni: dni,
                especialidad: especialidad,
                telefono: telefono,
                email: email,
                estado: 'Activo'
            });

            res.status(201).json({ mensaje: 'Docente y usuario creados correctamente', docente: nuevoDocente });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
    
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
            const { nombre, dni, especialidad, telefono, email } = req.body;
            if (!nombre || !dni) {
                return res.status(400).json({ mensaje: 'Nombre y DNI son obligatorios' });
            }
            if (dni.length !== 8) {
                return res.status(400).json({ mensaje: 'El DNI debe tener 8 dígitos' });
            }
            
            const existe = await docenteDAO.getByDni(dni);
            if (existe) return res.status(409).json({ mensaje: 'Ya existe un docente con ese DNI' });
            
            const nuevoDocente = await docenteDAO.create({ nombre, dni, especialidad, telefono, email });
            res.status(201).json({ mensaje: 'Docente registrado', docente: nuevoDocente });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const existe = await docenteDAO.getById(id);
            if (!existe) return res.status(404).json({ mensaje: 'Docente no encontrado' });
            
            const actualizado = await docenteDAO.update(id, req.body);
            res.json({ mensaje: 'Docente actualizado', docente: actualizado });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const existe = await docenteDAO.getById(id);
            if (!existe) return res.status(404).json({ mensaje: 'Docente no encontrado' });
            
            await docenteDAO.delete(id);
            res.json({ mensaje: 'Docente eliminado' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCursos(req, res) {
        try {
            const { id } = req.params;
            const cursos = await docenteDAO.getCursos(id);
            res.json(cursos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new DocenteController();