const sessionKey = "rickandmorty-session"

export function getSession() {
  try {
    const key = sessionStorage.getItem(sessionKey);
    return key ? JSON.parse(key) : null;
  } catch {
    return null;
  };
};

export function saveSession(session) {
  sessionStorage.setItem((sessionKey), JSON.stringify(session));
};

export function clearSession() {
  sessionStorage.removeItem(sessionKey);
};

export function requireAuth (loginUrl = "../identifier/login.html") {
  if (!getSession()) window.location.href = loginUrl;
};

export function redirectIfAutenticated(mainUrl = "../app/main.html") {
  if (getSession()) window.location.href = mainUrl;
};

export function logout(loginUrl = "../identifier/login.html") {
  clearSession();
  window.location.href = loginUrl;
};