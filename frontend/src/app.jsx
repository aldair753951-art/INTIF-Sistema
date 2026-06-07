import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import { api } from './services/api';

// Importar componentes
import DashboardAdmin from './components/DashboardAdmin';
import DashboardDocente from './components/DashboardDocente';
import DashboardAlumno from './components/DashboardAlumno';
import RegistrarAsistencia from './components/RegistrarAsistencia';
import GestionAlumnos from './components/GestionAlumnos';
import GestionDocentes from './components/GestionDocentes';
import GestionCursos from './components/GestionCursos';
import GestionMatriculas from './components/GestionMatriculas';
import GestionUsuarios from './components/GestionUsuarios';
import Reportes from './components/Reportes';
import AsistenciasGlobales from './components/AsistenciasGlobales';
import MiAsistencia from './components/MiAsistencia';
import MisCursos from './components/MisCursos';
import MiHorario from './components/MiHorario';
import MisNotas from './components/MisNotas';
import SolicitarRecuperacion from './components/SolicitarRecuperacion';
import SolicitudesRecuperacion from './components/SolicitudesRecuperacion';
import Configuracion from './components/Configuracion';

export default function App() {
    const [usuario, setUsuario] = useState(null);
    const [vista, setVista] = useState("dashboard");
    const [alumnos, setAlumnos] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [matriculas, setMatriculas] = useState([]);
    const [asistencias, setAsistencias] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            if (!usuario) return;
            try {
                const cursosData = await api.getCursos();
                setCursos(cursosData || []);
                
                if (usuario.rol === 'administrativo') {
                    const [alumnosData, docentesData, matriculasData, asistenciasData] = await Promise.all([
                        api.getAlumnos().catch(() => []),
                        api.getDocentes().catch(() => []),
                        api.getMatriculas().catch(() => []),
                        api.getAsistencias().catch(() => [])
                    ]);
                    setAlumnos(Array.isArray(alumnosData) ? alumnosData : []);
                    setDocentes(Array.isArray(docentesData) ? docentesData : []);
                    setMatriculas(Array.isArray(matriculasData) ? matriculasData : []);
                    setAsistencias(Array.isArray(asistenciasData) ? asistenciasData : []);
                } else {
                    // Para docente y alumno, intentamos cargar datos pero si fallan (403) usamos arrays vacíos
                    const [alumnosData, matriculasData, asistenciasData] = await Promise.all([
                        api.getAlumnos().catch(() => []),
                        api.getMatriculas().catch(() => []),
                        api.getAsistencias().catch(() => [])
                    ]);
                    setAlumnos(Array.isArray(alumnosData) ? alumnosData : []);
                    setMatriculas(Array.isArray(matriculasData) ? matriculasData : []);
                    setAsistencias(Array.isArray(asistenciasData) ? asistenciasData : []);
                    setDocentes([]);
                }
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        cargarDatos();
    }, [usuario]);

    const handleLogin = (user) => {
        setUsuario(user);
        setVista("dashboard");
    };

    const handleLogout = () => {
        setUsuario(null);
        setVista("dashboard");
        setAlumnos([]);
        setDocentes([]);
        setCursos([]);
        setMatriculas([]);
        setAsistencias([]);
    };

    const renderVista = () => {
        const db = {
            alumnos: Array.isArray(alumnos) ? alumnos : [],
            setAlumnos,
            docentes: Array.isArray(docentes) ? docentes : [],
            setDocentes,
            cursos: Array.isArray(cursos) ? cursos : [],
            setCursos,
            matriculas: Array.isArray(matriculas) ? matriculas : [],
            setMatriculas,
            asistencias: Array.isArray(asistencias) ? asistencias : [],
            setAsistencias,
            usuario
        };

        if (vista === "dashboard") {
            if (usuario?.rol === "docente") return <DashboardDocente {...db} />;
            if (usuario?.rol === "administrativo") return <DashboardAdmin {...db} />;
            return <DashboardAlumno {...db} />;
        }

        switch (vista) {
            case "asistencia": return <RegistrarAsistencia {...db} />;
            case "asistencias": return <AsistenciasGlobales {...db} />;
            case "reportes": return <Reportes {...db} />;
            case "mi-asistencia": return <MiAsistencia {...db} />;
            case "mis-cursos": return <MisCursos {...db} />;
            case "mi-horario": return <MiHorario {...db} />;
            case "mis-notas": return <MisNotas {...db} />;
            case "solicitar-recuperacion": return <SolicitarRecuperacion {...db} />;
            case "solicitudes": return <SolicitudesRecuperacion {...db} />;
            case "configuracion": return <Configuracion {...db} />;
            case "usuarios": return <GestionUsuarios />;
            case "alumnos": return <GestionAlumnos {...db} />;
            case "docentes": return <GestionDocentes {...db} />;
            case "cursos": return <GestionCursos />;
            case "matriculas": return <GestionMatriculas />;
            default: return <DashboardAdmin {...db} />;
        }
    };

    if (!usuario) return <Login onLogin={handleLogin} />;

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f8fafc" }}>
            <Sidebar usuario={usuario} vista={vista} setVista={setVista} onLogout={handleLogout} />
            <main style={{ flex: 1, overflowY: "auto" }}>
                {renderVista()}
            </main>
        </div>
    );
}