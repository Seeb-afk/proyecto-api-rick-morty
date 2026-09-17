import { dataUsers } from "./users.js";
import { saveSession, redirectIfAutenticated } from "./auth.js";

redirectIfAutenticated();

let formularioLogin = document.getElementById("loginForm")
formularioLogin.addEventListener("submit", (event) => {

  event.preventDefault();

  // Datos ingresados por el usuario
  const userInput = {
    
    correo: formularioLogin.elements["correo"].value.toLowerCase(),
    clave: formularioLogin.elements["clave"].value
  };
  const mensaje = document.getElementById("message");

  // Verifica si los campos estan vacios
  let errores = [];
  Object.entries(userInput).forEach(([key, value]) => {

    if (typeof value === "string" && value.trim() === "") {
      errores.push(`El campo ${key} debe contener algún valor.`);
    };
  });

  if (errores.length > 0) {
    mensaje.className = "p-4 bg-red-500 rounded-lg text-red-100";
    mensaje.innerHTML = errores.map(err => `<ul class="text-red-100">${err}</ul>`).join("");
    return;
  };

  const correoUsuario = userInput.correo;

  const usuario = dataUsers.results.find((user) => user.correo === correoUsuario);

  // Se valida si existe el correo y si existe se evalua la clave ingresada
  if (!usuario) {
    mensaje.className = "p-4 bg-red-500 rounded-lg text-red-100";
    mensaje.innerHTML =`<ul class="text-red-100">El correo ingresado no esta registrado.</ul>`;
    return;
  }

  if (usuario.clave !== userInput.clave) {
    mensaje.className = "p-4 bg-red-500 rounded-lg text-red-100";
    mensaje.innerHTML = `<ul class="text-red-100">La contraseña es incorrecta.</ul>`;
    return;
  }

  // Esto guarda en sessionStorage la sesion iniciada por el usuario
  const session = { correo: userInput.correo, nombre: usuario.nombre, apellido: usuario.apellido };
  saveSession(session);
  // Se escoge este metodo por que es mas facil de manipular que las cookies


  mensaje.className = "p-4 bg-green-500 rounded-lg text-green-100";
  mensaje.innerHTML = `<ul class="text-green-100">Sesión iniciada correctamente.</ul>`;

  setTimeout(() => {
    window.location.href = "../app/main.html";
  }, 2000);
});