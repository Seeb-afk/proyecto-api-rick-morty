import { getCharactersByIds } from "../services/characters.js";
import { getSession, logout } from "./auth.js";
import { getFavoritos, toggleFavorito } from "./almacenFavoritos.js";

const cards = document.getElementById("favorites-container");
const search = document.getElementById("search");

const session = getSession();

/**
 * @function pintarVacio
 *
 * @description Muestra el estado vacio, cuando no hay favoritos o ya no queda ninguno
 */
function pintarVacio() {

  cards.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center gap-4 py-10 text-center">
      <span class="material-symbols-outlined !text-[48px] text-gray-400">
        favorite_border
      </span>
      <p class="text-gray-600 font-semibold">
        Todavia no agregaste ningun favorito.
      </p>
      <a href="./main.html" class="inline-flex items-center bg-[#3B82F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] text-white font-semibold text-sm py-2 px-4 rounded-md">
        Explorar personajes
      </a>
    </div>`;
};

/**
 * @function showFavorites
 *
 * @description Pide a la API los personajes de la lista del usuario y los pinta como tarjetas
 */
async function showFavorites() {

  // Los ids se guardan en Local Storage, la API se encarga de descartar los que ya no existen
  const ids = getFavoritos(session.correo);

  // Sin favoritos no se pide nada, ademas la API devolveria el listado completo con una url vacia
  if (ids.length === 0) {
    pintarVacio();
    return;
  };

  cards.innerHTML = `<p class="col-span-full text-center text-gray-500 py-6">Cargando favoritos...</p>`;

  try {

    // Todos los ids van en una sola llamada separados por coma
    const personajes = await getCharactersByIds(ids);

    // Puede volver vacia si los ids guardados ya no corresponden a ningun personaje
    if (personajes.length === 0) {
      pintarVacio();
      return;
    };

    cards.innerHTML = "";

    personajes.forEach((character) => {

      // En esta pagina todo lo que se muestra es favorito, asi que el estado siempre es true
      const esFav = true;

      const cardHTML = `
        <article class="relative flex flex-col md:flex-row w-full bg-white rounded-md shadow-md overflow-hidden md:h-52">

          <a href="./character.html?id=${character.id}" class="flex flex-col md:flex-row w-full h-full hover:bg-[#F3F4F6] transition-colors">

            <img src="${character.image}" alt="${character.name}" class="w-full md:w-44 md:h-full md:object-cover shrink-0">

            <div class="flex-1 flex flex-col p-4">
              <h2 class="text-lg font-bold text-[#20232A]">${character.name}</h2>

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

          </a>

          <button
            data-fav="${character.id}"
            type="button"
            title="${esFav ? "Quitar de favoritos" : "Agregar a favoritos"}"
            class="absolute top-2 right-2 flex bg-white/90 hover:bg-white rounded-full p-1 shadow-md cursor-pointer"
          >
            <span class="material-symbols-outlined ${esFav ? "text-red-500" : "text-[#20232A]"}">
              ${esFav ? "favorite" : "favorite_border"}
            </span>
          </button>
        </article>`;

      cards.insertAdjacentHTML("beforeend", cardHTML);
    });
  } catch (error) {
    cards.innerHTML = `<p class="col-span-full text-center text-red-500 py-6">No se pudieron cargar los favoritos.</p>`;
    console.error(error);
  };
};

/**
 * @function buscar
 *
 * @param {string} nombre Texto a buscar
 *
 * @description Desde los favoritos el buscador devuelve al listado con la busqueda puesta
 */
function buscar(nombre) {

  const limpio = nombre.trim();

  if (limpio === "") {
    window.location.href = "./main.html";
    return;
  };

  window.location.href = `./main.html?name=${encodeURIComponent(limpio)}`;
};

// Un solo listener para todas las tarjetas, aqui la accion es quitar y no cambiar el icono
cards.addEventListener("click", (event) => {

  const boton = event.target.closest("[data-fav]");

  if (!boton) {
    return;
  };

  toggleFavorito(session.correo, boton.dataset.fav);
  boton.closest("article").remove();

  // Si era el ultimo favorito la pagina se queda sin tarjetas
  if (cards.querySelectorAll("article").length === 0) {
    pintarVacio();
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
  showFavorites();
};
