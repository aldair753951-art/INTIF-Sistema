import React, { useState } from 'react';
import { Card, StatCard, Badge, Btn } from './index';

const fmtFecha = (f) => f ? f.split("-").reverse().join("/") : "-";

export default function MiAsistencia({ usuario, alumnos, asistencias, cursos }) {
    const alumno = alumnos.find(a => a.usuario_id === usuario?.id);
    const [filtroCurso, setFiltroCurso] = useState("");

    if (!alumno) return <div style={{ padding: "2rem" }}>No se encontró perfil de alumno.</div>;

    const misAsistencias = asistencias
        .filter(a => a.alumno_id === alumno.id && (!filtroCurso || a.curso_id === Number(filtroCurso)))
        .sort((a, b) => b.fecha.localeCompare(a.fecha));

    const presentes = misAsistencias.filter(a => a.estado === "Asistió").length;
    const pct = misAsistencias.length ? Math.round(presentes / misAsistencias.length * 100) : 0;

    // Obtener cursos en los que el alumno tiene asistencias (para el filtro)
    const cursosConAsistencia = [...new Set(misAsistencias.map(a => a.curso_id))];
    const cursosFiltro = cursos.filter(c => cursosConAsistencia.includes(c.id));

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Mi historial de asistencia</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: "1.5rem" }}>
                <StatCard label="Total clases" value={misAsistencias.length} icon="📅" color="#0284c7" />
                <StatCard label="Asistencias" value={presentes} icon="✅" color="#16a34a" />
                <StatCard label="% Asistencia" value={`${pct}%`} icon="📊" color={pct >= 80 ? "#16a34a" : "#dc2626"} />
            </div>

            {cursosFiltro.length > 0 && (
                <Card style={{ marginBottom: "1rem" }}>
                    <select
                        value={filtroCurso}
                        onChange={e => setFiltroCurso(e.target.value)}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0" }}
                    >
                        <option value="">Todos los cursos</option>
                        {cursosFiltro.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                </Card>
            )}

            <Card>
                {misAsistencias.length === 0 ? (
                    <p>No hay registros de asistencia.</p>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#0f766e", color: "white" }}>
                                <th style={{ padding: "10px" }}>Fecha</th>
                                <th style={{ padding: "10px" }}>Curso</th>
                                <th style={{ padding: "10px" }}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {misAsistencias.map((a, i) => {
                                const curso = cursos.find(c => c.id === a.curso_id);
                                return (
                                    <tr key={a.id} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                        <td style={{ padding: "10px" }}>{fmtFecha(a.fecha)}</td>
                                        <td style={{ padding: "10px" }}>{curso?.nombre || "—"}</td>
                                        <td style={{ padding: "10px" }}><Badge estado={a.estado} /></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </Card>
        </div>
    );
}