const { getConnection, sql } = require('../config/database');

class UsuarioDAO {
    async create(data) {
    const { usuario, contrasena, nombre, rol } = data;
    const pool = await getConnection();
    const result = await pool.request()
        .input('usuario', sql.VarChar, usuario)
        .input('contrasena', sql.VarChar, contrasena)
        .input('nombre', sql.VarChar, nombre)
        .input('rol', sql.VarChar, rol)
        .input('estado', sql.VarChar, 'Activo')
        .query(`
            INSERT INTO TBL_USUARIO (usuario, contrasena, nombre, rol, estado)
            VALUES (@usuario, @contrasena, @nombre, @rol, @estado);
            SELECT SCOPE_IDENTITY() AS id;
        `);
    return { id: result.recordset[0].id, usuario, nombre, rol };
}

    // Obtener todos los usuarios
    async getAll() {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT id, usuario, nombre, rol, estado
            FROM TBL_USUARIO 
            ORDER BY nombre
        `);
        return result.recordset;
    }

    // Obtener usuario por ID
    async getById(id) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT id, usuario, nombre, rol, estado
                FROM TBL_USUARIO WHERE id = @id
            `);
        return result.recordset[0];
    }

    // Obtener usuario por nombre de usuario
    async getByUsuario(usuario) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('usuario', sql.VarChar, usuario)
            .query(`
                SELECT id, usuario, nombre, rol, estado
                FROM TBL_USUARIO WHERE usuario = @usuario
            `);
        return result.recordset[0];
    }

    // Login - autenticar usuario
    async login(usuario, contrasena, rol) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('usuario', sql.VarChar, usuario)
            .input('contrasena', sql.VarChar, contrasena)
            .input('rol', sql.VarChar, rol)
            .query(`
                SELECT id, usuario, nombre, rol
                FROM TBL_USUARIO 
                WHERE usuario = @usuario 
                  AND contrasena = @contrasena 
                  AND rol = @rol
                  AND estado = 'Activo'
            `);
        return result.recordset[0];
    }

    // Crear usuario
    async create(data) {
    const { usuario, contrasena, nombre, rol } = data;
    const pool = await getConnection();
    const result = await pool.request()
        .input('usuario', sql.VarChar, usuario)
        .input('contrasena', sql.VarChar, contrasena)
        .input('nombre', sql.VarChar, nombre)
        .input('rol', sql.VarChar, rol)
        .input('estado', sql.VarChar, 'Activo')
        .query(`
            INSERT INTO TBL_USUARIO (usuario, contrasena, nombre, rol, estado)
            VALUES (@usuario, @contrasena, @nombre, @rol, @estado);
            SELECT SCOPE_IDENTITY() AS id;
        `);
    return { id: result.recordset[0].id, usuario, nombre, rol };
}

    // Actualizar usuario
    async update(id, data) {
    const { usuario, nombre, rol, estado } = data;
    const pool = await getConnection();
    await pool.request()
        .input('id', sql.Int, id)
        .input('usuario', sql.VarChar, usuario)
        .input('nombre', sql.VarChar, nombre)
        .input('rol', sql.VarChar, rol)
        .input('estado', sql.VarChar, estado || 'Activo')
        .query(`
            UPDATE TBL_USUARIO
            SET usuario = @usuario, nombre = @nombre, rol = @rol, estado = @estado
            WHERE id = @id
        `);
    return { id, usuario, nombre, rol, estado };
}

    // Cambiar contraseña
    async cambiarPassword(id, nuevaContrasena) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('contrasena', sql.VarChar, nuevaContrasena)
            .query(`
                UPDATE TBL_USUARIO 
                SET contrasena = @contrasena
                WHERE id = @id
            `);
        return { success: true };
    }

    // Eliminar usuario (soft delete)
    async delete(id) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query("UPDATE TBL_USUARIO SET estado = 'Inactivo' WHERE id = @id");
        return { success: true };
    }

    // Eliminar usuario físicamente
    async deleteHard(id) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM TBL_USUARIO WHERE id = @id");
        return { success: true };
    }

    // Obtener usuarios por rol
    async getByRol(rol) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('rol', sql.VarChar, rol)
            .query(`
                SELECT id, usuario, nombre, estado
                FROM TBL_USUARIO 
                WHERE rol = @rol AND estado = 'Activo'
                ORDER BY nombre
            `);
        return result.recordset;
    }
}

module.exports = new UsuarioDAO();