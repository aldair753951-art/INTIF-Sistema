import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { exportToExcel } from '../utils/exportUtils';
import { Card, Btn } from './index';

export default function Reportes() {
    const [tab, setTab] = useState("asistencia");
    const [cursoFiltro, setCursoFiltro] = useState("");
    
    // Datos para Asistencia
    const [reporteAsistencia, setReporteAsistencia] = useState([]);
    const [cursos, setCursos] = useState([]);
    
    // Datos para Matrículas
    const [matriculas, setMatriculas] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    
    // Datos para Cursos
    const [cursosLista, setCursosLista] = useState([]);
    const [docentes, setDocentes] = useState([]);

    useEffect(() => {
        cargarTodosLosDatos();
    }, []);

    useEffect(() => {
        if (tab === "asistencia") {
            cargarReporteAsistencia();
        }
    }, [cursoFiltro]);

    const cargarTodosLosDatos = async () => {
        try {
            const [cursosData, matriculasData, alumnosData, docentesData] = await Promise.all([
                api.getCursos(),
                api.getMatriculas(),
                api.getAlumnos(),
                api.getDocentes()
            ]);
            setCursos(cursosData || []);
            setCursosLista(cursosData || []);
            setMatriculas(matriculasData || []);
            setAlumnos(alumnosData || []);
            setDocentes(docentesData || []);
            await cargarReporteAsistencia();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const cargarReporteAsistencia = async () => {
        try {
            const data = await api.getReporteAsistencia(cursoFiltro || null);
            setReporteAsistencia(data || []);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Datos para reporte de matrículas
    const reporteMatriculas = matriculas.map(m => {
        const alumno = alumnos.find(a => a.id === m.alumno_id);
        const curso = cursos.find(c => c.id === m.curso_id);
        return {
            alumno: alumno?.nombre || "—",
            codigo: alumno?.codigo || "—",
            curso: curso?.nombre || "—",
            fecha: m.fecha,
            estado: m.estado || "Activo"
        };
    });

    // Datos para reporte de cursos
    const reporteCursos = cursosLista.map(c => {
        const docente = docentes.find(d => d.id === c.docente_id);
        const alumnosCount = matriculas.filter(m => m.curso_id === c.id && m.estado === "Activo").length;
        return {
            nombre: c.nombre,
            docente: docente?.nombre || "No asignado",
            horario: c.horario || "No definido",
            dias: c.dias || "No definido",
            capacidad: c.capacidad || 30,
            alumnos: alumnosCount
        };
    });

    // Obtener los datos a exportar según la pestaña activa
    const getExportData = () => {
        if (tab === "asistencia") {
            return reporteAsistencia.map(a => ({
                Alumno: a.nombre,
                Código: a.codigo,
                Programa: a.programa || '',
                'Total Clases': a.total_clases,
                Asistencias: a.asistencias,
                Faltas: a.faltas,
                Tardanzas: a.tardanzas || 0,
                'Porcentaje %': a.porcentaje
            }));
        } else if (tab === "matriculas") {
            return reporteMatriculas.map(m => ({
                Alumno: m.alumno,
                Código: m.codigo,
                Curso: m.curso,
                Fecha: m.fecha,
                Estado: m.estado
            }));
        } else {
            return reporteCursos.map(c => ({
                Curso: c.nombre,
                Docente: c.docente,
                Horario: c.horario,
                Días: c.dias,
                Capacidad: c.capacidad,
                'Alumnos Matriculados': c.alumnos
            }));
        }
    };

    const handleExport = () => {
        const data = getExportData();
        if (data.length === 0) {
            alert('No hay datos para exportar en esta sección.');
            return;
        }
        const filename = `Reporte_${tab}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`;
        exportToExcel(data, filename, tab.charAt(0).toUpperCase() + tab.slice(1));
    };

    return (
        <div style={{ padding: "2rem" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ margin: "0 0 0.5rem", fontSize: 22, color: "#1e293b" }}>📊 Reportes</h2>
                    <p style={{ marginBottom: 0, fontSize: 13, color: "#64748b" }}>Consulta y exporta reportes</p>
                </div>
                <Btn onClick={handleExport} color="#0f766e">📊 Exportar a Excel</Btn>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem", background: "#f1f5f9", borderRadius: 10, padding: 4 }}>
                <button onClick={() => setTab("asistencia")} style={{
                    flex: 1, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: tab === "asistencia" ? "#0f766e" : "transparent",
                    color: tab === "asistencia" ? "#fff" : "#64748b",
                    fontWeight: tab === "asistencia" ? 600 : 400, fontSize: 13
                }}>📅 Asistencia</button>
                <button onClick={() => setTab("matriculas")} style={{
                    flex: 1, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: tab === "matriculas" ? "#0f766e" : "transparent",
                    color: tab === "matriculas" ? "#fff" : "#64748b",
                    fontWeight: tab === "matriculas" ? 600 : 400, fontSize: 13
                }}>📋 Matrículas</button>
                <button onClick={() => setTab("cursos")} style={{
                    flex: 1, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: tab === "cursos" ? "#0f766e" : "transparent",
                    color: tab === "cursos" ? "#fff" : "#64748b",
                    fontWeight: tab === "cursos" ? 600 : 400, fontSize: 13
                }}>📚 Cursos</button>
            </div>

            {/* Tabla de Asistencia */}
            {tab === "asistencia" && (
                <>
                    <select value={cursoFiltro} onChange={e => setCursoFiltro(e.target.value)} style={{
                        width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0",
                        fontSize: "13px", marginBottom: "1rem", boxSizing: "border-box"
                    }}>
                        <option value="">Todos los cursos</option>
                        {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>

                    {reporteAsistencia.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "2rem", background: "#f8fafc", borderRadius: "12px", color: "#64748b" }}>
                            No hay datos de asistencia.
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "12px", overflow: "hidden", fontSize: "13px" }}>
                                <thead>
                                    <tr style={{ background: "#0f766e", color: "white" }}>
                                        <th style={{ padding: "10px", textAlign: "left" }}>Alumno</th>
                                        <th style={{ padding: "10px", textAlign: "left" }}>Código</th>
                                        <th style={{ padding: "10px", textAlign: "center" }}>Total</th>
                                        <th style={{ padding: "10px", textAlign: "center" }}>Asistencias</th>
                                        <th style={{ padding: "10px", textAlign: "center" }}>Faltas</th>
                                        <th style={{ padding: "10px", textAlign: "center" }}>%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reporteAsistencia.map((a, index) => (
                                        <tr key={a.id} style={{ borderBottom: "1px solid #e2e8f0", background: index % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                            <td style={{ padding: "10px", fontWeight: 500 }}>{a.nombre}</td>
                                            <td style={{ padding: "10px", fontFamily: "monospace" }}>{a.codigo}</td>
                                            <td style={{ padding: "10px", textAlign: "center" }}>{a.total_clases || 0}</td>
                                            <td style={{ padding: "10px", textAlign: "center", color: "#16a34a" }}>{a.asistencias || 0}</td>
                                            <td style={{ padding: "10px", textAlign: "center", color: "#dc2626" }}>{a.faltas || 0}</td>
                                            <td style={{ padding: "10px", textAlign: "center" }}>
                                                <span style={{ fontWeight: 600, color: (a.porcentaje || 0) >= 80 ? "#16a34a" : "#dc2626" }}>
                                                    {(a.porcentaje || 0)}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* Tabla de Matrículas */}
            {tab === "matriculas" && (
                <div style={{ overflowX: "auto" }}>
                    {reporteMatriculas.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "2rem", background: "#f8fafc", borderRadius: "12px", color: "#64748b" }}>
                            No hay matrículas registradas.
                        </div>
                    ) : (
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
                                {reporteMatriculas.map((m, index) => (
                                    <tr key={index} style={{ borderBottom: "1px solid #e2e8f0", background: index % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                        <td style={{ padding: "10px", fontWeight: 500 }}>{m.alumno}</td>
                                        <td style={{ padding: "10px", fontFamily: "monospace" }}>{m.codigo}</td>
                                        <td style={{ padding: "10px" }}>{m.curso}</td>
                                        <td style={{ padding: "10px" }}>{m.fecha}</td>
                                        <td style={{ padding: "10px" }}>
                                            <span style={{
                                                background: m.estado === "Activo" ? "#dcfce7" : "#fee2e2",
                                                color: m.estado === "Activo" ? "#16a34a" : "#dc2626",
                                                padding: "2px 8px",
                                                borderRadius: "12px",
                                                fontSize: "11px"
                                            }}>{m.estado}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Tabla de Cursos */}
            {tab === "cursos" && (
                <div style={{ overflowX: "auto" }}>
                    {reporteCursos.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "2rem", background: "#f8fafc", borderRadius: "12px", color: "#64748b" }}>
                            No hay cursos registrados.
                        </div>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "12px", overflow: "hidden", fontSize: "13px" }}>
                            <thead>
                                <tr style={{ background: "#0f766e", color: "white" }}>
                                    <th style={{ padding: "10px", textAlign: "left" }}>Curso</th>
                                    <th style={{ padding: "10px", textAlign: "left" }}>Docente</th>
                                    <th style={{ padding: "10px", textAlign: "left" }}>Horario</th>
                                    <th style={{ padding: "10px", textAlign: "left" }}>Días</th>
                                    <th style={{ padding: "10px", textAlign: "center" }}>Alumnos</th>
                                    <th style={{ padding: "10px", textAlign: "center" }}>Capacidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reporteCursos.map((c, index) => (
                                    <tr key={index} style={{ borderBottom: "1px solid #e2e8f0", background: index % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                        <td style={{ padding: "10px", fontWeight: 500 }}>{c.nombre}</td>
                                        <td style={{ padding: "10px" }}>{c.docente}</td>
                                        <td style={{ padding: "10px" }}>{c.horario}</td>
                                        <td style={{ padding: "10px" }}>{c.dias}</td>
                                        <td style={{ padding: "10px", textAlign: "center" }}>{c.alumnos}</td>
                                        <td style={{ padding: "10px", textAlign: "center" }}>{c.capacidad}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}