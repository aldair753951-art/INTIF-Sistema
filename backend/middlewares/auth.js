const jwt = require('jsonwebtoken');

const SECRET_KEY = 'INTIF_SECRET_KEY_2026';

// Generar token JWT
const generarToken = (usuario) => {
    return jwt.sign(
        { 
            id: usuario.id, 
            usuario: usuario.usuario, 
            nombre: usuario.nombre, 
            rol: usuario.rol 
        }, 
        SECRET_KEY, 
        { expiresIn: '8h' }
    );
};

// Verificar token
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
    }
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
    }
};

// Verificar rol específico
const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ mensaje: 'No autenticado.' });
        }
        
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ 
                mensaje: `Acceso denegado. Rol ${req.usuario.rol} no tiene permiso.`,
                rolesPermitidos
            });
        }
        
        next();
    };
};

// Verificar que sea el mismo usuario o admin
const verificarMismoUsuario = (req, res, next) => {
    const { id } = req.params;
    if (req.usuario.rol === 'administrativo' || req.usuario.id == id) {
        next();
    } else {
        res.status(403).json({ mensaje: 'No tienes permiso para acceder a este recurso.' });
    }
};

module.exports = { generarToken, verificarToken, verificarRol, verificarMismoUsuario };