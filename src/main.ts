import { createApp } from 'vue'
import store from '@/store'
import App from './App.vue'
import './style/global.scss'
import './permission' // permission control
import router from './router'

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')

// const userStore = useUserStore()
//
// userStore.setUserInfo({
//     id: '1',
//     email: 'test-email',
//     nickname: 'test-nickname',
//     avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh0tJhJWjd5dacn4jpGOtqtCs-qvW5u4xGYg&usqp=CAU',
//     role: 'admin',
//     createdAt: ''
// })
// userStore.setToken('test-token')
// console.log('模拟用户成功(role:Admin)')
