const usuarioDAO = require('../dao/usuarioDAO');
const { generarToken } = require('../middlewares/auth');

class UsuarioController {
    async getAll(req, res) {
        try {
            const usuarios = await usuarioDAO.getAll();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const usuario = await usuarioDAO.getById(id);
            if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const { usuario, contrasena, nombre, rol } = req.body;
            if (!usuario || !contrasena || !nombre || !rol) {
                return res.status(400).json({ mensaje: 'Faltan datos: usuario, contraseña, nombre y rol son obligatorios' });
            }
            const nuevoUsuario = await usuarioDAO.create({ usuario, contrasena, nombre, rol });
            res.status(201).json({ mensaje: 'Usuario creado', usuario: nuevoUsuario });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { usuario, nombre, rol, estado } = req.body;
            const actualizado = await usuarioDAO.update(id, { usuario, nombre, rol, estado });
            res.json({ mensaje: 'Usuario actualizado', usuario: actualizado });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await usuarioDAO.delete(id);
            res.json({ mensaje: 'Usuario eliminado' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { usuario, contrasena, rol } = req.body;
            if (!usuario || !contrasena || !rol) {
                return res.status(400).json({ mensaje: 'Usuario, contraseña y rol son obligatorios' });
            }
            const user = await usuarioDAO.login(usuario, contrasena, rol);
            if (!user) {
                return res.status(401).json({ mensaje: 'Credenciales inválidas' });
            }
            const token = generarToken(user);
            res.json({ mensaje: 'Login exitoso', token, usuario: user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async cambiarPassword(req, res) {
        try {
            const { id } = req.params;
            const { nuevaContrasena } = req.body;
            if (!nuevaContrasena) {
                return res.status(400).json({ mensaje: 'Nueva contraseña requerida' });
            }
            await usuarioDAO.cambiarPassword(id, nuevaContrasena);
            res.json({ mensaje: 'Contraseña actualizada' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new UsuarioController();