import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import naive from 'naive-ui'
import { createPinia } from 'pinia'
import './style.css'
import './preflight.css'
import '@/permission' // permission control

const store = createPinia()
const app = createApp(App)

app.use(naive)
app.use(router)
app.use(store)
app.mount('#app')
