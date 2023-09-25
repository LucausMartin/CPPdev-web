import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'highlight.js/styles/atom-one-dark.css'
import 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import 'highlight.js/styles/androidstudio.css'



import './assets/main.less'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(hljsVuePlugin)
app.mount('#app')
