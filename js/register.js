import { dataUsers } from "./users.js";


let formulario = document.getElementById("form");

formulario.addEventListener("submit", (event) => {

  event.preventDefault();

  const correoIngresado = formulario.elements["correo"].value.trim()

  const correoExiste = dataUsers.results.filter((user) => user.correo === correoIngresado);
  
  // Verificar si correo existe, si es asi no puede registrarlo
  const mensaje = document.getElementById("message");
  if (correoExiste.length > 0) {
    mensaje.className = "p-4 bg-red-500 rounded-lg text-red-100";
    mensaje.innerHTML = `<ul class="text-red-100">El correo ya esta registrado.</ul>`;
    return;
  }

  // Datos ingresados
  const userData = {

    id: dataUsers.results.length + 1,
    nombre: formulario.elements["nombre"].value,
    apellido: formulario.elements["apellido"].value,
    correo: formulario.elements["correo"].value,
    clave: formulario.elements["clave"].value
  }

  const regexes = {
    nombre: /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{2,50}$/,
    correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    clave: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  };

  // Verifica si los campos estan vacios
  let errores = [];
  Object.entries(userData).forEach(([key, value]) => {

    if (typeof value === "string" && value.trim() === "") {
      errores.push(`El campo ${key} debe contener algún valor.`);
    };
  });

  if (errores.length > 0) {
    mensaje.className = "p-4 bg-red-500 rounded-lg text-red-100";
    mensaje.innerHTML = errores.map(err => `<ul class="text-red-100">${err}</ul>`).join("");
    return;
  }

  // Validar si los campos cumplen con lo requerido
  if (!regexes.nombre.test(userData.nombre)) {
    errores.push(`El nombre no es válido.`)
  };
  if (!regexes.nombre.test(userData.apellido)) {
    errores.push(`El apellido no es válido.`)
  };
  if (!regexes.correo.test(userData.correo)) {
    errores.push(`El correo no es válido.`)
  };
  if (!regexes.clave.test(userData.clave)) {
    errores.push(`La contraseña no es válida.`)
  };
  if (userData.clave !== formulario.elements["validar"].value) {
    errores.push(`Las contraseñas no son iguales.`)
  }

  
  if(errores.length > 0) {
    mensaje.className = "p-4 bg-red-500 rounded-lg text-red-100";
    mensaje.innerHTML = errores.map(err => `<ul class="text-red-100">${err}</ul>`).join("");
    return;
  }

  // Si todo correcto, lo guarda y manda a login
  mensaje.className = "p-4 bg-green-500 rounded-lg text-green-100";
  mensaje.innerHTML = `<ul class="text-green-100">Te has registrado correctamente.</ul>`;
  dataUsers.results.push(userData);
  formulario.reset();

  setTimeout(() => {
    window.location.href = "./login.html";
  }, 2000);

});