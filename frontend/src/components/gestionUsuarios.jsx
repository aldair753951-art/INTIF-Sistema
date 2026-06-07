import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modal, setModal] = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm] = useState({ usuario: "", contrasena: "", nombre: "", rol: "docente" });
    const [filtro, setFiltro] = useState("");
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const [cargandoAccion, setCargandoAccion] = useState(false);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const data = await api.getUsuarios();
            setUsuarios(data || []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setCargando(false);
        }
    };

    const setF = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

    const abrirModal = (usuario = null) => {
        if (usuario) {
            setEditando(usuario);
            setForm({
                usuario: usuario.usuario || "",
                contrasena: "",
                nombre: usuario.nombre || "",
                rol: usuario.rol || "docente"
            });
        } else {
            setEditando(null);
            setForm({ usuario: "", contrasena: "", nombre: "", rol: "docente" });
        }
        setModal(true);
        setError("");
    };

    const guardar = async () => {
        setError("");
        setCargandoAccion(true);
        
        if (!form.usuario || !form.nombre || !form.rol) {
            setError("Usuario, nombre y rol son obligatorios.");
            setCargandoAccion(false);
            return;
        }
        if (!editando && !form.contrasena) {
            setError("Contraseña es obligatoria para nuevos usuarios.");
            setCargandoAccion(false);
            return;
        }

        try {
            if (editando) {
                const dataToUpdate = { usuario: form.usuario, nombre: form.nombre, rol: form.rol };
                if (form.contrasena) dataToUpdate.contrasena = form.contrasena;
                await api.updateUsuario(editando.id, dataToUpdate);
                setMsg("Usuario actualizado");
            } else {
                await api.createUsuario({ usuario: form.usuario, contrasena: form.contrasena, nombre: form.nombre, rol: form.rol });
                setMsg("Usuario creado");
            }
            await cargarUsuarios();
            setModal(false);
            setForm({ usuario: "", contrasena: "", nombre: "", rol: "docente" });
            setTimeout(() => setMsg(""), 3000);
        } catch (error) {
            setError("Error: " + error.message);
        } finally {
            setCargandoAccion(false);
        }
    };

    const eliminar = async (id) => {
        if (!window.confirm("¿Eliminar este usuario?")) return;
        try {
            await api.deleteUsuario(id);
            await cargarUsuarios();
            setMsg("Usuario eliminado");
            setTimeout(() => setMsg(""), 3000);
        } catch (error) {
            setError("Error: " + error.message);
        }
    };

    const getRolInfo = (rol) => {
        const roles = {
            docente: { nombre: "Docente", color: "#7c3aed", bg: "#ede9fe" },
            administrativo: { nombre: "Administrador", color: "#0f766e", bg: "#ccfbf1" },
            alumno: { nombre: "Alumno", color: "#b45309", bg: "#ffedd5" }
        };
        return roles[rol] || { nombre: rol, color: "#64748b", bg: "#f1f5f9" };
    };

    const usuariosFiltrados = usuarios.filter(u =>
        !filtro || u.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
        u.usuario?.toLowerCase().includes(filtro.toLowerCase())
    );

    if (cargando) return <div style={{ padding: "2rem" }}>⏳ Cargando usuarios...</div>;

    return (
        <div style={{ padding: "2rem" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 22, color: "#1e293b" }}>👥 Gestión de Usuarios</h2>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>{usuarios.length} usuarios registrados</p>
                </div>
                <button
                    onClick={() => abrirModal()}
                    style={{
                        background: "#0f766e",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "bold"
                    }}
                >
                    + Nuevo usuario
                </button>
            </div>

            {/* Mensajes */}
            {msg && (
                <div style={{
                    background: "#dcfce7",
                    color: "#16a34a",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                    fontSize: "13px"
                }}>
                    ✓ {msg}
                </div>
            )}

            {/* Buscador */}
            <input
                type="text"
                placeholder="🔍 Buscar por nombre o usuario..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "13px",
                    marginBottom: "1rem",
                    boxSizing: "border-box"
                }}
            />

            {/* Tabla de usuarios */}
            {usuariosFiltrados.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", background: "#f8fafc", borderRadius: "12px", color: "#64748b" }}>
                    No hay usuarios registrados.
                </div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "12px", overflow: "hidden", fontSize: "13px" }}>
                        <thead>
                            <tr style={{ background: "#0f766e", color: "white" }}>
                                <th style={{ padding: "10px", textAlign: "left" }}>Usuario</th>
                                <th style={{ padding: "10px", textAlign: "left" }}>Nombre</th>
                                <th style={{ padding: "10px", textAlign: "left" }}>Rol</th>
                                <th style={{ padding: "10px", textAlign: "left" }}>Estado</th>
                                <th style={{ padding: "10px", textAlign: "center" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.map((user, index) => {
                                const rolInfo = getRolInfo(user.rol);
                                return (
                                    <tr key={user.id} style={{ borderBottom: "1px solid #e2e8f0", background: index % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                        <td style={{ padding: "10px", fontWeight: 500 }}>{user.usuario}</td>
                                        <td style={{ padding: "10px" }}>{user.nombre}</td>
                                        <td style={{ padding: "10px" }}>
                                            <span style={{ background: rolInfo.bg, color: rolInfo.color, padding: "2px 8px", borderRadius: "12px", fontSize: "11px" }}>
                                                {rolInfo.nombre}
                                            </span>
                                        </td>
                                        <td style={{ padding: "10px" }}>
                                            <span style={{ background: user.estado === "Activo" ? "#dcfce7" : "#fee2e2", color: user.estado === "Activo" ? "#16a34a" : "#dc2626", padding: "2px 8px", borderRadius: "12px", fontSize: "11px" }}>
                                                {user.estado || "Activo"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "10px", textAlign: "center" }}>
                                            <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                                                <button onClick={() => abrirModal(user)} style={{ padding: "4px 10px", border: "1px solid #0f766e", background: "transparent", borderRadius: "6px", cursor: "pointer", color: "#0f766e", fontSize: "11px" }}>✏️ Editar</button>
                                                <button onClick={() => eliminar(user.id)} style={{ padding: "4px 10px", border: "1px solid #dc2626", background: "transparent", borderRadius: "6px", cursor: "pointer", color: "#dc2626", fontSize: "11px" }}>🗑 Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {modal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", width: "90%", maxWidth: "450px" }}>
                        <h3 style={{ margin: "0 0 1rem 0", fontSize: "18px" }}>{editando ? "✏️ Editar usuario" : "👤 Nuevo usuario"}</h3>
                        <input type="text" placeholder="Usuario *" value={form.usuario} onChange={setF("usuario")} style={{ width: "100%", padding: "8px 12px", marginBottom: "0.8rem", border: "1px solid #ccc", borderRadius: "8px", fontSize: "13px", boxSizing: "border-box" }} />
                        <input type={editando ? "text" : "password"} placeholder={editando ? "Nueva contraseña (opcional)" : "Contraseña *"} value={form.contrasena} onChange={setF("contrasena")} style={{ width: "100%", padding: "8px 12px", marginBottom: "0.8rem", border: "1px solid #ccc", borderRadius: "8px", fontSize: "13px", boxSizing: "border-box" }} />
                        <input type="text" placeholder="Nombre completo *" value={form.nombre} onChange={setF("nombre")} style={{ width: "100%", padding: "8px 12px", marginBottom: "0.8rem", border: "1px solid #ccc", borderRadius: "8px", fontSize: "13px", boxSizing: "border-box" }} />
                        <select value={form.rol} onChange={setF("rol")} style={{ width: "100%", padding: "8px 12px", marginBottom: "0.8rem", border: "1px solid #ccc", borderRadius: "8px", fontSize: "13px", boxSizing: "border-box" }}>
                            <option value="docente">👨‍🏫 Docente</option>
                            <option value="administrativo">👩‍💼 Administrativo</option>
                            <option value="alumno">👩‍🎓 Alumno</option>
                        </select>
                        {error && <div style={{ color: "red", fontSize: "11px", marginBottom: "0.8rem" }}>{error}</div>}
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button onClick={() => setModal(false)} style={{ padding: "8px 16px", background: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>Cancelar</button>
                            <button onClick={guardar} disabled={cargandoAccion} style={{ padding: "8px 16px", background: "#0f766e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", opacity: cargandoAccion ? 0.5 : 1 }}>{cargandoAccion ? "Guardando..." : (editando ? "Actualizar" : "Crear")}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}