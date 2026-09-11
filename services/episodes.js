import { endpoints } from "../config/endpoints.js";

async function getEpisodes(url) {
  
  try {

    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    return `Ha ocurrido un evento inesperado: ${error}`;
  }
};

export const dataEpisodes = await getEpisodes(endpoints.episodes);