import React from 'react';
import { api } from '../services/api';

// Menús por cada rol
const menusPorRol = {
    // 👩‍💼 ADMINISTRATIVO - Control total
    administrativo: [
        { id: "dashboard", label: "Dashboard", icon: "🏠", description: "Panel principal" },
        { id: "alumnos", label: "👥 Alumnos", icon: "👥", description: "Gestionar estudiantes" },
        { id: "docentes", label: "👨‍🏫 Docentes", icon: "👨‍🏫", description: "Gestionar profesores" },
        { id: "cursos", label: "Cursos", icon: "📚", description: "Gestionar cursos" },
        { id: "matriculas", label: "📋 Matrículas", icon: "📋", description: "Gestionar inscripciones" },
        { id: "usuarios", label: "🔐 Usuarios", icon: "🔐", description: "Gestionar cuentas" },
        { id: "asistencias", label: "✅ Asistencias", icon: "✅", description: "Ver todas las asistencias" },
        { id: "reportes", label: "📊 Reportes", icon: "📊", description: "Estadísticas globales" },
        { id: "configuracion", label: "⚙️ Configuración", icon: "⚙️", description: "Ajustes del sistema" }
    ],
    
    // 👨‍🏫 DOCENTE - Solo sus cursos
    docente: [
        { id: "dashboard", label: "Dashboard", icon: "🏠", description: "Panel de control" },
        { id: "mis-cursos", label: "📚 Mis Cursos", icon: "📚", description: "Cursos asignados" },
        { id: "asistencia", label: "✅ Registrar Asistencia", icon: "✅", description: "Marcar asistencia" },
        { id: "solicitudes", label: "📩 Solicitudes", icon: "📩", description: "Justificaciones pendientes" },
        { id: "reportes", label: "📊 Mis Reportes", icon: "📊", description: "Estadísticas por curso" }
    ],
    
    // 👩‍🎓 ALUMNO - Solo su información
    alumno: [
        { id: "dashboard", label: "Mi Perfil", icon: "🏠", description: "Información personal" },
        { id: "mis-cursos", label: "📚 Mis Cursos", icon: "📚", description: "Cursos matriculados" },
        { id: "mi-horario", label: "🗓️ Mi Horario", icon: "🗓️", description: "Horario de clases" },
        { id: "mi-asistencia", label: "📅 Mi Asistencia", icon: "📅", description: "Historial de asistencia" },
        { id: "solicitar-recuperacion", label: "📩 Justificar Falta", icon: "📩", description: "Solicitar recuperación" },
        { id: "mis-notas", label: "📝 Mis Notas", icon: "📝", description: "Calificaciones" }
    ]
};

// Colores por rol
const coloresRol = {
    docente: { principal: "#7c3aed", hover: "#6d28d9", light: "#ede9fe" },
    administrativo: { principal: "#0f766e", hover: "#0d5a54", light: "#ccfbf1" },
    alumno: { principal: "#b45309", hover: "#9a4208", light: "#ffedd5" }
};

// Badge de notificaciones (opcional)
const Badge = ({ count }) => {
    if (!count || count === 0) return null;
    return (
        <span style={{
            background: "#ef4444",
            color: "#fff",
            fontSize: 10,
            fontWeight: "bold",
            borderRadius: "50%",
            width: 18,
            height: 18,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto"
        }}>
            {count > 9 ? "9+" : count}
        </span>
    );
};

export default function Sidebar({ usuario, vista, setVista, onLogout }) {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const color = coloresRol[usuario.rol] || coloresRol.administrativo;
    const menus = menusPorRol[usuario.rol] || [];
    
    // Obtener iniciales del nombre
    const iniciales = usuario.nombre
        .split(" ")
        .map(n => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = () => {
        api.logout();
        onLogout();
    };

    return (
        <div style={{
            width: isCollapsed ? 80 : 260,
            background: "#0f172a",
            color: "#e2e8f0",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            transition: "width 0.2s ease",
            overflow: "hidden",
            boxShadow: "4px 0 10px rgba(0,0,0,0.1)"
        }}>
            {/* Header con logo y toggle */}
            <div style={{
                padding: isCollapsed ? "1rem 0" : "1.5rem",
                borderBottom: "1px solid #334155",
                display: "flex",
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "space-between"
            }}>
                {!isCollapsed && (
                    <div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>INTIF</div>
                        <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>Sistema de Gestión v3.0</div>
                    </div>
                )}
                {isCollapsed && (
                    <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>I</div>
                )}
                <button
                    onClick={toggleSidebar}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        fontSize: 16,
                        padding: 4
                    }}
                >
                    {isCollapsed ? "→" : "←"}
                </button>
            </div>

            {/* Perfil del usuario */}
            <div style={{
                padding: isCollapsed ? "1rem 0" : "1rem 1.25rem",
                borderBottom: "1px solid #334155",
                display: "flex",
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "flex-start",
                gap: isCollapsed ? 0 : 12
            }}>
                <div style={{
                    width: isCollapsed ? 44 : 44,
                    height: isCollapsed ? 44 : 44,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${color.principal}, ${color.hover})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0
                }}>
                    {iniciales}
                </div>
                {!isCollapsed && (
                    <div style={{ overflow: "hidden" }}>
                        <div style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#f1f5f9",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                            {usuario.nombre}
                        </div>
                        <div style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            textTransform: "capitalize",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 2
                        }}>
                            <span style={{
                                display: "inline-block",
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: color.principal,
                                boxShadow: `0 0 5px ${color.principal}`
                            }} />
                            {usuario.rol === "administrativo" ? "Administrador" : usuario.rol}
                        </div>
                    </div>
                )}
            </div>

            {/* Menú de navegación */}
            <nav style={{ flex: 1, padding: isCollapsed ? "0.5rem" : "0.75rem", overflowY: "auto" }}>
                {menus.map((item, index) => (
                    <button
                        key={item.id}
                        onClick={() => setVista(item.id)}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: isCollapsed ? "center" : "flex-start",
                            gap: isCollapsed ? 0 : 12,
                            padding: isCollapsed ? "12px 0" : "10px 14px",
                            borderRadius: 10,
                            border: "none",
                            cursor: "pointer",
                            background: vista === item.id ? color.principal : "transparent",
                            color: vista === item.id ? "#fff" : "#94a3b8",
                            fontSize: 13,
                            fontWeight: vista === item.id ? 600 : 400,
                            marginBottom: 4,
                            textAlign: "left",
                            transition: "all 0.15s",
                            position: "relative"
                        }}
                        onMouseEnter={(e) => {
                            if (vista !== item.id && !isCollapsed) {
                                e.currentTarget.style.background = "#1e293b";
                                e.currentTarget.style.color = "#e2e8f0";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (vista !== item.id && !isCollapsed) {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "#94a3b8";
                            }
                        }}
                        title={isCollapsed ? item.label : ""}
                    >
                        <span style={{ fontSize: 18 }}>{item.icon}</span>
                        {!isCollapsed && (
                            <>
                                <span style={{ flex: 1 }}>{item.label}</span>
                                {/* Tooltip opcional con descripción al hacer hover */}
                                <span style={{
                                    fontSize: 10,
                                    color: "#64748b",
                                    opacity: 0,
                                    transition: "opacity 0.15s",
                                    position: "absolute",
                                    right: 10
                                }}>
                                    {item.description}
                                </span>
                            </>
                        )}
                    </button>
                ))}
            </nav>

            {/* Footer con botón de logout */}
            <div style={{ padding: isCollapsed ? "0.75rem" : "1rem", borderTop: "1px solid #334155" }}>
                <button
                    onClick={handleLogout}
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        gap: isCollapsed ? 0 : 12,
                        padding: isCollapsed ? "10px 0" : "10px 14px",
                        background: "transparent",
                        border: "1px solid #334155",
                        borderRadius: 10,
                        color: "#f87171",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 500,
                        transition: "all 0.15s"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#7f1d1d20";
                        e.currentTarget.style.borderColor = "#f87171";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "#334155";
                    }}
                >
                    <span style={{ fontSize: 16 }}>🚪</span>
                    {!isCollapsed && <span>Cerrar sesión</span>}
                </button>
                
                {/* Versión del sistema */}
                {!isCollapsed && (
                    <div style={{
                        fontSize: 10,
                        color: "#475569",
                        textAlign: "center",
                        marginTop: 12,
                        paddingTop: 8,
                        borderTop: "1px solid #334155"
                    }}>
                        INTIF v3.0.0<br />
                        © 2026 - Todos los derechos reservados
                    </div>
                )}
            </div>
        </div>
    );
}