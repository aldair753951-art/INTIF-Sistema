import React from 'react';
import { Card } from './index';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

export default function MiHorario({ usuario, alumnos, cursos, matriculas }) {
    const alumno = alumnos.find(a => a.usuario_id === usuario?.id);
    if (!alumno) return <div style={{ padding: "2rem" }}>No se encontró perfil de alumno.</div>;

    const misMatriculas = matriculas.filter(m => m.alumno_id === alumno.id);
    const misCursos = misMatriculas.map(m => cursos.find(c => c.id === m.curso_id)).filter(c => c);

    // Función para parsear horario "08:00-10:00"
    const parseHorario = (horario) => {
        if (!horario) return null;
        const [inicio, fin] = horario.split('-');
        return { inicio: inicio.trim(), fin: fin.trim() };
    };

    const getCursoEnHorario = (dia, hora) => {
        for (const curso of misCursos) {
            if (!curso.dias || !curso.horario) continue;
            const diasCurso = curso.dias.split('/');
            const horario = parseHorario(curso.horario);
            if (!horario) continue;
            if (diasCurso.includes(dia) && hora >= horario.inicio && hora < horario.fin) {
                return curso;
            }
        }
        return null;
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Mi Horario de Clases</h2>
            {misCursos.length === 0 ? (
                <p>No estás matriculado en ningún curso.</p>
            ) : (
                <Card style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                        <thead>
                            <tr style={{ background: "#0f766e", color: "white" }}>
                                <th style={{ padding: "12px" }}>Hora</th>
                                {diasSemana.map(dia => <th key={dia} style={{ padding: "12px" }}>{dia}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {horas.map(hora => (
                                <tr key={hora}>
                                    <td style={{ padding: "8px", border: "1px solid #e2e8f0", background: "#f8fafc", fontWeight: 600 }}>{hora}</td>
                                    {diasSemana.map(dia => {
                                        const curso = getCursoEnHorario(dia, hora);
                                        return (
                                            <td key={`${dia}-${hora}`} style={{
                                                padding: "8px",
                                                border: "1px solid #e2e8f0",
                                                background: curso ? "#dcfce7" : "transparent",
                                                color: curso ? "#166534" : "#64748b"
                                            }}>
                                                {curso ? (
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{curso.nombre}</div>
                                                        <div style={{ fontSize: 10 }}>{curso.horario}</div>
                                                    </div>
                                                ) : "—"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            )}
        </div>
    );
}