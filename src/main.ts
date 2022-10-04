// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
import { createApp } from 'vue'
import store from '@/store'
import App from '@/App.vue'
import '@/style/global.scss'
import '@/permission' // permission control
import router from '@/router'
import naive from 'naive-ui'

const app = createApp(App)
app.use(naive)
app.use(router)
app.use(store)
app.mount('#app')
