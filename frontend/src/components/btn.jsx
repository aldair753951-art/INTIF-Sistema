export const Btn = ({ children, onClick, color = "#0f766e", outline = false, small = false, disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{
            background: outline ? "transparent" : color,
            color: outline ? color : "#fff",
            border: `1px solid ${color}`,
            borderRadius: "12px",
            padding: small ? "6px 14px" : "10px 20px",
            fontSize: small ? "12px" : "14px",
            fontWeight: 500,
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            opacity: disabled ? 0.6 : 1,
            boxShadow: outline ? "none" : "0 1px 2px rgba(0,0,0,0.05)"
        }}
        onMouseEnter={(e) => {
            if (!disabled && !outline) e.currentTarget.style.filter = "brightness(0.95)";
            if (!disabled && outline) e.currentTarget.style.background = color + "10";
        }}
        onMouseLeave={(e) => {
            if (!disabled && !outline) e.currentTarget.style.filter = "none";
            if (!disabled && outline) e.currentTarget.style.background = "transparent";
        }}
    >
        {children}
    </button>
);