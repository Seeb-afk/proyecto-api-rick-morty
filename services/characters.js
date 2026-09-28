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
    // El status se adjunta al error para que el llamador distinga un 404 de una busqueda
    // sin resultados de un fallo real de la API
    const error = new Error(`Error ${response.status}: no se pudieron cargar los personajes.`);
    error.status = response.status;
    throw error;
  }

  return response.json();
};

/**
 * @async
 * @function getCharactersByIds
 * 
 * @param {array} ids Ids de los personajes que se quieren
 * 
 * @description pide varios personajes en una sola llamada, la API los acepta separados por coma
 */
export async function getCharactersByIds(ids = []) {

  // Sin ids la API devolveria el listado completo de personajes, hay que cortarlo antes
  if (ids.length === 0) {
    return [];
  };

  const response = await fetch(`${endpoints.characters}/${ids.join(",")}`);

  if (!response.ok) {
    const error = new Error(`Error ${response.status}: no se pudieron cargar los personajes.`);
    error.status = response.status;
    throw error;
  };

  const data = await response.json();

  // Con un solo id la API responde un objeto suelto en vez de un array
  return Array.isArray(data) ? data : [data];
};

/**
 * @async
 * @function getCharacter
 * 
 * @param {string|number} id Id del personaje
 * 
 * @description hace un pedido a la API para un personaje concreto
 */
export async function getCharacter(id = 1) {

  const response = await fetch(`${endpoints.characters}/${id}`);

  if (!response.ok) {
    // La API responde 404 con un id que no existe y 500 con un id que no es numerico
    const error = new Error(`Error ${response.status}: no se pudo cargar el personaje.`);
    error.status = response.status;
    throw error;
  }

  return response.json();
};
