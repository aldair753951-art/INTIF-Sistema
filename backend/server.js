const express = require('express');
const cors = require('cors');
const { getConnection } = require('./config/database');

// Importar rutas
const alumnoRoutes = require('./routes/alumnoRoutes');
const docenteRoutes = require('./routes/docenteRoutes');
const cursoRoutes = require('./routes/cursoRoutes');
const asistenciaRoutes = require('./routes/asistenciaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const matriculaRoutes = require('./routes/matriculaRoutes');

const app = express();
const PORT = 5001;

const morgan = require('morgan');
const logger = require('./utils/logger');

const solicitudRoutes = require('./routes/solicitudRoutes');
app.use('/api/solicitudes', solicitudRoutes);

// Usar Morgan con un stream que escriba en Winston
const stream = {
    write: (message) => logger.info(message.trim())
};
app.use(morgan('combined', { stream }));

// Middlewares
app.use(express.json());
app.use(cors());

// Conectar a la base de datos
getConnection().then(() => {
    console.log('✅ Base de datos conectada');
}).catch(err => {
    console.error('❌ Error de BD:', err.message);
});

// Rutas
app.use('/api/alumnos', alumnoRoutes);
app.use('/api/docentes', docenteRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/matriculas', matriculaRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ mensaje: '✅ API funcionando correctamente', timestamp: new Date() });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`\n📋 ENDPOINTS DISPONIBLES:\n`);
    console.log(`📚 ALUMNOS:     GET/POST/PUT/DELETE /api/alumnos`);
    console.log(`👨‍🏫 DOCENTES:    GET/POST/PUT/DELETE /api/docentes`);
    console.log(`📖 CURSOS:      GET/POST/PUT/DELETE /api/cursos`);
    console.log(`✅ ASISTENCIAS: GET/POST /api/asistencias`);
    console.log(`📋 MATRÍCULAS:  GET/POST/DELETE /api/matriculas`);
    console.log(`🔐 USUARIOS:    GET/POST /api/usuarios - POST /api/usuarios/login\n`);
});