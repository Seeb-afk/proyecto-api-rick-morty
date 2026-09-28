/**
 * @const regexes
 * 
 * @description Reglas de formato de los campos del formulario
 */
export const regexes = {
  nombre: /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{2,50}$/,
  correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  clave: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/
};

/**
 * @function campoVacio
 * 
 * @param {string} valor Texto a revisar
 * 
 * @description true si el texto solo contiene espacios o no es texto
 */
export function campoVacio(valor) {
  return typeof valor === "string" && valor.trim() === "";
};

/**
 * @function correoEnUso
 * 
 * @param {string} correo Correo que se quiere guardar
 * @param {array} usuarios Lista de usuarios registrados
 * @param {object} usuarioActual Usuario que esta editando sus datos
 * 
 * @description true si ese correo ya pertenece a otro usuario
 * 
 * Se compara por identidad y no por el correo del usuario, porque si acaba de
 * cambiar de correo el suyo viejo ya no lo identifica y se rechazaria a si mismo
 */
export function correoEnUso(correo, usuarios, usuarioActual) {
  return usuarios.some((user) => user !== usuarioActual && user.correo === correo);
};
