import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function GestionCursos() {
    const [cursos, setCursos] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modal, setModal] = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm] = useState({ nombre: "", docente_id: "", horario: "", dias: "", capacidad: 30 });
    const [filtro, setFiltro] = useState("");
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        cargarDatos();
    }, []);

const cargarDatos = async () => {
    try {
        const [cursosData, docentesData] = await Promise.all([
            api.getCursos(),
            api.getDocentes()
        ]);
        // Normalizar: si docente_id es null, undefined, o string no numérico, poner null
        const cursosNormalizados = (cursosData || []).map(c => {
            let docenteId = c.docente_id;
            if (docenteId === null || docenteId === undefined || docenteId === '') {
                docenteId = null;
            } else {
                const num = Number(docenteId);
                docenteId = isNaN(num) ? null : num;
            }
            return { ...c, docente_id: docenteId };
        });
        console.log("📚 Cursos normalizados:", cursosNormalizados);
        console.log("👨‍🏫 Docentes:", docentesData);
        setCursos(cursosNormalizados);
        setDocentes(docentesData || []);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        setCargando(false);
    }
};

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
        ...prev,
        [name]: name === "docente_id" ? (value === "" ? "" : Number(value)) : value
    }));
};

    const abrirModal = (curso = null) => {
        if (curso) {
            setEditando(curso);
            setForm({
                nombre: curso.nombre || "",
                docente_id: curso.docente_id === null || curso.docente_id === undefined ? "" : String(curso.docente_id),
                horario: curso.horario || "",
                dias: curso.dias || "",
                capacidad: curso.capacidad || 30
            });
        } else {
            setEditando(null);
            setForm({ nombre: "", docente_id: "", horario: "", dias: "", capacidad: 30 });
        }
        setModal(true);
        setError("");
    };

    const guardar = async () => {
        if (!form.nombre) {
            setError("El nombre del curso es obligatorio.");
            return;
        }
        try {
            const dataToSend = {
    nombre: form.nombre,
    docente_id: form.docente_id === "" ? null : Number(form.docente_id),
    horario: form.horario,
    dias: form.dias,
    capacidad: Number(form.capacidad)
};
            console.log("📤 Enviando datos al backend:", dataToSend);
            
            if (editando) {
                const resultado = await api.updateCurso(editando.id, dataToSend);
                console.log("Respuesta del backend:", resultado);
                setMsg("✅ Curso actualizado");
            } else {
                await api.createCurso(dataToSend);
                setMsg("✅ Curso creado");
            }
            await cargarDatos(); // Recarga la lista actualizada
            setModal(false);
            setTimeout(() => setMsg(""), 3000);
        } catch (error) {
            console.error("Error al guardar:", error);
            setError("Error: " + (error.message || "No se pudo guardar el curso"));
        }
    };

    const eliminar = async (id) => {
        if (!window.confirm("¿Eliminar este curso?")) return;
        try {
            await api.deleteCurso(id);
            await cargarDatos();
            setMsg("✅ Curso eliminado");
            setTimeout(() => setMsg(""), 3000);
        } catch (error) {
            setError("Error: " + error.message);
        }
    };

    const cursosFiltrados = cursos.filter(c =>
        !filtro || c.nombre?.toLowerCase().includes(filtro.toLowerCase())
    );

    if (cargando) return <div style={{ padding: "2rem" }}>⏳ Cargando cursos...</div>;

    return (
        <div style={{ padding: "2rem" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 22, color: "#1e293b" }}>📚 Gestión de Cursos</h2>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>{cursos.length} cursos registrados</p>
                </div>
                <button onClick={() => abrirModal()} style={{ background: "#0f766e", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>
                    + Nuevo curso
                </button>
            </div>

            {/* Mensajes */}
            {msg && <div style={{ background: "#dcfce7", color: "#16a34a", padding: "8px 12px", borderRadius: "8px", marginBottom: "1rem", fontSize: "13px" }}>{msg}</div>}

            {/* Buscador */}
            <input
                type="text"
                name="filtro"
                placeholder="🔍 Buscar curso..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", marginBottom: "1rem", boxSizing: "border-box" }}
            />

            {/* Lista de cursos */}
            {cursosFiltrados.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", background: "#f8fafc", borderRadius: "12px", color: "#64748b" }}>
                    No hay cursos registrados.
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
                    {cursosFiltrados.map(curso => {
                        // Buscar docente con conversión explícita de tipos
                        const docente = docentes.find(d => Number(d.id) === Number(curso.docente_id));
                        // Depuración: muestra en consola por qué no se encuentra
                        if (curso.docente_id && !docente) {
                            console.warn(`Curso "${curso.nombre}" tiene docente_id=${curso.docente_id} pero no se encontró en docentes`, docentes);
                        }
                        return (
                            <div key={curso.id} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1rem", background: "#fff" }}>
                                <h3 style={{ margin: "0 0 0.5rem", color: "#1e293b" }}>{curso.nombre}</h3>
                                <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>
                                    <div>👨‍🏫 Docente: <strong style={{ color: curso.docente_id ? "#0f766e" : "#dc2626" }}>{docente?.nombre || "Sin docente"}</strong></div>
                                    <div>⏰ Horario: {curso.horario || "No definido"}</div>
                                    <div>📅 Días: {curso.dias || "No definido"}</div>
                                    <div>👥 Capacidad: {curso.capacidad || 30} alumnos</div>
                                </div>
                                <div style={{ marginTop: "1rem", display: "flex", gap: "8px" }}>
                                    <button onClick={() => abrirModal(curso)} style={{ padding: "5px 12px", border: "1px solid #0f766e", background: "transparent", borderRadius: "6px", cursor: "pointer", color: "#0f766e", fontSize: "12px" }}>✏️ Editar</button>
                                    <button onClick={() => eliminar(curso.id)} style={{ padding: "5px 12px", border: "1px solid #dc2626", background: "transparent", borderRadius: "6px", cursor: "pointer", color: "#dc2626", fontSize: "12px" }}>🗑 Eliminar</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal para editar/crear curso */}
            {modal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", width: "90%", maxWidth: "450px" }}>
                        <h3 style={{ margin: "0 0 1rem 0", fontSize: "18px" }}>{editando ? "✏️ Editar curso" : "📚 Nuevo curso"}</h3>
                        <input type="text" name="nombre" placeholder="Nombre del curso *" value={form.nombre} onChange={handleInputChange} style={{ width: "100%", padding: "8px 12px", marginBottom: "0.8rem", border: "1px solid #ccc", borderRadius: "8px", fontSize: "13px", boxSizing: "border-box" }} />
                        <select
                            name="docente_id"
                            value={form.docente_id === "" ? "" : String(form.docente_id)}
                            onChange={handleInputChange}
                            style={{ width: "100%", padding: "8px 12px", marginBottom: "0.8rem", border: "1px solid #ccc", borderRadius: "8px", fontSize: "13px", boxSizing: "border-box" }}
                        >
                            <option value="">-- Seleccionar docente --</option>
                            {docentes.map(d => (
                                <option key={d.id} value={String(d.id)}>{d.nombre}</option>
                            ))}
                        </select>
                        <input type="text" name="horario" placeholder="Horario (ej: 08:00-10:00)" value={form.horario} onChange={handleInputChange} style={{ width: "100%", padding: "8px 12px", marginBottom: "0.8rem", border: "1px solid #ccc", borderRadius: "8px", fontSize: "13px", boxSizing: "border-box" }} />
                        <input type="text" name="dias" placeholder="Días (ej: Lun/Mié/Vie)" value={form.dias} onChange={handleInputChange} style={{ width: "100%", padding: "8px 12px", marginBottom: "0.8rem", border: "1px solid #ccc", borderRadius: "8px", fontSize: "13px", boxSizing: "border-box" }} />
                        <input type="number" name="capacidad" placeholder="Capacidad" value={form.capacidad} onChange={handleInputChange} style={{ width: "100%", padding: "8px 12px", marginBottom: "0.8rem", border: "1px solid #ccc", borderRadius: "8px", fontSize: "13px", boxSizing: "border-box" }} />
                        {error && <div style={{ color: "red", fontSize: "11px", marginBottom: "0.8rem" }}>{error}</div>}
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button onClick={() => setModal(false)} style={{ padding: "8px 16px", background: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>Cancelar</button>
                            <button onClick={guardar} style={{ padding: "8px 16px", background: "#0f766e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>{editando ? "Actualizar" : "Crear"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}