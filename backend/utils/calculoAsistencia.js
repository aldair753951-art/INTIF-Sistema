// REFACTOR: lógica real y genérica
function calcularPorcentajeAsistencia(presentes, ausencias) {
    const total = presentes + ausencias;
    if (total === 0) return 0;
    return Math.round((presentes / total) * 100);
}
module.exports = { calcularPorcentajeAsistencia };