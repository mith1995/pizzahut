export function isLoggedIn() {
  // example: access token / user object check
  return !!localStorage.getItem("access");
  // ya Redux store me user state check
}

export function isGuest() {
  return !isLoggedIn();
}
