import { ref, watch } from 'vue'

type Theme = 'light' | 'dark'

const THEME_KEY = 'fuxsto-admin-theme'

const themeRef = ref<Theme>('light')
const isDarkRef = ref(false)

function apply(dark: boolean) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', dark)
  }
  isDarkRef.value = dark
}

let inited = false
export function useThemeStore() {
  function init() {
    if (inited) return
    inited = true
    const stored =
      (typeof localStorage !== 'undefined' &&
        (localStorage.getItem(THEME_KEY) as Theme)) ||
      'light'
    themeRef.value = stored
    apply(stored === 'dark')
    watch(themeRef, (v) => {
      try {
        localStorage.setItem(THEME_KEY, v)
      } catch (e) {
        /* noop */
      }
      apply(v === 'dark')
    })
  }
  function toggle() {
    themeRef.value = themeRef.value === 'dark' ? 'light' : 'dark'
  }
  return { theme: themeRef, isDark: isDarkRef, init, toggle }
}
