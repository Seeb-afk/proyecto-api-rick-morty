const sessionKey = "rickandmorty-session"

export function getSession() {
  try {
    const key = sessionStorage.getItem(sessionKey);
    return key ? JSON.parse(key) : null;
  } catch {
    return null;
  };
};

/**
 * @function saveSession
 * 
 * @description guarda la sesion de sessionStorage
 */
export function saveSession(session) {
  sessionStorage.setItem((sessionKey), JSON.stringify(session));
};


/**
 * @function clearSession
 * 
 * @description elimina la sesion de sessionStorage
 */
export function clearSession() {
  sessionStorage.removeItem(sessionKey);
};

/**
 * @function logout
 * 
 * @description (Solo debe usarse dentro de los links protegidos) Sales del contenido principal 
 *               y Eliminas los datos de sessionStorage
 */
export function logout(loginUrl = "../identifier/login.html") {
  clearSession();
  window.location.href = loginUrl;
};