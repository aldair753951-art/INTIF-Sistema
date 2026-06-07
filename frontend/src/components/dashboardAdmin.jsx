import { Card, StatCard } from './index';

export default function DashboardAdmin({ alumnos, docentes, cursos, matriculas, asistencias }) {
    // Asegurar que todos los datos sean arrays
    const alumnosArray = Array.isArray(alumnos) ? alumnos : [];
    const docentesArray = Array.isArray(docentes) ? docentes : [];
    const cursosArray = Array.isArray(cursos) ? cursos : [];
    const matriculasArray = Array.isArray(matriculas) ? matriculas : [];
    const asistenciasArray = Array.isArray(asistencias) ? asistencias : [];

    // Calcular estadísticas solo si hay datos
    const presentes = asistenciasArray.filter(a => a?.estado === "Asistió").length;
    const pct = asistenciasArray.length ? Math.round(presentes / asistenciasArray.length * 100) : 0;

    return (
        <div style={{ padding: "2rem", fontFamily: "'Segoe UI', sans-serif" }}>
            <h1 style={{ margin: "0 0 0.25rem", fontSize: 24, color: "#1e293b" }}>Panel Administrativo</h1>
            <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: 14 }}>Resumen general del instituto</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: "1.5rem" }}>
                <StatCard label="Alumnos activos" value={alumnosArray.length} icon="👥" color="#0284c7" />
                <StatCard label="Docentes" value={docentesArray.length} icon="👨‍🏫" color="#7c3aed" />
                <StatCard label="Cursos activos" value={cursosArray.length} icon="📚" color="#0f766e" />
                <StatCard label="Matrículas 2026" value={matriculasArray.length} icon="📋" color="#b45309" />
                <StatCard label="% Asistencia global" value={`${pct}%`} icon="📊" color={pct >= 80 ? "#16a34a" : "#dc2626"} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <Card>
                    <h3 style={{ margin: "0 0 1rem", color: "#1e293b", fontSize: 16 }}>Ocupación por curso</h3>
                    {cursosArray.length === 0 ? (
                        <p style={{ color: "#94a3b8", textAlign: "center", padding: "2rem" }}>No hay cursos registrados</p>
                    ) : (
                        cursosArray.map(c => {
                            const inscritos = matriculasArray.filter(m => m?.curso_id === c.id).length;
                            const capacidad = c?.capacidad || 30;
                            const pctOcup = Math.round((inscritos / capacidad) * 100);
                            return (
                                <div key={c.id} style={{ marginBottom: 12 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                        <span style={{ fontSize: 13, fontWeight: 500 }}>{c.nombre}</span>
                                        <span style={{ fontSize: 12, color: "#64748b" }}>{inscritos}/{capacidad}</span>
                                    </div>
                                    <div style={{ background: "#f1f5f9", borderRadius: 4, height: 6 }}>
                                        <div style={{ 
                                            width: `${Math.min(pctOcup, 100)}%`, 
                                            background: pctOcup > 90 ? "#dc2626" : "#0f766e", 
                                            height: "100%", 
                                            borderRadius: 4 
                                        }} />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </Card>

                <Card>
                    <h3 style={{ margin: "0 0 1rem", color: "#1e293b", fontSize: 16 }}>Asistencia por curso</h3>
                    {cursosArray.length === 0 ? (
                        <p style={{ color: "#94a3b8", textAlign: "center", padding: "2rem" }}>No hay cursos registrados</p>
                    ) : (
                        cursosArray.map(c => {
                            const asisCurso = asistenciasArray.filter(a => a?.curso_id === c.id);
                            const p = asisCurso.filter(a => a?.estado === "Asistió").length;
                            const pctC = asisCurso.length ? Math.round(p / asisCurso.length * 100) : 0;
                            return (
                                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                                    <span style={{ fontSize: 13 }}>{c.nombre}</span>
                                    <span style={{ 
                                        fontSize: 13, 
                                        fontWeight: 600, 
                                        color: pctC >= 80 ? "#16a34a" : pctC >= 60 ? "#d97706" : "#dc2626" 
                                    }}>
                                        {pctC}%
                                    </span>
                                </div>
                            );
                        })
                    )}
                </Card>
            </div>
        </div>
    );
}