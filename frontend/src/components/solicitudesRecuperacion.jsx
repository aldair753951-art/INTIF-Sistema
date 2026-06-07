import React, { useState, useEffect } from 'react';
import { Card, Btn } from './index';
// import { api } from '../services/api'; // Descomentar cuando exista el backend de solicitudes

export default function SolicitudesRecuperacion() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [filtro, setFiltro] = useState("todos");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarSolicitudes();
    }, []);

    const cargarSolicitudes = async () => {
        setCargando(true);
        try {
            // 🔁 Aquí se conectará con el backend real cuando exista el endpoint
            // const data = await api.getSolicitudesRecuperacion();
            // setSolicitudes(data);
            
            // Por ahora, inicializamos con array vacío (sin datos falsos)
            setSolicitudes([]);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    const aprobar = async (id) => {
        try {
            // await api.aprobarSolicitud(id);
            setSolicitudes(prev => prev.map(s =>
                s.id === id ? { ...s, estado: "aprobada" } : s
            ));
        } catch (err) {
            console.error("Error al aprobar:", err);
        }
    };

    const rechazar = async (id) => {
        try {
            // await api.rechazarSolicitud(id);
            setSolicitudes(prev => prev.map(s =>
                s.id === id ? { ...s, estado: "rechazada" } : s
            ));
        } catch (err) {
            console.error("Error al rechazar:", err);
        }
    };

    const solicitudesFiltradas = solicitudes.filter(s =>
        filtro === "todos" || s.estado === filtro
    );

    const getEstadoBadge = (estado) => {
        const config = {
            pendiente: { color: "#d97706", bg: "#fef3c7", label: "⏳ Pendiente" },
            aprobada: { color: "#16a34a", bg: "#dcfce7", label: "✅ Aprobada" },
            rechazada: { color: "#dc2626", bg: "#fee2e2", label: "❌ Rechazada" }
        };
        const c = config[estado];
        return (
            <span style={{
                background: c.bg,
                color: c.color,
                padding: "2px 10px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600
            }}>
                {c.label}
            </span>
        );
    };

    if (cargando) return <div style={{ padding: "2rem" }}>⏳ Cargando solicitudes...</div>;
    if (error) return <div style={{ padding: "2rem", color: "red" }}>❌ Error: {error}</div>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2 style={{ margin: "0 0 0.5rem", fontSize: 22, color: "#1e293b" }}>Solicitudes de recuperación</h2>
            <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
                Revisa y aprueba las justificaciones de los alumnos.
            </p>

            {/* Filtros */}
            <Card style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["todos", "pendiente", "aprobada", "rechazada"].map(estado => (
                        <Btn
                            key={estado}
                            onClick={() => setFiltro(estado)}
                            small
                            color="#7c3aed"
                            outline={filtro !== estado}
                        >
                            {estado === "todos" ? "📋 Todos" : estado === "pendiente" ? "⏳ Pendientes" : estado === "aprobada" ? "✅ Aprobadas" : "❌ Rechazadas"}
                        </Btn>
                    ))}
                </div>
            </Card>

            {/* Lista de solicitudes */}
            <Card>
                {solicitudesFiltradas.length === 0 ? (
                    <p style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                        No hay solicitudes de recuperación.
                    </p>
                ) : (
                    solicitudesFiltradas.map(s => (
                        <div
                            key={s.id}
                            style={{
                                borderBottom: "1px solid #f1f5f9",
                                padding: "1rem",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "1rem"
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 600, marginBottom: 4 }}>{s.alumno}</div>
                                <div style={{ fontSize: 13, color: "#64748b" }}>
                                    {s.curso} - {s.fecha}
                                </div>
                                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                                    Motivo: {s.motivo}
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                {getEstadoBadge(s.estado)}
                                {s.estado === "pendiente" && (
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <Btn onClick={() => aprobar(s.id)} small color="#16a34a">
                                            ✓ Aprobar
                                        </Btn>
                                        <Btn onClick={() => rechazar(s.id)} small color="#dc2626">
                                            ✗ Rechazar
                                        </Btn>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </Card>
        </div>
    );
}