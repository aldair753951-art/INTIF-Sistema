import React from 'react';
import { Card, StatCard, Badge } from './index';

const fmtFecha = (f) => f ? f.split("-").reverse().join("/") : "-";

export default function DashboardDocente({ usuario, alumnos, cursos, asistencias, matriculas }) {
    // Asegurar que asistencias es un array
    const asistenciasArray = Array.isArray(asistencias) ? asistencias : [];
    const cursosArray = Array.isArray(cursos) ? cursos : [];
    const matriculasArray = Array.isArray(matriculas) ? matriculas : [];
    const alumnosArray = Array.isArray(alumnos) ? alumnos : [];

    // Filtrar cursos del docente
    const misCursos = cursosArray.filter(c => c.docente_id === usuario?.id);
    
    // Filtrar asistencias de sus cursos
    const totalAsistencias = asistenciasArray.filter(a => misCursos.some(c => c.id === a.curso_id));
    const presentes = totalAsistencias.filter(a => a.estado === "Asistió").length;
    const pctAsist = totalAsistencias.length ? Math.round(presentes / totalAsistencias.length * 100) : 0;

    return (
        <div style={{ padding: "2rem", fontFamily: "'Segoe UI', sans-serif" }}>
            <h1 style={{ margin: "0 0 0.25rem", fontSize: 24, color: "#1e293b" }}>
                Bienvenido, {usuario?.nombre?.split(" ")[0] || "Docente"} 👋
            </h1>
            <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: 14 }}>
                {new Date().toLocaleDateString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: "1.5rem" }}>
                <StatCard label="Mis cursos" value={misCursos.length} icon="📚" color="#7c3aed" />
                <StatCard label="Total alumnos" value={matriculasArray.filter(m => misCursos.some(c => c.id === m.curso_id)).length} icon="👥" color="#0284c7" />
                <StatCard label="Registros asistencia" value={totalAsistencias.length} icon="✅" color="#16a34a" />
                <StatCard label="% Asistencia" value={`${pctAsist}%`} icon="📊" color={pctAsist >= 80 ? "#16a34a" : "#dc2626"} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <Card>
                    <h3 style={{ margin: "0 0 1rem", color: "#1e293b", fontSize: 16 }}>Mis cursos</h3>
                    {misCursos.map(c => {
                        const inscritos = matriculasArray.filter(m => m.curso_id === c.id).length;
                        return (
                            <div key={c.id} style={{ padding: "10px 0", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>{c.nombre}</div>
                                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{c.horario} · {c.dias}</div>
                                </div>
                                <span style={{ background: "#ede9fe", color: "#7c3aed", padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                                    {inscritos} alumnos
                                </span>
                            </div>
                        );
                    })}
                    {misCursos.length === 0 && <p style={{ color: "#94a3b8", fontSize: 14 }}>No tienes cursos asignados.</p>}
                </Card>

                <Card>
                    <h3 style={{ margin: "0 0 1rem", color: "#1e293b", fontSize: 16 }}>Últimos registros</h3>
                    {totalAsistencias.slice(-5).reverse().map(a => {
                        const alumno = alumnosArray.find(al => al.id === a.alumno_id);
                        return (
                            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
                                <span style={{ fontSize: 13 }}>{alumno?.nombre || "Desconocido"}</span>
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{fmtFecha(a.fecha)}</span>
                                    <Badge estado={a.estado} />
                                </div>
                            </div>
                        );
                    })}
                    {totalAsistencias.length === 0 && <p style={{ color: "#94a3b8", fontSize: 14 }}>No hay registros de asistencia aún.</p>}
                </Card>
            </div>
        </div>
    );
}