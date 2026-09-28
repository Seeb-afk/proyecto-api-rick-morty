import { getCharacters } from "../services/characters.js";
import { endpoints } from "../config/endpoints.js";
import { getSession, logout } from "./auth.js";

const cards = document.getElementById("cards-container");
const btnPrev = document.getElementById("prev-page");
const btnNext = document.getElementById("next-page");
const pageIndicator = document.getElementById("page-indicator");
const search = document.getElementById("search");

/**
 * @async
 * @function showCharacters
 * 
 * @param {number} page Pagina que se le pide a la API, por defecto la primera
 * @param {string} nombre Nombre a buscar, vacio para traer el listado completo
 * 
 * @description Inserta dentro de la etiqueta main todos los characters de la pagina pedida
 */
async function showCharacters(page = 1, nombre = "") {

  // Se bloquean los botones mientras llegan los datos para no pedir paginas distintas a la vez
  btnPrev.disabled = true;
  btnNext.disabled = true;

  cards.innerHTML = `<p class="col-span-full text-center text-gray-500 py-6">Cargando personajes...</p>`;

  try {

    // La API devuelve 20 personajes por pagina, el total de paginas viene en data.info
    const data = await getCharacters(`${endpoints.characters}?page=${page}&name=${encodeURIComponent(nombre)}`);

    cards.innerHTML = "";

    data.results.forEach((character) => {

      const cardHTML = `
        <article class="flex flex-col md:flex-row w-full bg-white rounded-md shadow-md overflow-hidden md:h-52">

          <img src="${character.image}" alt="${character.name}" class="w-full md:w-44 md:h-full md:object-cover shrink-0">

          <div class="flex-1 flex flex-col p-4">
            <h2 class="text-lg font-bold text-[#20232A] hover:text-[#3B82F6] active:text-[#2563EB] cursor-pointer">${character.name}</h2>

            <div class="flex items-center gap-2 mt-1">
              <span class="font-medium text-sm">${character.status}</span>
              <span class="text-sm text-gray-500">·</span>
              <p class="text-sm text-gray-600">${character.species}</p>
            </div>

            <div class="mt-auto pt-4">
              <p class="text-xs font-semibold text-gray-500 tracking-wide">ORIGEN:</p>
              <p class="text-sm font-semibold">${character.origin.name}</p>
            </div>
          </div>

        </article>`;

      cards.insertAdjacentHTML("beforeend", cardHTML);
    });

    pageIndicator.textContent = `Página ${page} de ${data.info.pages}`;

    // La API llega sin next en la ultima pagina y sin prev en la primera
    btnPrev.disabled = data.info.prev === null;
    btnNext.disabled = data.info.next === null;
  } catch (error) {
    // La API responde 404 cuando el nombre no coincide con nadie, eso no es un fallo
    if (error.status === 404) {
      cards.innerHTML = `<p class="col-span-full text-center text-gray-500 py-6">No se encontraron personajes con ese nombre.</p>`;
      pageIndicator.textContent = "Sin resultados";
    } else {
      cards.innerHTML = `<p class="col-span-full text-center text-red-500 py-6">No se pudieron cargar los personajes.</p>`;
    }
    console.error(error);
  };
};

/**
 * @function getPaginaActual
 * 
 * @description Saca el numero de pagina de la url, si no esta escrito se asume la primera
 */
function getPaginaActual() {
  return Number(new URLSearchParams(location.search).get("page")) || 1;
};

/**
 * @function getNombreBusqueda
 * 
 * @description Saca el nombre buscado de la url, vacio si no hay busqueda activa
 */
function getNombreBusqueda() {
  return new URLSearchParams(location.search).get("name") ?? "";
};

/**
 * @function irAPagina
 * 
 * @param {number} page Pagina a la que se quiere ir
 *
 * @description Escribe la pagina en la url conservando la busqueda y pide esa pagina
 */
function irAPagina(page) {
  const nombre = getNombreBusqueda();
  history.pushState(null, "", `?name=${encodeURIComponent(nombre)}&page=${page}`);
  showCharacters(page, nombre);
};

/**
 * @function buscar
 * 
 * @param {string} nombre Texto a buscar en el nombre del personaje
 * 
 * @description Guarda la busqueda en la url y vuelve a la primera pagina
 */
function buscar(nombre) {

  const limpio = nombre.trim();

  // Una busqueda vacia quita el filtro y deja el listado completo
  if (limpio === "") {
    history.pushState(null, "", "./main.html");
    showCharacters(1, "");
    return;
  };

  history.pushState(null, "", `?name=${encodeURIComponent(limpio)}&page=1`);
  showCharacters(1, limpio);
};

btnPrev.addEventListener("click", () => irAPagina(getPaginaActual() - 1));
btnNext.addEventListener("click", () => irAPagina(getPaginaActual() + 1));

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

// Esto es para los botones de atras y adelante del navegador, hay que escucharlo para pedir esa pagina
window.addEventListener("popstate", () => {
  search.value = getNombreBusqueda();
  showCharacters(getPaginaActual(), getNombreBusqueda());
});

const session = getSession();

if (session) {
  document.getElementById("user-name").textContent = session.nombre;
  // Se rellena el input con la busqueda de la url para no perderla al recargar
  search.value = getNombreBusqueda();
  showCharacters(getPaginaActual(), getNombreBusqueda());
};
