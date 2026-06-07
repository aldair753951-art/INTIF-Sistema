export const StatCard = ({ label, value, color = "#1e40af", icon }) => (
    <div style={{
        background: "#f8fafc",
        borderRadius: 10,
        padding: "1rem 1.25rem",
        border: "1px solid #e2e8f0",
        textAlign: "center"
    }}>
        <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{label}</div>
    </div>
);