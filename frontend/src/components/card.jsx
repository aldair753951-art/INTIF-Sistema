export const Card = ({ children, style = {} }) => (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "1.25rem", ...style }}>
        {children}
    </div>
);