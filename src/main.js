// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import { getUrlKey } from '@/utils/index.js'
import { isHasUser } from '@/utils/getToken.js'

Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */

// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  const userid = getUrlKey('userid')
  console.log(to.path)
  if (to.path !== '/index') {
    if (isHasUser(userid) && (to.path !== '/list')) {
      next('/list')
    } else {
    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
      next()
    }
  } else {
    next()
  }
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
