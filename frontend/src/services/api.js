const API_URL = 'http://localhost:5001/api';

let authToken = null;

export const setAuthToken = (token) => {
    authToken = token;
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
};

export const getAuthToken = () => {
    return authToken || localStorage.getItem('token');
};

const fetchWithAuth = async (url, options = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
        throw new Error('Sesión expirada');
    }
    
    return response;
};

export const api = {
    // ============ AUTENTICACIÓN ============
    async login(usuario, contrasena, rol) {
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, contrasena, rol })
        });
        const data = await response.json();
        if (response.ok && data.token) {
            setAuthToken(data.token);
        }
        if (!response.ok) throw new Error(data.mensaje || 'Error de login');
        return data;
    },

    logout() {
        setAuthToken(null);
    },

    // ============ ALUMNOS ============
    async getAlumnos() {
        const response = await fetchWithAuth(`${API_URL}/alumnos`);
        return response.json();
    },
    async getAlumno(id) {
        const response = await fetchWithAuth(`${API_URL}/alumnos/${id}`);
        return response.json();
    },
    async createAlumno(data) {
        const response = await fetchWithAuth(`${API_URL}/alumnos`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return response.json();
    },
    async updateAlumno(id, data) {
        const response = await fetchWithAuth(`${API_URL}/alumnos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return response.json();
    },
    async deleteAlumno(id) {
        const response = await fetchWithAuth(`${API_URL}/alumnos/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    },

    // ============ DOCENTES ============
    async getDocentes() {
        const response = await fetchWithAuth(`${API_URL}/docentes`);
        return response.json();
    },
    async getDocente(id) {
        const response = await fetchWithAuth(`${API_URL}/docentes/${id}`);
        return response.json();
    },
    async createDocente(data) {
        const response = await fetchWithAuth(`${API_URL}/docentes`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return response.json();
    },
    async updateDocente(id, data) {
        const response = await fetchWithAuth(`${API_URL}/docentes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return response.json();
    },
    async deleteDocente(id) {
        const response = await fetchWithAuth(`${API_URL}/docentes/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    },

    // ============ CURSOS ============
    async getCursos() {
        const response = await fetchWithAuth(`${API_URL}/cursos`);
        return response.json();
    },
    async getCurso(id) {
        const response = await fetchWithAuth(`${API_URL}/cursos/${id}`);
        return response.json();
    },
    async createCurso(data) {
        const response = await fetchWithAuth(`${API_URL}/cursos`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return response.json();
    },
    async updateCurso(id, data) {
        const response = await fetchWithAuth(`${API_URL}/cursos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return response.json();
    },
    async deleteCurso(id) {
        const response = await fetchWithAuth(`${API_URL}/cursos/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    },

    // ============ ASISTENCIAS ============
    async getAsistencias() {
        const response = await fetchWithAuth(`${API_URL}/asistencias`);
        return response.json();
    },
    async getAsistenciasByAlumno(alumnoId) {
        const response = await fetchWithAuth(`${API_URL}/asistencias/alumno/${alumnoId}`);
        return response.json();
    },
    async getAsistenciasByCurso(cursoId) {
        const response = await fetchWithAuth(`${API_URL}/asistencias/curso/${cursoId}`);
        return response.json();
    },
    async registrarAsistencias(asistencias) {
        const response = await fetchWithAuth(`${API_URL}/asistencias/batch`, {
            method: 'POST',
            body: JSON.stringify({ asistencias })
        });
        return response.json();
    },
    async updateAsistencia(id, data) {
        const response = await fetchWithAuth(`${API_URL}/asistencias/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return response.json();
    },
    async deleteAsistencia(id) {
        const response = await fetchWithAuth(`${API_URL}/asistencias/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    },

    // ============ MATRÍCULAS ============
    async getMatriculas() {
        const response = await fetchWithAuth(`${API_URL}/matriculas`);
        return response.json();
    },
    async getMatricula(id) {
        const response = await fetchWithAuth(`${API_URL}/matriculas/${id}`);
        return response.json();
    },
    async getMatriculasByAlumno(alumnoId) {
        const response = await fetchWithAuth(`${API_URL}/matriculas/alumno/${alumnoId}`);
        return response.json();
    },
    async getMatriculasByCurso(cursoId) {
        const response = await fetchWithAuth(`${API_URL}/matriculas/curso/${cursoId}`);
        return response.json();
    },
    async createMatricula(data) {
        const response = await fetchWithAuth(`${API_URL}/matriculas`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return response.json();
    },
    async updateMatricula(id, data) {
        const response = await fetchWithAuth(`${API_URL}/matriculas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return response.json();
    },
    async darBajaMatricula(id) {
        const response = await fetchWithAuth(`${API_URL}/matriculas/${id}/baja`, {
            method: 'PUT'
        });
        return response.json();
    },
    async deleteMatricula(id) {
        const response = await fetchWithAuth(`${API_URL}/matriculas/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    },

    // ============ USUARIOS ============
    async getUsuarios() {
        const response = await fetchWithAuth(`${API_URL}/usuarios`);
        return response.json();
    },
    async getUsuario(id) {
        const response = await fetchWithAuth(`${API_URL}/usuarios/${id}`);
        return response.json();
    },
    async createUsuario(data) {
        const response = await fetchWithAuth(`${API_URL}/usuarios`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return response.json();
    },
    async updateUsuario(id, data) {
        const response = await fetchWithAuth(`${API_URL}/usuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return response.json();
    },
    async deleteUsuario(id) {
        const response = await fetchWithAuth(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    },

    // ============ REPORTES ============
    async getReporteAsistencia(cursoId = null) {
        let url = `${API_URL}/asistencias/reporte/consolidado`;
        if (cursoId) url += `?cursoId=${cursoId}`;
        const response = await fetchWithAuth(url);
        return response.json();
    },
    async getEstadisticas() {
        const response = await fetchWithAuth(`${API_URL}/asistencias/estadisticas`);
        return response.json();
    }
};