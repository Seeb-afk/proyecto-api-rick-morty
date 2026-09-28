import { getCharacters } from "../services/characters.js";
import { endpoints } from "../config/endpoints.js";
import { getSession } from "./auth.js";

const cards = document.getElementById("cards-container");
const btnPrev = document.getElementById("prev-page");
const btnNext = document.getElementById("next-page");
const pageIndicator = document.getElementById("page-indicator");

/**
 * @async
 * @function showCharacters
 * 
 * @param {number} page Pagina que se le pide a la API, por defecto la primera
 * 
 * @description Inserta dentro de la etiqueta main todos los characters de la pagina pedida
 */
async function showCharacters(page = 1) {

  // Se bloquean los botones mientras llegan los datos para no pedir paginas distintas a la vez
  btnPrev.disabled = true;
  btnNext.disabled = true;

  cards.innerHTML = `<p class="col-span-full text-center text-gray-500 py-6">Cargando personajes...</p>`;

  try {

    // La API devuelve 20 personajes por pagina, el total de paginas viene en data.info
    const data = await getCharacters(`${endpoints.characters}?page=${page}`);

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
    cards.innerHTML = `<p class="col-span-full text-center text-red-500 py-6">No se pudieron cargar los personajes.</p>`;
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
 * @function irAPagina
 * 
 * @param {number} page Pagina a la que se quiere ir
 * 
 * @description Escribe la pagina en la url y pide esa pagina
 */
function irAPagina(page) {
  history.pushState(null, "", `?page=${page}`);
  showCharacters(page);
};

btnPrev.addEventListener("click", () => irAPagina(getPaginaActual() - 1));
btnNext.addEventListener("click", () => irAPagina(getPaginaActual() + 1));

// El boton de atras del navegador cambia la url sin recargar, hay que escucharlo para pedir esa pagina
window.addEventListener("popstate", () => {
  showCharacters(getPaginaActual());
});

const session = getSession();

if (session) {
  showCharacters(getPaginaActual());
};
