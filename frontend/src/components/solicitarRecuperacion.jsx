import React, { useState, useEffect } from 'react';
import { Card, Btn } from './index';
import { api } from '../services/api';

export default function SolicitarRecuperacion({ usuario, alumnos, asistencias, cursos }) {
    const [alumno, setAlumno] = useState(null);
    const [cursoSel, setCursoSel] = useState("");
    const [fechaSel, setFechaSel] = useState("");
    const [motivo, setMotivo] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const [faltas, setFaltas] = useState([]);

    useEffect(() => {
        // Buscar el alumno a partir del usuario logueado
        const alumnoEncontrado = (alumnos || []).find(a => a.usuario_id === usuario?.id);
        setAlumno(alumnoEncontrado);

        if (alumnoEncontrado) {
            // Filtrar las asistencias del alumno que sean "Falta"
            const misFaltas = (asistencias || []).filter(
                a => a.alumno_id === alumnoEncontrado.id && a.estado === "Falta"
            );
            setFaltas(misFaltas);
        }
    }, [usuario, alumnos, asistencias]);

    const handleSubmit = async () => {
        setError("");
        if (!cursoSel || !fechaSel || !motivo.trim()) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        setCargando(true);
        try {
            await api.createSolicitud({
                curso_id: parseInt(cursoSel),
                fecha_clase: fechaSel,
                motivo: motivo.trim(),
                evidencia: null
            });
            setEnviado(true);
            // Limpiar formulario después de enviar
            setCursoSel("");
            setFechaSel("");
            setMotivo("");
            setTimeout(() => setEnviado(false), 3000);
        } catch (err) {
            console.error("Error al enviar solicitud:", err);
            setError(err.message || "No se pudo enviar la solicitud. Intente más tarde.");
        } finally {
            setCargando(false);
        }
    };

    if (!alumno) {
        return (
            <div style={{ padding: "2rem" }}>
                <Card>
                    <p>No se encontró perfil de alumno. Contacta al administrador.</p>
                </Card>
            </div>
        );
    }

    // Obtener cursos únicos a partir de las faltas (para el selector)
    const cursosUnicos = [];
    const cursosMap = new Map();
    faltas.forEach(falta => {
        const curso = (cursos || []).find(c => c.id === falta.curso_id);
        if (curso && !cursosMap.has(curso.id)) {
            cursosMap.set(curso.id, curso);
            cursosUnicos.push(curso);
        }
    });

    const faltasDelCurso = faltas.filter(f => f.curso_id === parseInt(cursoSel));

    return (
        <div style={{ padding: "2rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>📩 Justificar falta</h2>
            <Card>
                {faltas.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#64748b" }}>
                        No tienes faltas registradas. ¡Sigue así!
                    </p>
                ) : (
                    <>
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "4px", fontWeight: 600 }}>Curso</label>
                            <select
                                value={cursoSel}
                                onChange={(e) => {
                                    setCursoSel(e.target.value);
                                    setFechaSel(""); // resetear fecha al cambiar curso
                                }}
                                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #ccc" }}
                            >
                                <option value="">-- Seleccionar curso --</option>
                                {cursosUnicos.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "4px", fontWeight: 600 }}>Fecha de la falta</label>
                            <select
                                value={fechaSel}
                                onChange={(e) => setFechaSel(e.target.value)}
                                disabled={!cursoSel}
                                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #ccc" }}
                            >
                                <option value="">-- Seleccionar fecha --</option>
                                {faltasDelCurso.map(f => (
                                    <option key={f.fecha} value={f.fecha}>{f.fecha}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "4px", fontWeight: 600 }}>Motivo</label>
                            <textarea
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                rows={3}
                                placeholder="Explica el motivo de tu inasistencia..."
                                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #ccc", resize: "vertical" }}
                            />
                        </div>

                        {error && (
                            <div style={{ color: "#dc2626", fontSize: "13px", marginBottom: "1rem" }}>
                                ❌ {error}
                            </div>
                        )}
                        {enviado && (
                            <div style={{ color: "#16a34a", fontSize: "13px", marginBottom: "1rem" }}>
                                ✓ Solicitud enviada correctamente. El docente la revisará.
                            </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Btn onClick={handleSubmit} disabled={cargando} color="#b45309">
                                {cargando ? "Enviando..." : "📨 Enviar solicitud"}
                            </Btn>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}