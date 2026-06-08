import React, { useState } from 'react';
import { Card, Badge, Btn } from './index';
import { api } from '../services/api';

const Modal = ({ title, children, onClose }) => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "2rem", minWidth: 380, maxWidth: 520, width: "90%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: 0, fontSize: 18, color: "#1e293b" }}>{title}</h3>
                <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 22, cursor: "pointer" }}>×</button>
            </div>
            {children}
        </div>
    </div>
);

const Input = ({ label, value, onChange, type = "text", placeholder = "" }) => (
    <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{label}</label>
        <input 
            type={type} 
            value={value || ''} 
            onChange={onChange} 
            placeholder={placeholder} 
            style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14 }} 
        />
    </div>
);

export default function GestionAlumnos({ alumnos, setAlumnos }) {
    const [modal, setModal] = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm] = useState({ nombre: "", dni: "", codigo: "", usuario: "", contrasena: "" });
    const [filtro, setFiltro] = useState("");
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const [cargando, setCargando] = useState(false);

    const setF = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

    const abrirModal = (alumno = null) => {
        if (alumno) {
            setEditando(alumno);
            setForm({
                nombre: alumno.nombre || "",
                dni: alumno.dni || "",
                codigo: alumno.codigo || "",
                usuario: "",
                contrasena: ""
            });
        } else {
            setEditando(null);
            setForm({ nombre: "", dni: "", codigo: "", usuario: "", contrasena: "" });
        }
        setModal(true);
        setError("");
    };

    const guardar = async () => {
        setError("");
        setCargando(true);

        if (!form.nombre || !form.dni || !form.codigo) {
            setError("Nombre, DNI y código son obligatorios.");
            setCargando(false);
            return;
        }
        if (form.dni.length !== 8) {
            setError("El DNI debe tener 8 dígitos.");
            setCargando(false);
            return;
        }

        try {
            if (editando) {
                await api.updateAlumno(editando.id, {
                    nombre: form.nombre,
                    dni: form.dni,
                    codigo: form.codigo
                });
                setMsg("Alumno actualizado");
            } else {
                if (!form.usuario || !form.contrasena) {
                    setError("Usuario y contraseña son obligatorios para el nuevo alumno.");
                    setCargando(false);
                    return;
                }
                await api.createAlumno({
                    nombre: form.nombre,
                    dni: form.dni,
                    codigo: form.codigo,
                    usuario: form.usuario,
                    contrasena: form.contrasena
                });
                setMsg("Alumno registrado (usuario creado automáticamente)");
            }
            const nuevosAlumnos = await api.getAlumnos();
            setAlumnos(nuevosAlumnos);
            setModal(false);
            setForm({ nombre: "", dni: "", codigo: "", usuario: "", contrasena: "" });
            setTimeout(() => setMsg(""), 4000);
        } catch (error) {
            console.error("Error en guardar:", error);
            setError("Error: " + (error.message || "Ocurrió un error"));
        } finally {
            setCargando(false);
        }
    };

    const eliminar = async (id) => {
        if (!window.confirm("¿Eliminar este alumno? También se eliminarán sus matrículas.")) return;
        try {
            await api.deleteAlumno(id);
            const nuevosAlumnos = await api.getAlumnos();
            setAlumnos(nuevosAlumnos);
            setMsg("Alumno eliminado");
            setTimeout(() => setMsg(""), 3000);
        } catch (error) {
            console.error("Error al eliminar:", error);
            setError("Error al eliminar: " + error.message);
        }
    };

    const alumnosFiltrados = Array.isArray(alumnos) ? alumnos.filter(a =>
        !filtro || a.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
        a.codigo?.includes(filtro) || a.dni?.includes(filtro)
    ) : [];

    return (
        <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 22, color: "#1e293b" }}>Gestión de Alumnos</h2>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>{alumnos?.length || 0} alumnos registrados</p>
                </div>
                <Btn onClick={() => abrirModal()} color="#0284c7">+ Nuevo alumno</Btn>
            </div>

            {msg && <div style={{ background: "#dcfce7", color: "#16a34a", padding: "10px 14px", borderRadius: 8, marginBottom: "1rem" }}>✓ {msg}</div>}

            <Card style={{ marginBottom: "1rem" }}>
                <input 
                    value={filtro} 
                    onChange={e => setFiltro(e.target.value)} 
                    placeholder="Buscar por nombre, código o DNI..." 
                    style={{ width: "100%", padding: "9px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14 }} 
                />
            </Card>

            <Card>
                {alumnosFiltrados.length === 0 ? (
                    <p style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>No hay alumnos registrados.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "12px", overflow: "hidden", fontSize: "13px" }}>
                            <thead>
                                <tr style={{ background: "#0f766e", color: "white" }}>
                                    <th style={{ padding: "12px", textAlign: "left" }}>Código</th>
                                    <th style={{ padding: "12px", textAlign: "left" }}>Nombre</th>
                                    <th style={{ padding: "12px", textAlign: "left" }}>DNI</th>
                                    <th style={{ padding: "12px", textAlign: "left" }}>Estado</th>
                                    <th style={{ padding: "12px", textAlign: "center" }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alumnosFiltrados.map((a, index) => (
                                    <tr key={a.id} style={{
                                        background: index % 2 === 0 ? "#fff" : "#f8fafc",
                                        borderBottom: "1px solid #e2e8f0",
                                        transition: "background 0.15s"
                                    }} onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"} onMouseLeave={e => e.currentTarget.style.background = index % 2 === 0 ? "#fff" : "#f8fafc"}>
                                        <td style={{ padding: "12px", fontFamily: "monospace" }}>{a.codigo}</td>
                                        <td style={{ padding: "12px", fontWeight: 500 }}>{a.nombre}</td>
                                        <td style={{ padding: "12px", color: "#64748b" }}>{a.dni}</td>
                                        <td style={{ padding: "12px" }}><Badge estado="Activo" /></td>
                                        <td style={{ padding: "12px", textAlign: "center" }}>
                                            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                                <Btn onClick={() => abrirModal(a)} small color="#0f766e" outline>✏️ Editar</Btn>
                                                <Btn onClick={() => eliminar(a.id)} small color="#dc2626" outline>🗑 Eliminar</Btn>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {modal && (
                <Modal title={editando ? "Editar alumno" : "Registrar nuevo alumno"} onClose={() => { setModal(false); setError(""); }}>
                    <Input label="Nombre completo *" value={form.nombre} onChange={setF("nombre")} />
                    <Input label="DNI (8 dígitos) *" value={form.dni} onChange={setF("dni")} />
                    <Input label="Código de alumno *" value={form.codigo} onChange={setF("codigo")} />

                    {!editando && (
                        <>
                            <Input label="Usuario *" value={form.usuario} onChange={setF("usuario")} />
                            <Input label="Contraseña *" value={form.contrasena} onChange={setF("contrasena")} type="password" />
                        </>
                    )}

                    {error && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "8px 12px", borderRadius: 8, fontSize: 12, marginBottom: "1rem" }}>{error}</div>}

                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                        <Btn onClick={() => { setModal(false); setError(""); }} outline color="#64748b">Cancelar</Btn>
                        <Btn onClick={guardar} color="#0284c7" disabled={cargando}>
                            {cargando ? "Guardando..." : (editando ? "Actualizar" : "Registrar")}
                        </Btn>
                    </div>
                </Modal>
            )}
        </div>
    );
}