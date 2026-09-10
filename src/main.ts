import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { useThemeStore } from './stores/theme'

const app = createApp(App)
app.use(router)
app.mount('#app')

// 启动前先把主题应用上，避免首次渲染闪白
useThemeStore().init()
