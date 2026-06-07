export const Modal = ({ title, children, onClose }) => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "2rem", minWidth: 380, maxWidth: 520, width: "90%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: 0, fontSize: 18, color: "#1e293b" }}>{title}</h3>
                <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 22, cursor: "pointer" }}>×</button>
            </div>
            {children}
        </div>
    </div>
);