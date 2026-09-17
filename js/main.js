import { getCharacters } from "../services/characters.js";
import { getSession } from "./auth.js";

/**
 * @async
 * @function showCharacters
 * 
 * @description Inserta dentro de la etiqueta main todos los characters que encuentre en la API
 */
async function showCharacters() {

  const cards = document.getElementById("cards-container");
  cards.innerHTML = `<p class="col-span-full text-center text-gray-500 py-6">Cargando personajes...</p>`;

  try {

    const data = await getCharacters();
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
  } catch (error) {
    cards.innerHTML = `<p class="col-span-full text-center text-red-500 py-6">No se pudieron cargar los personajes.</p>`;
    console.error(error);
  };
};

const session = getSession();

if (session) {
  showCharacters();
};
