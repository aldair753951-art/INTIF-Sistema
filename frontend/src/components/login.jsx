import React, { useState } from 'react';
import { api } from '../services/api';

const coloresRol = { docente: "#7c3aed", administrativo: "#0f766e", alumno: "#b45309" };

export default function Login({ onLogin }) {
    const [rol, setRol] = useState("docente");
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const credencialesDemo = {
        docente: "juan/ docentejuan",
        administrativo: "admin / admin123",
        alumno: "armando / alumnoarmando",
    };

    const handleLogin = async () => {
    setCargando(true);
    setError("");
    try {
        const response = await api.login(usuario, contrasena, rol);
        if (response.usuario) {
            onLogin(response.usuario);
        } else {
            setError("Credenciales inválidas");
        }
    } catch (err) {
        setError(err.message || "Error de conexión con el servidor");
    } finally {
        setCargando(false);
    }
};
    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
            <div style={{ display: "flex", gap: 0, borderRadius: 20, overflow: "hidden", boxShadow: "0 25px 80px rgba(0,0,0,0.4)", maxWidth: 800, width: "95%" }}>
                <div style={{ background: "rgba(255,255,255,0.08)", padding: "3rem 2.5rem", flex: 1, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>INTIF</div>
                    <div style={{ fontSize: 14, opacity: 0.8, marginBottom: "2rem" }}>Instituto Técnico Isabel Flores</div>
                    {["Gestión académica integral", "Control de asistencias en tiempo real", "Plataforma segura y confiable", "Módulo de matrícula digital", "Reportes PDF y Excel"].map(t => (
                        <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, fontSize: 13, opacity: 0.85 }}>
                            <span style={{ color: "#a78bfa" }}>✓</span> {t}
                        </div>
                    ))}
                    <div style={{ marginTop: "2rem", background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "1rem", fontSize: 11, opacity: 0.7 }}>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>Guia de usuario y contraseñas:</div>
                        {Object.entries(credencialesDemo).map(([r, c]) => (
                            <div key={r}><strong>{r}:</strong> {c}</div>
                        ))}
                    </div>
                </div>
                <div style={{ background: "#fff", padding: "3rem 2.5rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h2 style={{ margin: "0 0 0.25rem", fontSize: 24, color: "#1e293b" }}>Iniciar sesión</h2>
                    <p style={{ margin: "0 0 1.75rem", fontSize: 13, color: "#64748b" }}>Selecciona tu rol e ingresa tus credenciales</p>
                    <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
                        {["docente", "administrativo", "alumno"].map(r => (
                            <button key={r} onClick={() => { setRol(r); setError(""); }} style={{
                                flex: 1, padding: "8px 4px", borderRadius: 8, border: "2px solid",
                                borderColor: rol === r ? coloresRol[r] : "#e2e8f0",
                                background: rol === r ? coloresRol[r] : "#f8fafc",
                                color: rol === r ? "#fff" : "#64748b",
                                fontSize: 11, fontWeight: 600, cursor: "pointer", textTransform: "capitalize"
                            }}>
                                {r === "docente" ? "👨‍🏫" : r === "administrativo" ? "👩‍💼" : "👩‍🎓"} {r.charAt(0).toUpperCase() + r.slice(1)}
                            </button>
                        ))}
                    </div>
                    <input type="text" placeholder="Usuario" value={usuario} onChange={e => setUsuario(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "1rem", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14 }} />
                    <input type="password" placeholder="Contraseña" value={contrasena} onChange={e => setContrasena(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "1rem", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14 }} />
                    {error && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px", borderRadius: 8, fontSize: 12, marginBottom: "1rem" }}>{error}</div>}
                    <button onClick={handleLogin} disabled={cargando} style={{ width: "100%", padding: "12px", background: coloresRol[rol], color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                        {cargando ? "Verificando..." : "Ingresar al Sistema"}
                    </button>
                </div>
            </div>
        </div>
    );
}