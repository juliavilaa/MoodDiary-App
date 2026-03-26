// Catálogo de emociones disponibles con su color e ícono
export const CATALOGO_EMOCIONES = [
  { id: 1, nombre: 'Feliz',    color: '#F0A0B0', icono: 'happy-outline',          textColor: '#fff' },
  { id: 2, nombre: 'Triste',   color: '#9268b8', icono: 'sad-outline',            textColor: '#fff' },
  { id: 3, nombre: 'Enojado',  color: '#E8857A', icono: 'thunderstorm-outline',   textColor: '#fff' },
  { id: 4, nombre: 'Calmado',  color: '#B8D4F0', icono: 'partly-sunny-outline',   textColor: '#4a6fa5' },
  { id: 5, nombre: 'Ansioso',  color: '#A8D8B0', icono: 'alert-circle-outline',   textColor: '#3a7a45' },
];

// Estructura de una emoción registrada por el usuario:
// {
//   id: string,          → identificador único
//   descripcion: string, → texto que escribe el usuario
//   emocion: string,     → nombre del tipo (Feliz, Triste, etc.)
//   color: string,       → color asociado
//   icono: string,       → ícono asociado
//   textColor: string,   → color del texto
//   fecha: string,       → fecha de registro
// }