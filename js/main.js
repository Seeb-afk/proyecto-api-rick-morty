import { getCharacters } from "../services/characters.js";
import { endpoints } from "../config/endpoints.js";
import { getSession } from "./auth.js";

const cards = document.getElementById("cards-container");
const btnPrev = document.getElementById("prev-page");
const btnNext = document.getElementById("next-page");
const pageIndicator = document.getElementById("page-indicator");

// Pagina que se esta mostrando, cambia con los botones de la paginacion
let paginaActual = 1;

/**
 * @async
 * @function showCharacters
 * 
 * @param {number} page Pagina que se le pide a la API, por defecto la primera
 * 
 * @description Inserta dentro de la etiqueta main todos los characters de la pagina pedida
 */
async function showCharacters(page = 1) {

  paginaActual = page;

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
    pageIndicator.textContent = `Página ${page}`;
    btnPrev.disabled = paginaActual <= 1;
    btnNext.disabled = false;
    console.error(error);
  };
};

/**
 * @function goPrevPage
 * 
 * @description Pide la pagina anterior, el boton permanece deshabilitado en la primera
 */
function goPrevPage() {

  if (paginaActual > 1) {
    showCharacters(paginaActual - 1);
  };
};

/**
 * @function goNextPage
 * 
 * @description Pide la pagina siguiente, el boton permanece deshabilitado en la ultima
 */
function goNextPage() {

  showCharacters(paginaActual + 1);
};

btnPrev.addEventListener("click", goPrevPage);
btnNext.addEventListener("click", goNextPage);

const session = getSession();

if (session) {
  showCharacters();
};
