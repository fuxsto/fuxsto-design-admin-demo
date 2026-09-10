import { reactive, computed } from 'vue'
import { avatarDataUri } from '@/utils/media'

export interface UserInfo {
  id: number
  name: string
  email: string
  role: 'admin' | 'manager' | 'user'
  avatar: string
  online: boolean
}

function defaultUser(): UserInfo {
  const name = '示例管理员'
  return {
    id: 1,
    name,
    email: 'demo@example.com',
    role: 'admin',
    avatar: avatarDataUri(name),
    online: true,
  }
}

const state = reactive<{ user: UserInfo | null }>({ user: defaultUser() })

export function useUserStore() {
  function login(payload: UserInfo) {
    state.user = payload
  }
  function logout() {
    state.user = null
  }
  function update(patch: Partial<UserInfo>) {
    if (state.user) state.user = { ...state.user, ...patch }
  }
  const isLogged = computed(() => state.user !== null)
  return { state, isLogged, login, logout, update }
}
