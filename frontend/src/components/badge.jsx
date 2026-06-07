const colorEstado = {
    "Asistió": "#16a34a",
    "Falta": "#dc2626",
    "Tardanza": "#d97706",
    "Justificado": "#2563eb",
    "Activo": "#16a34a",
    "Inactivo": "#94a3b8"
};

const bgEstado = {
    "Asistió": "#dcfce7",
    "Falta": "#fee2e2",
    "Tardanza": "#fef3c7",
    "Justificado": "#dbeafe",
    "Activo": "#dcfce7",
    "Inactivo": "#f1f5f9"
};

export const Badge = ({ estado }) => (
    <span style={{
        background: bgEstado[estado] || "#f3f4f6",
        color: colorEstado[estado] || "#374151",
        padding: "2px 10px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        display: "inline-block"
    }}>
        {estado}
    </span>
);