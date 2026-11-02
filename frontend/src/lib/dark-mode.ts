const KEY = 'techatlas:dark-mode'

export function getDarkMode(): boolean {
  return localStorage.getItem(KEY) === 'true'
}

export function setDarkMode(on: boolean) {
  localStorage.setItem(KEY, String(on))
  document.documentElement.classList.toggle('dark', on)
}
