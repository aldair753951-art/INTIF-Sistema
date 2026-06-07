import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AsistenciasGlobales() {
    const [asistencias, setAsistencias] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtroCurso, setFiltroCurso] = useState("");

    useEffect(() => {
        const cargar = async () => {
            try {
                const [asistData, alumData, cursoData] = await Promise.all([
                    api.getAsistencias(),
                    api.getAlumnos(),
                    api.getCursos()
                ]);
                setAsistencias(asistData || []);
                setAlumnos(alumData || []);
                setCursos(cursoData || []);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, []);

    const asistenciasFiltradas = asistencias.filter(a =>
        !filtroCurso || a.curso_id === parseInt(filtroCurso)
    );

    if (cargando) return <div style={{ padding: "2rem" }}>⏳ Cargando asistencias...</div>;

    return (
        <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 22, color: "#1e293b" }}>📋 Registro de Asistencias</h2>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>Historial completo de asistencias</p>
                </div>
            </div>

            {/* Filtro por curso */}
            <select
                value={filtroCurso}
                onChange={(e) => setFiltroCurso(e.target.value)}
                style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "13px",
                    marginBottom: "1rem",
                    boxSizing: "border-box"
                }}
            >
                <option value="">-- Todos los cursos --</option>
                {cursos.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
            </select>

            {/* Tabla de asistencias */}
            {asistenciasFiltradas.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "2rem",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    color: "#64748b"
                }}>
                    No hay registros de asistencia.
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
                            </tr>
                        </thead>
                        <tbody>
                            {asistenciasFiltradas.map((a, index) => {
                                const alumno = alumnos.find(al => al.id === a.alumno_id);
                                const curso = cursos.find(c => c.id === a.curso_id);
                                return (
                                    <tr key={a.id} style={{ borderBottom: "1px solid #e2e8f0", background: index % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                        <td style={{ padding: "10px", fontWeight: 500 }}>{alumno?.nombre || "—"}</td>
                                        <td style={{ padding: "10px", fontFamily: "monospace" }}>{alumno?.codigo || "—"}</td>
                                        <td style={{ padding: "10px" }}>{curso?.nombre || "—"}</td>
                                        <td style={{ padding: "10px" }}>{a.fecha}</td>
                                        <td style={{ padding: "10px" }}>
                                            <span style={{
                                                background: a.estado === "Asistió" ? "#dcfce7" : a.estado === "Falta" ? "#fee2e2" : "#fef3c7",
                                                color: a.estado === "Asistió" ? "#16a34a" : a.estado === "Falta" ? "#dc2626" : "#d97706",
                                                padding: "2px 8px",
                                                borderRadius: "12px",
                                                fontSize: "11px"
                                            }}>
                                                {a.estado || "—"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}