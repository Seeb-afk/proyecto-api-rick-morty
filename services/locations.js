import { endpoints } from "../config/endpoints.js";

async function getLocations(url) {
  
  try {

    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    return `Ha ocurrido un evento inesperado: ${error}`;
  }
};

export const dataLocations = await getLocations(endpoints.locations);