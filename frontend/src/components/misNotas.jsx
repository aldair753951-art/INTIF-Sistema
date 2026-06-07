import React, { useState, useEffect } from 'react';
import { Card, StatCard, Badge, Btn } from './index';
import { api } from '../services/api';

export default function MisNotas({ usuario, alumnos, cursos, matriculas }) {
    const [alumno, setAlumno] = useState(null);
    const [misCursosConNotas, setMisCursosConNotas] = useState([]);
    const [promedioGeneral, setPromedioGeneral] = useState(0);
    const [filtro, setFiltro] = useState("todos");
    const [orden, setOrden] = useState("nombre");

    useEffect(() => {
        const loadData = async () => {
            // Encontrar el alumno por usuario
            const alumnoData = alumnos.find(a => a.usuario_id === usuario.id || a.nombre === usuario.nombre);
            setAlumno(alumnoData);
            
            if (alumnoData) {
                // Obtener cursos del alumno
                const misMatriculas = matriculas.filter(m => m.alumno_id === alumnoData.id);
                const cursosIds = misMatriculas.map(m => m.curso_id);
                const cursosAlumno = cursos.filter(c => cursosIds.includes(c.id));
                
                // Simular notas (esto vendría del backend en un futuro)
                const cursosConNotas = cursosAlumno.map(curso => ({
                    ...curso,
                    notas: generarNotasSimuladas(curso.id),
                    promedio: calcularPromedioCurso(curso.id)
                }));
                
                setMisCursosConNotas(cursosConNotas);
                
                // Calcular promedio general
                const promedios = cursosConNotas.map(c => c.promedio);
                const total = promedios.reduce((sum, p) => sum + p, 0);
                setPromedioGeneral(promedios.length > 0 ? Math.round(total / promedios.length) : 0);
            }
        };
        
        loadData();
    }, [usuario, alumnos, cursos, matriculas]);

    // Función para generar notas simuladas (en producción vendrían del backend)
    const generarNotasSimuladas = (cursoId) => {
        // Simular diferentes tipos de evaluación
        return [
            { id: 1, nombre: "PC1 - Práctica Calificada 1", nota: Math.floor(Math.random() * 5) + 11, peso: 20, fecha: "2026-03-15" },
            { id: 2, nombre: "PC2 - Práctica Calificada 2", nota: Math.floor(Math.random() * 5) + 11, peso: 20, fecha: "2026-04-10" },
            { id: 3, nombre: "PC3 - Práctica Calificada 3", nota: Math.floor(Math.random() * 5) + 11, peso: 20, fecha: "2026-05-05" },
            { id: 4, nombre: "Examen Parcial", nota: Math.floor(Math.random() * 5) + 11, peso: 20, fecha: "2026-04-20" },
            { id: 5, nombre: "Examen Final", nota: Math.floor(Math.random() * 5) + 11, peso: 20, fecha: "2026-06-10" },
            { id: 6, nombre: "Trabajo Final", nota: Math.floor(Math.random() * 5) + 13, peso: 15, fecha: "2026-06-15" },
            { id: 7, nombre: "Participación", nota: Math.floor(Math.random() * 3) + 15, peso: 10, fecha: "2026-06-01" }
        ];
    };

    // Calcular promedio del curso
    const calcularPromedioCurso = (cursoId) => {
        const curso = misCursosConNotas.find(c => c.id === cursoId);
        if (!curso || !curso.notas) return 0;
        
        let sumaPonderada = 0;
        let sumaPesos = 0;
        
        curso.notas.forEach(nota => {
            sumaPonderada += (nota.nota * nota.peso);
            sumaPesos += nota.peso;
        });
        
        return sumaPesos > 0 ? Math.round(sumaPonderada / sumaPesos) : 0;
    };

    // Obtener color según nota
    const getNotaColor = (nota) => {
        if (nota >= 18) return { color: "#16a34a", bg: "#dcfce7" };
        if (nota >= 14) return { color: "#0284c7", bg: "#dbeafe" };
        if (nota >= 11) return { color: "#d97706", bg: "#fef3c7" };
        return { color: "#dc2626", bg: "#fee2e2" };
    };

    // Obtener letra de nota
    const getNotaLiteral = (nota) => {
        if (nota >= 18) return "AD (Logro destacado)";
        if (nota >= 14) return "A (Logro esperado)";
        if (nota >= 11) return "B (En proceso)";
        return "C (En inicio)";
    };

    // Filtrar cursos
    const cursosFiltrados = misCursosConNotas.filter(curso => {
        if (filtro === "aprobados") return curso.promedio >= 11;
        if (filtro === "desaprobados") return curso.promedio < 11;
        return true;
    });

    // Ordenar cursos
    const cursosOrdenados = [...cursosFiltrados].sort((a, b) => {
        if (orden === "nombre") return a.nombre.localeCompare(b.nombre);
        if (orden === "promedio") return b.promedio - a.promedio;
        if (orden === "mejor") return b.promedio - a.promedio;
        if (orden === "peor") return a.promedio - b.promedio;
        return 0;
    });

    if (!alumno) {
        return <div style={{ padding: "2rem" }}>No se encontró perfil de alumno.</div>;
    }

    return (
        <div style={{ padding: "2rem" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 22, color: "#1e293b" }}>Mis Notas</h2>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
                        {alumno.nombre} · {alumno.codigo}
                    </p>
                </div>
                <div style={{
                    background: "#f1f5f9",
                    borderRadius: 12,
                    padding: "0.5rem 1rem",
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Promedio General</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: promedioGeneral >= 11 ? "#16a34a" : "#dc2626" }}>
                        {promedioGeneral}
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b" }}>{getNotaLiteral(promedioGeneral)}</div>
                </div>
            </div>

            {/* Tarjetas de resumen */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: "1.5rem" }}>
                <StatCard label="Cursos" value={misCursosConNotas.length} icon="📚" color="#7c3aed" />
                <StatCard label="Cursos Aprobados" value={misCursosConNotas.filter(c => c.promedio >= 11).length} icon="✅" color="#16a34a" />
                <StatCard label="Cursos Desaprobados" value={misCursosConNotas.filter(c => c.promedio < 11).length} icon="❌" color="#dc2626" />
                <StatCard label="Mejor Promedio" value={`${Math.max(...misCursosConNotas.map(c => c.promedio), 0)}`} icon="🏆" color="#d97706" />
            </div>

            {/* Filtros y orden */}
            <Card style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                        <Btn onClick={() => setFiltro("todos")} small color="#0f766e" outline={filtro !== "todos"}>📋 Todos</Btn>
                        <Btn onClick={() => setFiltro("aprobados")} small color="#16a34a" outline={filtro !== "aprobados"}>✅ Aprobados</Btn>
                        <Btn onClick={() => setFiltro("desaprobados")} small color="#dc2626" outline={filtro !== "desaprobados"}>❌ Desaprobados</Btn>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <span style={{ fontSize: 12, color: "#64748b", alignSelf: "center" }}>Ordenar por:</span>
                        <select value={orden} onChange={e => setOrden(e.target.value)} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 12 }}>
                            <option value="nombre">📝 Nombre</option>
                            <option value="promedio">📊 Promedio</option>
                            <option value="mejor">🏆 Mejor nota</option>
                            <option value="peor">📉 Peor nota</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Lista de cursos con notas */}
            {cursosOrdenados.map(curso => {
                const notaColor = getNotaColor(curso.promedio);
                return (
                    <Card key={curso.id} style={{ marginBottom: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 16, color: "#1e293b" }}>{curso.nombre}</h3>
                                <div style={{ fontSize: 12, color: "#64748b" }}>{curso.horario} · {curso.dias}</div>
                            </div>
                            <div style={{ textAlign: "center", background: notaColor.bg, padding: "0.5rem 1rem", borderRadius: 12 }}>
                                <div style={{ fontSize: 11, color: "#64748b" }}>Promedio Final</div>
                                <div style={{ fontSize: 24, fontWeight: 700, color: notaColor.color }}>{curso.promedio}</div>
                                <div style={{ fontSize: 10, color: notaColor.color }}>{getNotaLiteral(curso.promedio)}</div>
                            </div>
                        </div>

                        {/* Tabla de notas por evaluación */}
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                                    <th style={{ padding: "10px", textAlign: "left" }}>Evaluación</th>
                                    <th style={{ padding: "10px", textAlign: "center" }}>Peso</th>
                                    <th style={{ padding: "10px", textAlign: "center" }}>Nota</th>
                                    <th style={{ padding: "10px", textAlign: "center" }}>Estado</th>
                                    <th style={{ padding: "10px", textAlign: "center" }}>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {curso.notas.map(nota => {
                                    const notaEvalColor = getNotaColor(nota.nota);
                                    return (
                                        <tr key={nota.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td style={{ padding: "10px", fontWeight: 500 }}>{nota.nombre}</td>
                                            <td style={{ padding: "10px", textAlign: "center" }}>{nota.peso}%</td>
                                            <td style={{ padding: "10px", textAlign: "center" }}>
                                                <span style={{
                                                    background: notaEvalColor.bg,
                                                    color: notaEvalColor.color,
                                                    padding: "4px 8px",
                                                    borderRadius: 8,
                                                    fontWeight: 600,
                                                    fontSize: 14
                                                }}>
                                                    {nota.nota}
                                                </span>
                                            </td>
                                            <td style={{ padding: "10px", textAlign: "center" }}>
                                                <Badge estado={nota.nota >= 11 ? "Aprobado" : "Desaprobado"} />
                                            </td>
                                            <td style={{ padding: "10px", textAlign: "center", color: "#64748b" }}>
                                                {new Date(nota.fecha).toLocaleDateString("es-PE")}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr style={{ background: "#f8fafc", borderTop: "2px solid #e2e8f0" }}>
                                    <td style={{ padding: "10px", fontWeight: 600 }}>PROMEDIO PONDERADO</td>
                                    <td style={{ padding: "10px", textAlign: "center" }}>100%</td>
                                    <td style={{ padding: "10px", textAlign: "center" }} colSpan="3">
                                        <span style={{
                                            background: notaColor.bg,
                                            color: notaColor.color,
                                            padding: "4px 12px",
                                            borderRadius: 8,
                                            fontWeight: 700,
                                            fontSize: 16
                                        }}>
                                            {curso.promedio} - {getNotaLiteral(curso.promedio)}
                                        </span>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </Card>
                );
            })}

            {cursosOrdenados.length === 0 && (
                <Card>
                    <p style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>
                        No se encontraron cursos con notas registradas.
                    </p>
                </Card>
            )}

            {/* Leyenda */}
            <Card style={{ marginTop: "1rem" }}>
                <h4 style={{ margin: "0 0 0.5rem", fontSize: 14, color: "#1e293b" }}>📖 Leyenda de calificaciones</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#16a34a" }} />
                        <span>AD (18-20): Logro destacado</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#0284c7" }} />
                        <span>A (14-17): Logro esperado</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#d97706" }} />
                        <span>B (11-13): En proceso</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#dc2626" }} />
                        <span>C (0-10): En inicio</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}