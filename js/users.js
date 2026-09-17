const storageKey = "rickandmorty-users";

// Almacena a todos los usuarios
export let dataUsers = {
  results: JSON.parse(sessionStorage.getItem(storageKey) ?? "[]")
};

// Guarda los usuarios en sessionStorage para que al llegar a login pueda ingresar, ya que almacena los datos ingresados
export function saveUsers() {
  sessionStorage.setItem(storageKey, JSON.stringify(dataUsers.results));
};