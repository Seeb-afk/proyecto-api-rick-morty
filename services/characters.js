import { endpoints } from "../config/endpoints.js";

/**
 * @async
 * @function getCharacters
 * 
 * @description hace un pedido a la API para los datos de los personajes
 */
export async function getCharacters(url = endpoints.characters) {

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error ${response.status}: no se pudieron cargar los personajes.`);
  }

  return response.json();
};
