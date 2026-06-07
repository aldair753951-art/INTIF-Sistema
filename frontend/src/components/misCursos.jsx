import React from 'react';
import { Card } from './index';

export default function MisCursos({ usuario, alumnos, cursos, matriculas }) {
    const alumno = alumnos.find(a => a.usuario_id === usuario?.id);
    if (!alumno) return <div style={{ padding: "2rem" }}>No se encontró perfil de alumno.</div>;

    const misMatriculas = matriculas.filter(m => m.alumno_id === alumno.id);
    const misCursos = misMatriculas.map(m => cursos.find(c => c.id === m.curso_id)).filter(c => c);

    return (
        <div style={{ padding: "2rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>📚 Mis cursos</h2>
            {misCursos.length === 0 ? (
                <p>No estás matriculado en ningún curso.</p>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
                    {misCursos.map(curso => (
                        <Card key={curso.id}>
                            <h3>{curso.nombre}</h3>
                            <p>Horario: {curso.horario} · {curso.dias}</p>
                            <p>Capacidad: {curso.capacidad} alumnos</p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}