export const Card = ({ children, style = {} }) => (
    <div style={{
        background: "#fff",
        borderRadius: "20px",
        border: "1px solid #eef2f6",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
        padding: "1.5rem",
        transition: "box-shadow 0.2s",
        ...style
    }}>
        {children}
    </div>
);