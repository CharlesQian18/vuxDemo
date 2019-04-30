import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/calendar', // url#后面的名称
      name: 'calendar',
      // 文件路径
      component: () => import('@/views/calendar/index.vue'),
      meta: { title: '日历' } // 相关参数
    },
    {
      path: '/', // url#后面的名称
      name: 'barcode',
      // 文件路径
      component: () => import('@/views/barcode/index.vue'),
      meta: { title: '日历' } // 相关参数
    }
  ]
})
