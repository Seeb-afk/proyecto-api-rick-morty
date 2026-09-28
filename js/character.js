import { getCharacter } from "../services/characters.js";
import { getSession, logout } from "./auth.js";

const detail = document.getElementById("character-detail");
const search = document.getElementById("search");

/**
 * @function getIdPersonaje
 * 
 * @description Saca el id del personaje de la url, null si no hay uno valido
 */
function getIdPersonaje() {

  const id = new URLSearchParams(location.search).get("id");

  // Sin id la API devolveria el listado completo de personajes, hay que cortarlo antes
  return id !== null && /^\d+$/.test(id) ? id : null;
};

/**
 * @function irAlListado
 * 
 * @param {string} nombre Texto que se dejara puesto en el buscador del listado
 * 
 * @description Vuelve a la pagina principal, si hay nombre lo deja como busqueda
 */
function irAlListado(nombre = "") {

  const limpio = nombre.trim();

  if (limpio === "") {
    window.location.href = "./main.html";
    return;
  };

  window.location.href = `./main.html?name=${encodeURIComponent(limpio)}`;
};

/**
 * @function showCharacter
 * 
 * @param {object} character Personaje devuelto por la API
 * 
 * @description Inserta dentro del main los datos ampliados del personaje
 */
function showCharacter(character) {

  detail.innerHTML = `
    <div class="flex flex-col md:flex-row">

      <img src="${character.image}" alt="${character.name}" class="w-full md:w-64 shrink-0">

      <div class="flex-1 p-6 flex flex-col gap-4">

        <h2 class="text-2xl font-bold text-[#20232A]">${character.name}</h2>

        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

          <div>
            <dt class="font-semibold text-gray-500 tracking-wide">ESTADO</dt>
            <dd class="font-semibold text-[#20232A]">${character.status}</dd>
          </div>

          <div>
            <dt class="font-semibold text-gray-500 tracking-wide">ESPECIE</dt>
            <dd class="font-semibold text-[#20232A]">${character.species}</dd>
          </div>

          <div>
            <dt class="font-semibold text-gray-500 tracking-wide">GÉNERO</dt>
            <dd class="font-semibold text-[#20232A]">${character.gender}</dd>
          </div>

          <div>
            <dt class="font-semibold text-gray-500 tracking-wide">EPISODIOS</dt>
            <dd class="font-semibold text-[#20232A]">${character.episode.length}</dd>
          </div>

          <div>
            <dt class="font-semibold text-gray-500 tracking-wide">ORIGEN</dt>
            <dd class="font-semibold text-[#20232A]">${character.origin.name}</dd>
          </div>

          <div>
            <dt class="font-semibold text-gray-500 tracking-wide">UBICACIÓN</dt>
            <dd class="font-semibold text-[#20232A]">${character.location.name}</dd>
          </div>

        </dl>
      </div>
    </div>

    <div class="p-6 border-t border-gray-300">
      <a href="./main.html" class="inline-flex items-center bg-[#3B82F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] text-white font-semibold text-sm py-2 px-4 rounded-md">
        Volver al listado
      </a>
    </div>`;
};

/**
 * @async
 * @function loadCharacter
 * 
 * @param {string} id Id del personaje a pedir
 * 
 * @description Pide el personaje a la API e inserta la ficha, o un mensaje si no se puede
 */
async function loadCharacter(id) {

  detail.innerHTML = `<p class="text-center text-gray-500 py-6">Cargando personaje...</p>`;

  try {

    showCharacter(await getCharacter(id));
  } catch (error) {

    // 404 es un id que no existe y 500 un id que no es numerico, ninguno es un fallo real
    const mensaje = error.status === 404 || error.status === 500
      ? "No se encontró ese personaje."
      : "No se pudo cargar el personaje.";

    detail.innerHTML = `
      <p class="text-center text-gray-500 py-6">${mensaje}</p>
      <div class="p-6 border-t border-gray-300 text-center">
        <a href="./main.html" class="inline-flex items-center bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-sm py-2 px-4 rounded-md">
          Volver al listado
        </a>
      </div>`;
    console.error(error);
  };
};

// Al cerrar sesion se borra la sesion y auth.js se encarga de mandar al login
document.getElementById("logout").addEventListener("click", () => {
  logout();
});

// Desde el detalle el buscador devuelve al listado con la busqueda ya puesta
document.getElementById("search-btn").addEventListener("click", () => {
  irAlListado(search.value);
});

search.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    irAlListado(event.target.value);
  }
});

const session = getSession();
const id = getIdPersonaje();

if (session) {
  document.getElementById("user-name").textContent = session.nombre;

  if (id) {
    loadCharacter(id);
  } else {
    detail.innerHTML = `<p class="text-center text-gray-500 py-6">No se indicó qué personaje ver.</p>`;
  }
};
