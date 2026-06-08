export const StatCard = ({ label, value, icon, color = "#0f766e" }) => (
    <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "1.25rem",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        transition: "transform 0.2s",
        cursor: "default"
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
        <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{icon}</div>
        <div style={{ fontSize: "1.8rem", fontWeight: "bold", color }}>{value}</div>
        <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>{label}</div>
    </div>
);