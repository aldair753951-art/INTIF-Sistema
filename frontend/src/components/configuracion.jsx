import React, { useState } from 'react';
import { Card, Btn } from './index';

export default function Configuracion() {
    const [periodo, setPeriodo] = useState("2026-1");
    const [horarioInicio, setHorarioInicio] = useState("07:00");
    const [horarioFin, setHorarioFin] = useState("22:00");
    const [tolerancia, setTolerancia] = useState(15);
    const [guardado, setGuardado] = useState(false);

    const guardarConfiguracion = () => {
        setGuardado(true);
        setTimeout(() => setGuardado(false), 3000);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2 style={{ margin: "0 0 0.5rem", fontSize: 22, color: "#1e293b" }}>Configuración del sistema</h2>
            <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>Parámetros generales del instituto.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem" }}>
                <Card>
                    <h3 style={{ margin: "0 0 1rem", fontSize: 16, color: "#1e293b" }}>📅 Período académico</h3>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Año y semestre</label>
                        <select value={periodo} onChange={e => setPeriodo(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14 }}>
                            <option value="2025-2">2025 - Segundo semestre</option>
                            <option value="2026-1">2026 - Primer semestre</option>
                            <option value="2026-2">2026 - Segundo semestre</option>
                        </select>
                    </div>
                </Card>

                <Card>
                    <h3 style={{ margin: "0 0 1rem", fontSize: 16, color: "#1e293b" }}>⏰ Horario académico</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Hora de inicio</label>
                            <input type="time" value={horarioInicio} onChange={e => setHorarioInicio(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14 }} />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Hora de fin</label>
                            <input type="time" value={horarioFin} onChange={e => setHorarioFin(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14 }} />
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Tolerancia para tardanza (minutos)</label>
                        <input type="number" value={tolerancia} onChange={e => setTolerancia(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14 }} />
                    </div>
                </Card>

                <Card>
                    <h3 style={{ margin: "0 0 1rem", fontSize: 16, color: "#1e293b" }} about="Acerca del sistema">ℹ️ Acerca del sistema</h3>
                    <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                        <p><strong>INTIF - Sistema de Gestión de Asistencia</strong></p>
                        <p>Versión: 3.0.0</p>
                        <p>Desarrollado por: Proyecto Integrador I</p>
                        <p>Universidad Tecnológica del Perú - 2026</p>
                    </div>
                </Card>
            </div>

            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
                {guardado && <span style={{ color: "#16a34a", marginRight: "1rem" }}>✓ Configuración guardada</span>}
                <Btn onClick={guardarConfiguracion} color="#0f766e">💾 Guardar configuración</Btn>
            </div>
        </div>
    );
}