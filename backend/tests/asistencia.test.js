const { calcularPorcentajeAsistencia } = require('../utils/calculoAsistencia');

test('Calcula 80% para 8 asistencias y 2 faltas', () => {
    expect(calcularPorcentajeAsistencia(8, 2)).toBe(80);
});

test('Calcula 0% cuando no hay clases', () => {
    expect(calcularPorcentajeAsistencia(0, 0)).toBe(0);
});

test('Calcula 50% para 5 asistencias y 5 faltas', () => {
    expect(calcularPorcentajeAsistencia(5, 5)).toBe(50);
});

test('Redondea correctamente 66.6% → 67%', () => {
    expect(calcularPorcentajeAsistencia(2, 1)).toBe(67);
});