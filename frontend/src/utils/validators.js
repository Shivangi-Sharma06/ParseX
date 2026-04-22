export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').toLowerCase());
}

export function validatePassword(password) {
  return String(password || '').length >= 6;
}
