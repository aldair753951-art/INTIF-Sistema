import React, { useState } from 'react';
import { Card, Btn } from './index';

export default function SolicitarRecuperacion({ usuario, alumnos, asistencias, cursos }) {
    const alumno = alumnos.find(a => a.usuario_id === usuario?.id);
    const [cursoSel, setCursoSel] = useState("");
    const [fechaSel, setFechaSel] = useState("");
    const [motivo, setMotivo] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState("");

    if (!alumno) return <div style={{ padding: "2rem" }}>No se encontró perfil de alumno.</div>;

    // Obtener faltas del alumno (estado "Falta")
    const faltas = asistencias.filter(a => a.alumno_id === alumno.id && a.estado === "Falta");
    const cursosConFaltas = [...new Set(faltas.map(f => f.curso_id))];
    const cursosList = cursos.filter(c => cursosConFaltas.includes(c.id));

    const handleSubmit = () => {
        if (!cursoSel || !fechaSel || !motivo) {
            setError("Todos los campos son obligatorios.");
            return;
        }
        // Aquí iría la llamada al backend para guardar la solicitud
        console.log({ alumno_id: alumno.id, curso_id: cursoSel, fecha: fechaSel, motivo });
        setEnviado(true);
        setTimeout(() => {
            setEnviado(false);
            setCursoSel("");
            setFechaSel("");
            setMotivo("");
        }, 3000);
    };

    const fechasDisponibles = faltas
        .filter(f => !cursoSel || f.curso_id === Number(cursoSel))
        .map(f => f.fecha);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Justificar falta</h2>
            <p>Selecciona la clase que faltaste y justifica tu inasistencia.</p>

            <Card>
                {cursosList.length === 0 ? (
                    <p>No tienes faltas registradas.</p>
                ) : (
                    <>
                        <div style={{ marginBottom: "1rem" }}>
                            <label>Curso</label>
                            <select
                                value={cursoSel}
                                onChange={e => setCursoSel(e.target.value)}
                                style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #ccc" }}
                            >
                                <option value="">-- Seleccionar curso --</option>
                                {cursosList.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label>Fecha de la falta</label>
                            <select
                                value={fechaSel}
                                onChange={e => setFechaSel(e.target.value)}
                                style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #ccc" }}
                                disabled={!cursoSel}
                            >
                                <option value="">-- Seleccionar fecha --</option>
                                {fechasDisponibles.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label>Motivo</label>
                            <textarea
                                value={motivo}
                                onChange={e => setMotivo(e.target.value)}
                                rows={3}
                                style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #ccc" }}
                                placeholder="Describe el motivo de tu falta"
                            />
                        </div>

                        {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
                        {enviado && <div style={{ color: "green", marginBottom: "1rem" }}>✓ Solicitud enviada correctamente.</div>}

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Btn onClick={handleSubmit} color="#b45309">Enviar solicitud</Btn>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}