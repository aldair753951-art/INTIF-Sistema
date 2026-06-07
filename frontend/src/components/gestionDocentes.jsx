import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function GestionDocentes() {
    const [docentes, setDocentes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modal, setModal] = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm] = useState({
        nombre: "",
        dni: "",
        especialidad: "",
        telefono: "",
        email: "",
        usuario: "",    // nuevo campo
        contrasena: ""  // nuevo campo
    });
    const [filtro, setFiltro] = useState("");
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const [cargandoAccion, setCargandoAccion] = useState(false);

    useEffect(() => {
        cargarDocentes();
    }, []);

    const cargarDocentes = async () => {
        try {
            const data = await api.getDocentes();
            setDocentes(data || []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setCargando(false);
        }
    };

    const setF = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

    const abrirModal = (docente = null) => {
        if (docente) {
            setEditando(docente);
            setForm({
                nombre: docente.nombre || "",
                dni: docente.dni || "",
                especialidad: docente.especialidad || "",
                telefono: docente.telefono || "",
                email: docente.email || "",
                usuario: "",      // no se edita el usuario
                contrasena: ""    // no se edita la contraseña
            });
        } else {
            setEditando(null);
            setForm({
                nombre: "",
                dni: "",
                especialidad: "",
                telefono: "",
                email: "",
                usuario: "",
                contrasena: ""
            });
        }
        setModal(true);
        setError("");
    };

    const guardar = async () => {
        setError("");
        setCargandoAccion(true);

        // Validaciones comunes
        if (!form.nombre || !form.dni) {
            setError("Nombre y DNI son obligatorios.");
            setCargandoAccion(false);
            return;
        }
        if (form.dni.length !== 8) {
            setError("El DNI debe tener 8 dígitos.");
            setCargandoAccion(false);
            return;
        }

        try {
            if (editando) {
                // Edición: solo actualiza datos del docente (no cambia usuario/contraseña)
                const dataToSend = {
                    nombre: form.nombre,
                    dni: form.dni,
                    especialidad: form.especialidad,
                    telefono: form.telefono,
                    email: form.email
                };
                await api.updateDocente(editando.id, dataToSend);
                setMsg("Docente actualizado");
            } else {
                // Creación: debe incluir usuario y contraseña
                if (!form.usuario || !form.contrasena) {
                    setError("Usuario y contraseña son obligatorios para el nuevo docente.");
                    setCargandoAccion(false);
                    return;
                }
                const dataToSend = {
                    nombre: form.nombre,
                    dni: form.dni,
                    especialidad: form.especialidad,
                    telefono: form.telefono,
                    email: form.email,
                    usuario: form.usuario,
                    contrasena: form.contrasena
                };
                await api.createDocente(dataToSend);
                setMsg("Docente registrado (usuario creado automáticamente)");
            }
            await cargarDocentes();
            setModal(false);
            setForm({
                nombre: "",
                dni: "",
                especialidad: "",
                telefono: "",
                email: "",
                usuario: "",
                contrasena: ""
            });
            setTimeout(() => setMsg(""), 3000);
        } catch (error) {
            setError("Error: " + (error.message || "Intente nuevamente"));
        } finally {
            setCargandoAccion(false);
        }
    };

    const eliminar = async (id) => {
        if (!window.confirm("¿Eliminar este docente? También se eliminará su usuario.")) return;
        try {
            await api.deleteDocente(id);
            await cargarDocentes();
            setMsg("Docente eliminado");
            setTimeout(() => setMsg(""), 3000);
        } catch (error) {
            setError("Error al eliminar: " + error.message);
        }
    };

    const docentesFiltrados = docentes.filter(d =>
        !filtro || d.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
        d.dni?.includes(filtro) || d.especialidad?.toLowerCase().includes(filtro.toLowerCase())
    );

    if (cargando) return <div style={{ padding: "2rem" }}>⏳ Cargando docentes...</div>;

    return (
        <div style={{ padding: "2rem" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 22, color: "#1e293b" }}>👨‍🏫 Gestión de Docentes</h2>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>{docentes.length} docentes registrados</p>
                </div>
                <button
                    onClick={() => abrirModal()}
                    style={{
                        background: "#7c3aed",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "bold"
                    }}
                >
                    + Nuevo docente
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
                placeholder="🔍 Buscar por nombre, especialidad o DNI..."
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

            {/* Tabla de docentes */}
            {docentesFiltrados.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "2rem",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    color: "#64748b"
                }}>
                    No hay docentes registrados.
                </div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "12px", overflow: "hidden", fontSize: "13px" }}>
                        <thead>
                            <tr style={{ background: "#7c3aed", color: "white" }}>
                                <th style={{ padding: "10px", textAlign: "left" }}>Nombre</th>
                                <th style={{ padding: "10px", textAlign: "left" }}>DNI</th>
                                <th style={{ padding: "10px", textAlign: "left" }}>Especialidad</th>
                                <th style={{ padding: "10px", textAlign: "left" }}>Teléfono</th>
                                <th style={{ padding: "10px", textAlign: "left" }}>Email</th>
                                <th style={{ padding: "10px", textAlign: "left" }}>Estado</th>
                                <th style={{ padding: "10px", textAlign: "center" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {docentesFiltrados.map((d, index) => (
                                <tr key={d.id} style={{ borderBottom: "1px solid #e2e8f0", background: index % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                    <td style={{ padding: "10px", fontWeight: 500 }}>{d.nombre}</td>
                                    <td style={{ padding: "10px", fontFamily: "monospace" }}>{d.dni}</td>
                                    <td style={{ padding: "10px" }}>{d.especialidad || "—"}</td>
                                    <td style={{ padding: "10px" }}>{d.telefono || "—"}</td>
                                    <td style={{ padding: "10px", color: "#0284c7" }}>{d.email || "—"}</td>
                                    <td style={{ padding: "10px" }}>
                                        <span style={{
                                            background: d.estado === "Activo" ? "#dcfce7" : "#fee2e2",
                                            color: d.estado === "Activo" ? "#16a34a" : "#dc2626",
                                            padding: "2px 8px",
                                            borderRadius: "12px",
                                            fontSize: "11px"
                                        }}>
                                            {d.estado || "Activo"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "10px", textAlign: "center" }}>
                                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                                            <button
                                                onClick={() => abrirModal(d)}
                                                style={{
                                                    padding: "4px 10px",
                                                    border: "1px solid #7c3aed",
                                                    background: "transparent",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                    color: "#7c3aed",
                                                    fontSize: "11px"
                                                }}
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                onClick={() => eliminar(d.id)}
                                                style={{
                                                    padding: "4px 10px",
                                                    border: "1px solid #dc2626",
                                                    background: "transparent",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                    color: "#dc2626",
                                                    fontSize: "11px"
                                                }}
                                            >
                                                🗑 Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal para crear/editar docente */}
            {modal && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    zIndex: 1000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <div style={{
                        background: "#fff",
                        borderRadius: "16px",
                        padding: "1.5rem",
                        width: "90%",
                        maxWidth: "450px"
                    }}>
                        <h3 style={{ margin: "0 0 1rem 0", fontSize: "18px" }}>
                            {editando ? "✏️ Editar docente" : "👨‍🏫 Nuevo docente"}
                        </h3>

                        <input
                            type="text"
                            placeholder="Nombre completo *"
                            value={form.nombre}
                            onChange={setF("nombre")}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                marginBottom: "0.8rem",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                boxSizing: "border-box",
                                fontSize: "13px"
                            }}
                        />

                        <input
                            type="text"
                            placeholder="DNI (8 dígitos) *"
                            value={form.dni}
                            onChange={setF("dni")}
                            maxLength="8"
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                marginBottom: "0.8rem",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                boxSizing: "border-box",
                                fontSize: "13px"
                            }}
                        />

                        <input
                            type="text"
                            placeholder="Especialidad"
                            value={form.especialidad}
                            onChange={setF("especialidad")}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                marginBottom: "0.8rem",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                boxSizing: "border-box",
                                fontSize: "13px"
                            }}
                        />

                        <input
                            type="text"
                            placeholder="Teléfono"
                            value={form.telefono}
                            onChange={setF("telefono")}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                marginBottom: "0.8rem",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                boxSizing: "border-box",
                                fontSize: "13px"
                            }}
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={setF("email")}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                marginBottom: "0.8rem",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                boxSizing: "border-box",
                                fontSize: "13px"
                            }}
                        />

                        {/* Campos solo para creación */}
                        {!editando && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Usuario * (para iniciar sesión)"
                                    value={form.usuario}
                                    onChange={setF("usuario")}
                                    style={{
                                        width: "100%",
                                        padding: "8px 12px",
                                        marginBottom: "0.8rem",
                                        border: "1px solid #ccc",
                                        borderRadius: "8px",
                                        boxSizing: "border-box",
                                        fontSize: "13px"
                                    }}
                                />
                                <input
                                    type="password"
                                    placeholder="Contraseña *"
                                    value={form.contrasena}
                                    onChange={setF("contrasena")}
                                    style={{
                                        width: "100%",
                                        padding: "8px 12px",
                                        marginBottom: "0.8rem",
                                        border: "1px solid #ccc",
                                        borderRadius: "8px",
                                        boxSizing: "border-box",
                                        fontSize: "13px"
                                    }}
                                />
                            </>
                        )}

                        {error && (
                            <div style={{ color: "red", fontSize: "11px", marginBottom: "0.8rem" }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                            <button
                                onClick={() => {
                                    setModal(false);
                                    setError("");
                                }}
                                style={{
                                    padding: "8px 16px",
                                    background: "#f1f5f9",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "13px"
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={guardar}
                                disabled={cargandoAccion}
                                style={{
                                    padding: "8px 16px",
                                    background: "#7c3aed",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                    opacity: cargandoAccion ? 0.5 : 1
                                }}
                            >
                                {cargandoAccion ? "Guardando..." : (editando ? "Actualizar" : "Registrar")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}