import { dataUsers, saveUsers } from "./users.js";


let formulario = document.getElementById("form");
const mensaje = document.getElementById("message");

const campoErrores = {
  nombre: document.getElementById("error-nombre"),
  apellido: document.getElementById("error-apellido"),
  correo: document.getElementById("error-correo"),
  clave: document.getElementById("error-clave"),
  validar: document.getElementById("error-validar")
};

function mostrarError(campo, texto) {
  const elemento = campoErrores[campo];

  elemento.textContent = texto;

  if (texto === "") {
    elemento.classList.add("hidden");
  } else {
    elemento.classList.remove("hidden");
  };
};

function limpiarErrores() {
  Object.values(campoErrores).forEach((elemento) => {
    elemento.textContent = "";
    elemento.classList.add("hidden");
  });

  mensaje.className = "hidden";
};

formulario.addEventListener("submit", (event) => {

  event.preventDefault();
  limpiarErrores();

  // Datos ingresados
  const userData = {

    id: dataUsers.results.length + 1,
    nombre: formulario.elements["nombre"].value,
    apellido: formulario.elements["apellido"].value,
    correo: formulario.elements["correo"].value.toLowerCase(),
    clave: formulario.elements["clave"].value
  };
  
  const claveRepetida = formulario.elements["validar"].value;

  const regexes = {
    nombre: /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{2,50}$/,
    correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    clave: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/
  };

  // Aqui se acumula el error de cada campo
  let errores = {};

  // Verifica si los campos estan vacios
  Object.entries(userData).forEach(([key, value]) => {

    if (typeof value === "string" && value.trim() === "") {
      errores[key] = "Este campo es obligatorio.";
    };
  });

  if (claveRepetida.trim() === "") {
    errores.validar = "Debes repetir la contraseña.";
  }

  const correoExiste = dataUsers.results.filter((user) => user.correo === userData.correo);

  // Verificar si correo existe, si es asi no puede registrarlo
  if (correoExiste.length > 0) {
    errores.correo = "El correo ya esta registrado.";
  };

  // Validar si los campos cumplen con lo requerido
  if (userData.nombre.trim() !== "" && !regexes.nombre.test(userData.nombre)) {
    errores.nombre = "El nombre no es válido.";
  };
  if (userData.apellido.trim() !== "" && !regexes.nombre.test(userData.apellido)) {
    errores.apellido = "El apellido no es válido.";
  };
  if (userData.correo.trim() !== "" && !regexes.correo.test(userData.correo)) {
    errores.correo = "El correo no es válido.";
  };
  if (userData.clave.trim() !== "" && !regexes.clave.test(userData.clave)) {
    errores.clave = "Debe tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial.";
  };
  if (claveRepetida.trim() !== "" && userData.clave !== claveRepetida) {
    errores.validar = "Las contraseñas no son iguales.";
  };

  if (Object.keys(errores).length > 0) {
    Object.entries(errores).forEach(([campo, texto]) => mostrarError(campo, texto));
    return;
  };

  // Si todo correcto, lo guarda y manda a login
  mensaje.className = "p-4 bg-green-500 rounded-lg text-green-100";
  mensaje.innerHTML = `<ul class="text-green-100">Te has registrado correctamente.</ul>`;
  dataUsers.results.push(userData);
  saveUsers();
  formulario.reset();

  setTimeout(() => {
    window.location.href = "./login.html";
  }, 2000);

});

// Limpia el error del campo que se esta escribiendo
formulario.addEventListener("input", (event) => {

  const campo = event.target.id;

  if (campoErrores[campo]) {
    mostrarError(campo, "");
  };
});
