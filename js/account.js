import { dataUsers, saveUsers } from "./users.js";
import { getSession, saveSession, logout } from "./auth.js";
import { regexes, campoVacio, correoEnUso } from "./validaciones.js";
import { moverFavoritos } from "./almacenFavoritos.js";

const formulario = document.getElementById("form");
const mensaje = document.getElementById("message");
const search = document.getElementById("search");

const campoErrores = {
  nombre: document.getElementById("error-nombre"),
  apellido: document.getElementById("error-apellido"),
  correo: document.getElementById("error-correo"),
  clave: document.getElementById("error-clave"),
  validar: document.getElementById("error-validar")
};

const session = getSession();
// Se busca por el correo de la sesion, el find devuelve el mismo objeto del array
// asi que al cambiar sus propiedades se cambia el usuario guardado
const usuario = dataUsers.results.find((user) => user.correo === session?.correo);

/**
 * @function mostrarError
 * 
 * @param {string} campo Nombre del campo
 * @param {string} texto Mensaje a mostrar, "" lo oculta
 * 
 * @description Muestra u oculta el error de un campo del formulario
 */
function mostrarError(campo, texto) {

  const elemento = campoErrores[campo];

  elemento.textContent = texto;

  if (texto === "") {
    elemento.classList.add("hidden");
  } else {
    elemento.classList.remove("hidden");
  };
};

/**
 * @function limpiarErrores
 * 
 * @description Quita los errores de los campos y el mensaje de exito
 */
function limpiarErrores() {

  Object.values(campoErrores).forEach((elemento) => {
    elemento.textContent = "";
    elemento.classList.add("hidden");
  });

  mensaje.className = "hidden";
};

/**
 * @function validarDatos
 * 
 * @param {object} datos Datos leidos del formulario
 * @param {string} claveRepetida Repeticion de la contraseña
 * 
 * @description Revisa los datos y devuelve un objeto con el error de cada campo
 */
function validarDatos(datos, claveRepetida) {

  const errores = {};

  // Verifica si los campos obligatorios estan vacios
  ["nombre", "apellido", "correo"].forEach((campo) => {

    if (campoVacio(datos[campo])) {
      errores[campo] = "Este campo es obligatorio.";
    };
  });

  // Validar si los campos cumplen con lo requerido
  if (!campoVacio(datos.nombre) && !regexes.nombre.test(datos.nombre)) {
    errores.nombre = "El nombre no es válido.";
  };
  if (!campoVacio(datos.apellido) && !regexes.nombre.test(datos.apellido)) {
    errores.apellido = "El apellido no es válido.";
  };
  if (!campoVacio(datos.correo) && !regexes.correo.test(datos.correo)) {
    errores.correo = "El correo no es válido.";
  };

  // El correo se compara contra los demas usuarios, si no el propio usuario se rechazaria a si mismo
  if (!campoVacio(datos.correo) && correoEnUso(datos.correo, dataUsers.results, usuario)) {
    errores.correo = "El correo ya esta registrado.";
  };

  // La contraseña solo se valida si se escribio, vacia significa que no se quiere cambiar
  const cambiaClave = !campoVacio(datos.clave);

  if (cambiaClave && !regexes.clave.test(datos.clave)) {
    errores.clave = "Debe tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial.";
  };
  if (cambiaClave && campoVacio(claveRepetida)) {
    errores.validar = "Debes repetir la contraseña.";
  };
  if (cambiaClave && !campoVacio(claveRepetida) && datos.clave !== claveRepetida) {
    errores.validar = "Las contraseñas no son iguales.";
  };

  // Escribir solo la confirmacion sin la contraseña no tiene sentido
  if (!cambiaClave && !campoVacio(claveRepetida)) {
    errores.validar = "Escribe la contraseña nueva para poder confirmarla.";
  };

  return errores;
};

/**
 * @function buscar
 * 
 * @param {string} nombre Texto a buscar
 * 
 * @description Desde la cuenta el buscador devuelve al listado con la busqueda puesta
 */
function buscar(nombre) {

  const limpio = nombre.trim();

  if (limpio === "") {
    window.location.href = "./main.html";
    return;
  };

  window.location.href = `./main.html?name=${encodeURIComponent(limpio)}`;
};

formulario.addEventListener("submit", (event) => {

  event.preventDefault();
  limpiarErrores();

  // Si la sesion existe pero el usuario ya no esta en la lista no se puede editar nada
  if (!usuario) {
    mensaje.className = "p-4 bg-red-500 rounded-lg text-red-100";
    mensaje.innerHTML = `<ul class="text-red-100">No se encontró tu usuario, vuelve a iniciar sesión.</ul>`;
    return;
  };

  const datos = {
    nombre: formulario.elements["nombre"].value.trim(),
    apellido: formulario.elements["apellido"].value.trim(),
    correo: formulario.elements["correo"].value.trim().toLowerCase(),
    clave: formulario.elements["clave"].value
  };

  const claveRepetida = formulario.elements["validar"].value;

  const errores = validarDatos(datos, claveRepetida);

  if (Object.keys(errores).length > 0) {
    Object.entries(errores).forEach(([campo, texto]) => mostrarError(campo, texto));
    return;
  };

  usuario.nombre = datos.nombre;
  usuario.apellido = datos.apellido;
  usuario.correo = datos.correo;

  // Si la contraseña se dejo vacia se conserva la que ya tenia
  if (datos.clave !== "") {
    usuario.clave = datos.clave;
    formulario.elements["clave"].value = "";
    formulario.elements["validar"].value = "";
  };

  saveUsers();

  // Los favoritos se guardan con el correo como clave, hay que moverlos antes de cambiar la sesion
  moverFavoritos(session.correo, datos.correo);

  // La sesion lleva correo y nombre, si no se actualiza el usuario desaparece al navegar
  saveSession({ correo: datos.correo, nombre: datos.nombre, apellido: datos.apellido });
  document.getElementById("user-name").textContent = datos.nombre;

  mensaje.className = "p-4 bg-green-500 rounded-lg text-green-100";
  mensaje.innerHTML = `<ul class="text-green-100">Tus datos se actualizaron correctamente.</ul>`;
});

// Limpia el error del campo que se esta escribiendo
formulario.addEventListener("input", (event) => {

  const campo = event.target.id;

  if (campoErrores[campo]) {
    mostrarError(campo, "");
  };
});

// Al cerrar sesion se borra la sesion y auth.js se encarga de mandar al login
document.getElementById("logout").addEventListener("click", () => {
  logout();
});

// La busqueda se dispara con el boton de la lupa o con la tecla Enter
document.getElementById("search-btn").addEventListener("click", () => {
  buscar(search.value);
});

search.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    buscar(event.target.value);
  }
});

if (session) {

  document.getElementById("user-name").textContent = session.nombre;

  // Se rellenan los datos, la contraseña no se pone porque quedaria en texto plano en el DOM
  if (usuario) {
    formulario.elements["nombre"].value = usuario.nombre;
    formulario.elements["apellido"].value = usuario.apellido;
    formulario.elements["correo"].value = usuario.correo;
  };
};
