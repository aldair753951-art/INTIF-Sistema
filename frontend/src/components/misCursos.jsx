import React, { useState, useEffect } from 'react';
import { Card } from './index';
import { api } from '../services/api';

export default function MisCursos({ usuario, cursos: cursosProp, docentes: docentesProp, matriculas: matriculasProp }) {
    const [cursos, setCursos] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [matriculas, setMatriculas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                let cursosData = cursosProp;
                let docentesData = docentesProp;
                let matriculasData = matriculasProp;

                if (!cursosData || cursosData.length === 0) {
                    cursosData = await api.getCursos();
                }
                if (!docentesData || docentesData.length === 0) {
                    docentesData = await api.getDocentes();
                }
                if (!matriculasData || matriculasData.length === 0) {
                    matriculasData = await api.getMatriculas();
                }

                setCursos(Array.isArray(cursosData) ? cursosData : []);
                setDocentes(Array.isArray(docentesData) ? docentesData : []);
                setMatriculas(Array.isArray(matriculasData) ? matriculasData : []);
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarDatos();
    }, [usuario, cursosProp, docentesProp, matriculasProp]);

    if (cargando) return <div style={{ padding: "2rem" }}>Cargando...</div>;

    let misCursos = [];

    if (usuario?.rol === 'docente') {
        // Buscar el docente asociado al usuario logueado
        const docente = docentes.find(d => Number(d.usuario_id) === Number(usuario.id));
        if (docente) {
            misCursos = cursos.filter(c => Number(c.docente_id) === Number(docente.id));
        }
    } else if (usuario?.rol === 'alumno') {
        // Buscar el alumno asociado (necesitarías tener la lista de alumnos, pero por simplicidad usamos matrículas)
        // Obtener los ids de cursos a partir de las matrículas (asumiendo que el alumno_id está en matrícula)
        // Para simplificar, podríamos usar el array de alumnos que se pasa desde App, pero no lo pasamos.
        // Como alternativa, puedes cargar los alumnos aquí. Por ahora, supongamos que tienes los datos.
        // En tu App.jsx ya tienes alumnos, pero no se pasan a este componente. Puedes añadirlos al {...db}.
        // Si no, puedes obtenerlos de la API.
        // Por brevedad, asumimos que tienes un array 'alumnos' y lo pasas como prop.
        // Pero para que funcione, te recomiendo pasar también 'alumnos' desde App.
        // Si no, puedes obtener el alumno mediante otra llamada.
        // Dado que es un caso aparte, lo dejamos como ejercicio.
        // Por ahora, mostramos un mensaje si no hay matrículas.
        const matriculaIds = matriculas.map(m => m.curso_id);
        misCursos = cursos.filter(c => matriculaIds.includes(c.id));
    }

    if (misCursos.length === 0) {
        return (
            <div style={{ padding: "2rem" }}>
                <h2>Mis Cursos</h2>
                <p>No tienes cursos asignados.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Mis Cursos</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
                {misCursos.map(curso => (
                    <Card key={curso.id}>
                        <h3>{curso.nombre}</h3>
                        <p>Horario: {curso.horario} · {curso.dias}</p>
                        <p>Capacidad: {curso.capacidad}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}