const prefijo = "rickandmorty-favoritos";

/**
 * @function getClave
 *
 * @param {string} correo Correo del usuario
 *
 * @description Arma la clave de Local Storage, una por usuario para que las listas no se mezclen
 */
function getClave(correo) {
  return `${prefijo}-${correo}`;
}

/**
 * @function getFavoritos
 *
 * @param {string} correo Correo del usuario
 *
 * @description Devuelve el array de ids agregados, vacio si no tiene o si la clave esta dañada
 */
export function getFavoritos(correo) {

  try {
    const datos = JSON.parse(localStorage.getItem(getClave(correo)) ?? "[]");
    return Array.isArray(datos) ? datos : [];
  } catch {
    // Alguien pudo editar la clave a mano desde la consola, no debe romper la pagina
    return [];
  };
};

/**
 * @function guardarFavoritos
 *
 * @param {string} correo Correo del usuario
 * @param {array} ids Ids de los personajes agregados
 *
 * @description Guarda la lista del usuario en Local Storage
 */
function guardarFavoritos(correo, ids) {
  localStorage.setItem(getClave(correo), JSON.stringify(ids));
};

/**
 * @function esFavorito
 *
 * @param {string} correo Correo del usuario
 * @param {number|string} id Id del personaje
 *
 * @description true si ese personaje esta en la lista del usuario
 */
export function esFavorito(correo, id) {
  return getFavoritos(correo).includes(Number(id));
};

/**
 * @function toggleFavorito
 *
 * @param {string} correo Correo del usuario
 * @param {number|string} id Id del personaje
 *
 * @description Agrega el personaje si no estaba y lo quita si estaba, devuelve el estado nuevo
 */
export function toggleFavorito(correo, id) {

  const ids = getFavoritos(correo);
  const num = Number(id);

  if (ids.includes(num)) {
    guardarFavoritos(correo, ids.filter((favorito) => favorito !== num));
    return false;
  };

  guardarFavoritos(correo, [...ids, num]);
  return true;
};

/**
 * @function moverFavoritos
 *
 * @param {string} correoViejo Correo con el que se guardaron los favoritos
 * @param {string} correoNuevo Correo que tiene el usuario ahora
 *
 * @description Pasa la lista a la clave del correo nuevo, para que editarla en el perfil no los pierda
 */
export function moverFavoritos(correoViejo, correoNuevo) {

  if (correoViejo === correoNuevo) {
    return;
  };

  const ids = getFavoritos(correoViejo);

  // Si no tenia nada guardado se borra la clave vieja y ya, sin dejar una lista vacia
  if (ids.length > 0) {
    guardarFavoritos(correoNuevo, ids);
  };

  localStorage.removeItem(getClave(correoViejo));
};
