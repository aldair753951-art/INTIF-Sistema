export const Btn = ({ children, onClick, color = "#1e40af", outline = false, small = false, disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{
            background: outline ? "transparent" : color,
            color: outline ? color : "#fff",
            border: `1.5px solid ${color}`,
            borderRadius: 8,
            padding: small ? "4px 12px" : "8px 18px",
            fontSize: small ? 12 : 14,
            cursor: disabled ? "not-allowed" : "pointer",
            fontWeight: 600,
            opacity: disabled ? 0.5 : 1,
            transition: "all 0.15s"
        }}
    >
        {children}
    </button>
);