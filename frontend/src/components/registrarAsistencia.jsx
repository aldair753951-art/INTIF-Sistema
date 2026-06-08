import React, { useState, useMemo } from 'react';
import { Card, Btn } from './index';
import { api } from '../services/api';

export default function RegistrarAsistencia({ usuario, cursos, alumnos, matriculas, asistencias, setAsistencias }) {
    const cursosArray = Array.isArray(cursos) ? cursos : [];
    const alumnosArray = Array.isArray(alumnos) ? alumnos : [];
    const matriculasArray = Array.isArray(matriculas) ? matriculas : [];

    // Filtrar cursos del docente (usando docente_id)
    const misCursos = cursosArray.filter(c => Number(c.docente_id) === Number(usuario?.id));
    const [cursoSel, setCursoSel] = useState(misCursos[0]?.id || "");
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [estados, setEstados] = useState({});
    const [guardado, setGuardado] = useState(false);
    const [cargando, setCargando] = useState(false);

    // Obtener alumnos del curso seleccionado
    const alumnosCurso = useMemo(() => {
        if (!cursoSel) return [];
        const ids = matriculasArray.filter(m => m.curso_id === Number(cursoSel)).map(m => m.alumno_id);
        return alumnosArray.filter(a => ids.includes(a.id));
    }, [cursoSel, matriculasArray, alumnosArray]);

    const marcarTodos = (estado) => {
        const nuevo = {};
        alumnosCurso.forEach(a => { nuevo[a.id] = estado; });
        setEstados(nuevo);
    };

    const guardar = async () => {
        if (alumnosCurso.length === 0) {
            alert("No hay alumnos en este curso");
            return;
        }
        setCargando(true);
        const nuevosRegistros = alumnosCurso.map(a => ({
            alumno_id: a.id,
            curso_id: Number(cursoSel),
            fecha: fecha,
            estado: estados[a.id] || "Asistió",
            observacion: ""
        }));
        try {
            const resultado = await api.registrarAsistencias(nuevosRegistros);
            if (resultado.asistenciasGuardadas) {
                const nuevasAsistencias = await api.getAsistencias();
                setAsistencias(nuevasAsistencias);
                setGuardado(true);
                setTimeout(() => setGuardado(false), 3000);
                setEstados({});
            }
        } catch (error) {
            console.error(error);
            alert("Error al guardar asistencias");
        } finally {
            setCargando(false);
        }
    };

    const presentes = alumnosCurso.filter(a => (estados[a.id] || "Asistió") === "Asistió").length;
    const colorEstado = { "Asistió": "#16a34a", "Falta": "#dc2626", "Tardanza": "#d97706", "Justificado": "#2563eb" };

    if (misCursos.length === 0) {
        return (
            <div style={{ padding: "2rem" }}>
                <Card>
                    <p style={{ textAlign: "center", color: "#64748b" }}>No tienes cursos asignados. Contacta al administrador.</p>
                </Card>
            </div>
        );
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h2 style={{ margin: "0 0 1.5rem", fontSize: 22, color: "#1e293b" }}>Registrar asistencia</h2>

            <Card style={{ marginBottom: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Curso</label>
                        <select
                            value={cursoSel}
                            onChange={e => { setCursoSel(e.target.value); setEstados({}); }}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14 }}
                        >
                            {misCursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Fecha</label>
                        <input
                            type="date"
                            value={fecha}
                            onChange={e => setFecha(e.target.value)}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14 }}
                        />
                    </div>
                </div>
            </Card>

            {alumnosCurso.length > 0 && (
                <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <div style={{ fontSize: 14, color: "#64748b" }}>
                            Presentes: <strong style={{ color: "#16a34a" }}>{presentes}</strong> / {alumnosCurso.length}
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <Btn onClick={() => marcarTodos("Asistió")} small color="#16a34a">✓ Todos presentes</Btn>
                            <Btn onClick={() => marcarTodos("Falta")} small color="#dc2626">✗ Todos ausentes</Btn>
                        </div>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                                <th style={{ padding: "8px 10px", textAlign: "left" }}>#</th>
                                <th style={{ padding: "8px 10px", textAlign: "left" }}>Alumno</th>
                                <th style={{ padding: "8px 10px", textAlign: "left" }}>Código</th>
                                <th style={{ padding: "8px 10px", textAlign: "center" }}>Asistió</th>
                                <th style={{ padding: "8px 10px", textAlign: "center" }}>Falta</th>
                                <th style={{ padding: "8px 10px", textAlign: "center" }}>Tardanza</th>
                                <th style={{ padding: "8px 10px", textAlign: "center" }}>Justificado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alumnosCurso.map((a, i) => {
                                const est = estados[a.id] || "Asistió";
                                return (
                                    <tr key={a.id} style={{ borderBottom: "1px solid #f8fafc", background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                        <td style={{ padding: "10px", color: "#94a3b8" }}>{i + 1}</td>
                                        <td style={{ padding: "10px", fontWeight: 500 }}>{a.nombre}</td>
                                        <td style={{ padding: "10px", color: "#64748b" }}>{a.codigo}</td>
                                        {["Asistió", "Falta", "Tardanza", "Justificado"].map(op => (
                                            <td key={op} style={{ padding: "10px", textAlign: "center" }}>
                                                <input
                                                    type="radio"
                                                    name={`est-${a.id}`}
                                                    checked={est === op}
                                                    onChange={() => setEstados(prev => ({ ...prev, [a.id]: op }))}
                                                    style={{ accentColor: colorEstado[op], width: 16, height: 16 }}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "flex-end", gap: 12, alignItems: "center" }}>
                        {guardado && <span style={{ color: "#16a34a", fontSize: 14, fontWeight: 600 }}>✓ Asistencia guardada</span>}
                        <Btn onClick={guardar} color="#7c3aed" disabled={cargando}>{cargando ? "Guardando..." : "💾 Guardar asistencia"}</Btn>
                    </div>
                </Card>
            )}

            {alumnosCurso.length === 0 && cursoSel && (
                <Card>
                    <p style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>No hay alumnos matriculados en este curso.</p>
                </Card>
            )}
        </div>
    );
}