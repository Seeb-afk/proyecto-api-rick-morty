import { dataCharacters } from "../services/characters.js";


const cards = document.getElementById("cards-container");
dataCharacters.results.forEach((character) => {

  const cardHTML = `
    <div class="flex items-center justify-center bg-white p-2 gap-2 rounded-md shadow-sm">
      
    </div>`;
  
  //cards.insertAdjacentHTML("beforeend", cardHTML);
})
