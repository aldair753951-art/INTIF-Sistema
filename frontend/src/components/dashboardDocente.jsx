import React from 'react';
import { Card, StatCard, Badge } from './index';

export default function DashboardDocente({ usuario, cursos, docentes, asistencias, matriculas, alumnos }) {
    // Asegurar arrays
    const cursosArray = Array.isArray(cursos) ? cursos : [];
    const docentesArray = Array.isArray(docentes) ? docentes : [];
    const asistenciasArray = Array.isArray(asistencias) ? asistencias : [];
    const matriculasArray = Array.isArray(matriculas) ? matriculas : [];
    const alumnosArray = Array.isArray(alumnos) ? alumnos : [];

    // Obtener el docente vinculado al usuario logueado
    const docente = docentesArray.find(d => d.usuario_id === usuario?.id);
    // Filtrar cursos del docente (usando el id del docente, no el del usuario)
    const misCursos = docente ? cursosArray.filter(c => Number(c.docente_id) === Number(docente.id)) : [];

    // Calcular total de alumnos
    const totalAlumnos = misCursos.reduce((sum, curso) => {
        const inscritos = matriculasArray.filter(m => m.curso_id === curso.id).length;
        return sum + inscritos;
    }, 0);

    // Asistencias de sus cursos
    const totalAsistencias = asistenciasArray.filter(a => misCursos.some(c => c.id === a.curso_id));
    const presentes = totalAsistencias.filter(a => a.estado === "Asistió").length;
    const pctAsist = totalAsistencias.length ? Math.round(presentes / totalAsistencias.length * 100) : 0;

    return (
        <div style={{ padding: "2rem" }}>
            <h1 style={{ fontSize: "1.8rem", color: "#1e293b", marginBottom: "0.25rem" }}>
                Bienvenido, {usuario?.nombre?.split(" ")[0] || "Docente"} 👋
            </h1>
            <p style={{ color: "#64748b", marginBottom: "2rem" }}>
                {new Date().toLocaleDateString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                <StatCard label="Mis cursos" value={misCursos.length} icon="📚" color="#7c3aed" />
                <StatCard label="Total alumnos" value={totalAlumnos} icon="👥" color="#0284c7" />
                <StatCard label="Registros asistencia" value={totalAsistencias.length} icon="✅" color="#16a34a" />
                <StatCard label="% Asistencia" value={`${pctAsist}%`} icon="📊" color={pctAsist >= 80 ? "#16a34a" : "#d97706"} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                <Card>
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Mis cursos</h3>
                    {misCursos.length === 0 ? (
                        <p style={{ color: "#94a3b8" }}>No tienes cursos asignados.</p>
                    ) : (
                        misCursos.map(c => {
                            const inscritos = matriculasArray.filter(m => m.curso_id === c.id).length;
                            return (
                                <div key={c.id} style={{ padding: "0.75rem 0", borderBottom: "1px solid #f1f5f9" }}>
                                    <div style={{ fontWeight: 600 }}>{c.nombre}</div>
                                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{c.horario} · {c.dias}</div>
                                    <div style={{ fontSize: "0.8rem", color: "#0f766e" }}>{inscritos} alumnos</div>
                                </div>
                            );
                        })
                    )}
                </Card>
                <Card>
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Últimos registros</h3>
                    {totalAsistencias.slice(-5).reverse().map(a => {
                        const alumno = alumnosArray.find(al => al.id === a.alumno_id);
                        return (
                            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #f1f5f9" }}>
                                <span>{alumno?.nombre || "Desconocido"}</span>
                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{a.fecha}</span>
                                    <Badge estado={a.estado} />
                                </div>
                            </div>
                        );
                    })}
                    {totalAsistencias.length === 0 && <p style={{ color: "#94a3b8" }}>No hay registros de asistencia aún.</p>}
                </Card>
            </div>
        </div>
    );
}