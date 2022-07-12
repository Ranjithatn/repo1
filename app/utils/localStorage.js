// @flow
export function set(key: string, val: string) {
  localStorage.setItem(key, val);
}

export function get(key: string) {
  return localStorage.getItem(key);
}

export function remove(key: string) {
  return localStorage.removeItem(key);
}