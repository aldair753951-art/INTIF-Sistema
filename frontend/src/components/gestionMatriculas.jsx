import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function GestionMatriculas() {
    const [matriculas, setMatriculas] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modal, setModal] = useState(false);
    const [editando, setEditando] = useState(null);
    const [alumnoSel, setAlumnoSel] = useState("");
    const [cursoSel, setCursoSel] = useState("");
    const [filtro, setFiltro] = useState("");
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const [cargandoAccion, setCargandoAccion] = useState(false);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [matriculasData, alumnosData, cursosData] = await Promise.all([
                api.getMatriculas(),
                api.getAlumnos(),
                api.getCursos()
            ]);
            setMatriculas(matriculasData || []);
            setAlumnos(alumnosData || []);
            setCursos(cursosData || []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setCargando(false);
        }
    };

    const abrirModalNuevo = () => {
        setEditando(null);
        setAlumnoSel("");
        setCursoSel("");
        setModal(true);
        setError("");
    };

    const abrirModalDarBaja = (matricula) => {
        setEditando(matricula);
        setAlumnoSel(matricula.alumno_id.toString());
        setCursoSel(matricula.curso_id.toString());
        setModal(true);
        setError("");
    };

    const guardar = async () => {
        setError("");
        setCargandoAccion(true);
        
        if (editando) {
            try {
                await api.darBajaMatricula(editando.id);
                await cargarDatos();
                setMsg("✅ Matrícula dada de baja");
                setModal(false);
                setTimeout(() => setMsg(""), 3000);
            } catch (error) {
                setError("Error: " + error.message);
            }
        } else {
            if (!alumnoSel || !cursoSel) {
                setError("Selecciona alumno y curso");
                setCargandoAccion(false);
                return;
            }
            try {
                await api.createMatricula({
                    alumno_id: Number(alumnoSel),
                    curso_id: Number(cursoSel)
                });
                await cargarDatos();
                setMsg("✅ Matrícula registrada");
                setModal(false);
                setAlumnoSel("");
                setCursoSel("");
                setTimeout(() => setMsg(""), 3000);
            } catch (error) {
                setError("Error: " + error.message);
            }
        }
        setCargandoAccion(false);
    };

    const eliminar = async (id) => {
        if (!window.confirm("¿Eliminar permanentemente esta matrícula?")) return;
        try {
            await api.deleteMatricula(id);
            await cargarDatos();
            setMsg("🗑 Matrícula eliminada");
            setTimeout(() => setMsg(""), 3000);
        } catch (error) {
            setError("Error: " + error.message);
        }
    };

    const matriculasFiltradas = matriculas.filter(m => {
        const alumno = alumnos.find(a => a.id === m.alumno_id);
        const curso = cursos.find(c => c.id === m.curso_id);
        return !filtro || alumno?.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
               curso?.nombre?.toLowerCase().includes(filtro.toLowerCase());
    });

    if (cargando) return <div style={{ padding: "2rem" }}>⏳ Cargando matrículas...</div>;

    return (
        <div style={{ padding: "2rem" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 22, color: "#1e293b" }}>📋 Gestión de Matrículas</h2>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>{matriculas.length} matrículas registradas</p>
                </div>
                <button
                    onClick={abrirModalNuevo}
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
                    + Nueva matrícula
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
                    {msg}
                </div>
            )}

            {/* Buscador */}
            <input
                type="text"
                placeholder="🔍 Buscar por alumno o curso..."
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

            {/* Tabla de matrículas */}
            {matriculasFiltradas.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "2rem",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    color: "#64748b"
                }}>
                    No hay matrículas registradas.
                </div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "12px", overflow: "hidden", fontSize: "13px" }}>
                        <thead>
                            <tr style={{ background: "#0f766e", color: "white" }}>
                                <th style={{ padding: "10px", textAlign: "left" }}>Alumno</th>
                                <th style={{ padding: "10px", textAlign: "left" }}>Código</th>
                                <th style={{ padding: "10px", textAlign: "left" }}>Curso</th>
                                <th style={{ padding: "10px", textAlign: "left" }}>Fecha</th>
                                <th style={{ padding: "10px", textAlign: "left" }}>Estado</th>
                                <th style={{ padding: "10px", textAlign: "center" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matriculasFiltradas.map((m, index) => {
                                const alumno = alumnos.find(a => a.id === m.alumno_id);
                                const curso = cursos.find(c => c.id === m.curso_id);
                                return (
                                    <tr key={m.id} style={{ borderBottom: "1px solid #e2e8f0", background: index % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                        <td style={{ padding: "10px", fontWeight: 500 }}>{alumno?.nombre || "—"}</td>
                                        <td style={{ padding: "10px", fontFamily: "monospace" }}>{alumno?.codigo || "—"}</td>
                                        <td style={{ padding: "10px" }}>{curso?.nombre || "—"}</td>
                                        <td style={{ padding: "10px" }}>{m.fecha}</td>
                                        <td style={{ padding: "10px" }}>
                                            <span style={{
                                                background: m.estado === "Activo" ? "#dcfce7" : "#fee2e2",
                                                color: m.estado === "Activo" ? "#16a34a" : "#dc2626",
                                                padding: "2px 8px",
                                                borderRadius: "12px",
                                                fontSize: "11px"
                                            }}>
                                                {m.estado || "Activo"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "10px", textAlign: "center" }}>
                                            <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                                                {m.estado === "Activo" && (
                                                    <button
                                                        onClick={() => abrirModalDarBaja(m)}
                                                        style={{
                                                            padding: "4px 10px",
                                                            border: "1px solid #d97706",
                                                            background: "transparent",
                                                            borderRadius: "6px",
                                                            cursor: "pointer",
                                                            color: "#d97706",
                                                            fontSize: "11px"
                                                        }}
                                                    >
                                                        📝 Dar Baja
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => eliminar(m.id)}
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
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
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
                        {editando ? (
                            <>
                                <h3 style={{ margin: "0 0 1rem 0", fontSize: "18px", color: "#d97706" }}>⚠️ Dar de baja matrícula</h3>
                                <p style={{ fontSize: "13px" }}>¿Estás seguro de que deseas dar de baja esta matrícula?</p>
                                <div style={{
                                    background: "#f8fafc",
                                    padding: "0.8rem",
                                    borderRadius: "8px",
                                    marginBottom: "1rem",
                                    fontSize: "13px"
                                }}>
                                    <div><strong>Alumno:</strong> {alumnos.find(a => a.id === editando.alumno_id)?.nombre}</div>
                                    <div><strong>Curso:</strong> {cursos.find(c => c.id === editando.curso_id)?.nombre}</div>
                                    <div><strong>Fecha:</strong> {editando.fecha}</div>
                                </div>
                                {error && <div style={{ color: "red", fontSize: "11px", marginBottom: "0.8rem" }}>{error}</div>}
                                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                    <button onClick={() => setModal(false)} style={{ padding: "8px 16px", background: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>Cancelar</button>
                                    <button onClick={guardar} disabled={cargandoAccion} style={{ padding: "8px 16px", background: "#d97706", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", opacity: cargandoAccion ? 0.5 : 1 }}>{cargandoAccion ? "Procesando..." : "Confirmar Baja"}</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 style={{ margin: "0 0 1rem 0", fontSize: "18px" }}>📝 Nueva Matrícula</h3>
                                <select value={alumnoSel} onChange={e => setAlumnoSel(e.target.value)} style={{ width: "100%", padding: "8px 12px", marginBottom: "0.8rem", border: "1px solid #ccc", borderRadius: "8px", fontSize: "13px", boxSizing: "border-box" }}>
                                    <option value="">-- Seleccionar alumno --</option>
                                    {alumnos.map(a => <option key={a.id} value={a.id}>{a.nombre} ({a.codigo})</option>)}
                                </select>
                                <select value={cursoSel} onChange={e => setCursoSel(e.target.value)} style={{ width: "100%", padding: "8px 12px", marginBottom: "0.8rem", border: "1px solid #ccc", borderRadius: "8px", fontSize: "13px", boxSizing: "border-box" }}>
                                    <option value="">-- Seleccionar curso --</option>
                                    {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                                {error && <div style={{ color: "red", fontSize: "11px", marginBottom: "0.8rem" }}>{error}</div>}
                                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                    <button onClick={() => setModal(false)} style={{ padding: "8px 16px", background: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>Cancelar</button>
                                    <button onClick={guardar} disabled={cargandoAccion} style={{ padding: "8px 16px", background: "#0f766e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", opacity: cargandoAccion ? 0.5 : 1 }}>{cargandoAccion ? "Registrando..." : "Registrar"}</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}