import React from 'react';
import { Card, StatCard } from './index';

export default function DashboardAlumno({ usuario, alumnos, cursos, asistencias, matriculas }) {
    // Asegurar que alumnos es un array
    const alumnosArray = Array.isArray(alumnos) ? alumnos : [];
    const alumno = alumnosArray.find(a => a.usuario_id === usuario?.id);
    
    if (!alumno) {
        return (
            <div style={{ padding: "2rem" }}>
                <h2>No se encontró perfil de alumno</h2>
                <p>Contacta al administrador.</p>
                <p>Tu ID de usuario: {usuario?.id}</p>
                <p>Alumnos disponibles: {alumnosArray.length}</p>
            </div>
        );
    }

    const misMatriculas = matriculas.filter(m => m.alumno_id === alumno.id);
    const misAsistencias = asistencias.filter(a => a.alumno_id === alumno.id);
    const presentes = misAsistencias.filter(a => a.estado === "Asistió").length;
    const pctAsist = misAsistencias.length ? Math.round((presentes / misAsistencias.length) * 100) : 0;

    return (
        <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
                <div style={{
                    width: 60, height: 60, borderRadius: "50%",
                    background: "#b45309", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, fontWeight: 700
                }}>
                    {alumno.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, color: "#1e293b" }}>{alumno.nombre}</h1>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
                        Código: {alumno.codigo} · {alumno.programa || "Sin programa"}
                    </p>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: "1.5rem" }}>
                <StatCard label="Cursos matriculados" value={misMatriculas.length} icon="📚" color="#7c3aed" />
                <StatCard label="Días registrados" value={misAsistencias.length} icon="📅" color="#0284c7" />
                <StatCard label="Asistencias" value={presentes} icon="✅" color="#16a34a" />
                <StatCard label="% Asistencia" value={`${pctAsist}%`} icon="📊" color={pctAsist >= 80 ? "#16a34a" : "#dc2626"} />
            </div>

            <Card>
                <h3>Mis cursos</h3>
                {misMatriculas.map(m => {
                    const curso = cursos.find(c => c.id === m.curso_id);
                    const asisCurso = misAsistencias.filter(a => a.curso_id === curso?.id);
                    const p = asisCurso.filter(a => a.estado === "Asistió").length;
                    const pc = asisCurso.length ? Math.round(p / asisCurso.length * 100) : 0;
                    return (
                        <div key={m.id} style={{ padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                            <div><strong>{curso?.nombre}</strong> - {curso?.horario} · {curso?.dias}</div>
                            <div>Progreso: {pc}% ({p}/{asisCurso.length} clases)</div>
                        </div>
                    );
                })}
                {misMatriculas.length === 0 && <p>No estás matriculado en ningún curso.</p>}
            </Card>
        </div>
    );
}