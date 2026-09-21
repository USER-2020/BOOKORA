export const categories = [
  { icon: 'spark', label: 'Belleza', color: 'pink', detail: 'Salones, spas y estética' },
  { icon: 'store', label: 'Restaurantes', color: 'orange', detail: 'Mesas y experiencias' },
  { icon: 'heart', label: 'Salud', color: 'mint', detail: 'Citas y pacientes' },
  { icon: 'chart', label: 'Fitness', color: 'purple', detail: 'Clases y entrenamientos' },
  { icon: 'people', label: 'Servicios', color: 'blue', detail: 'Profesionales y equipos' },
  { icon: 'calendar', label: 'Eventos', color: 'yellow', detail: 'Espacios y momentos' },
];

export const services = [
  { id: 'facial', name: 'Facial hidratante', meta: '60 min · Desde $85.000', icon: 'spark', tone: 'lilac' },
  { id: 'massage', name: 'Masaje relajante', meta: '50 min · Desde $110.000', icon: 'heart', tone: 'mint' },
  { id: 'hair', name: 'Corte + tratamiento', meta: '60 min · Desde $65.000', icon: 'spark', tone: 'blue' },
];

export const appointments = [
  { time: '09:00', name: 'Ana Torres', service: 'Corte + tratamiento', initials: 'AT', tone: 'peach', status: 'confirmed' },
  { time: '10:30', name: 'Valentina Ruiz', service: 'Manicure semipermanente', initials: 'VR', tone: 'lilac', status: 'in-progress' },
  { time: '12:00', name: 'Lucía Morales', service: 'Facial hidratante', initials: 'LM', tone: 'mint', status: 'confirmed' },
  { time: '13:30', name: 'Sofía Herrera', service: 'Coloración', initials: 'SH', tone: 'blue', status: 'confirmed' },
  { time: '15:00', name: 'Camila Torres', service: 'Corte + peinado', initials: 'CT', tone: 'yellow', status: 'pending' },
];

export const statusConfig = {
  confirmed: { label: 'Confirmada', tone: 'success' },
  'in-progress': { label: 'En curso', tone: 'purple' },
  pending: { label: 'Pendiente', tone: 'warning' },
};
