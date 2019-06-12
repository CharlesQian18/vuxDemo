import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login', // url#后面的名称
      name: 'login',
      // 文件路径
      component: () => import('@/views/Login/index.vue'),
      meta: { title: '登陆' } // 相关参数
    },
    {
      path: '/', // url#后面的名称
      name: 'home',
      // 文件路径
      component: () => import('@/views/common/Home.vue'),
      meta: { title: '首页' } // 相关参数
    },
    {
      path: '/warehouse', // url#后面的名称
      name: 'warehouse',
      // 文件路径
      component: () => import('@/views/warehouse/index.vue'),
      meta: { title: '字典新增' } // 相关参数
    },
    {
      path: '/dictionaries', // url#后面的名称
      name: 'dictionaries',
      // 文件路径
      component: () => import('@/views/dictionaries/index.vue'),
      meta: { title: '字典新增' } // 相关参数
    },
    {
      path: '/instock', // url#后面的名称
      name: 'inStock',
      // 文件路径
      component: () => import('@/views/stock/inStock.vue'),
      meta: { title: '入库管理' } // 相关参数
    },
    {
      path: '/outStock', // url#后面的名称
      name: 'outStock',
      // 文件路径
      component: () => import('@/views/stock/outStock.vue'),
      meta: { title: '出库管理' } // 相关参数
    },
    {
      path: '/adaptstock', // url#后面的名称
      name: 'adaptstock',
      // 文件路径
      component: () => import('@/views/stock/adaptStock.vue'),
      meta: { title: '库存调整' } // 相关参数
    },
    {
      path: '/search', // url#后面的名称
      name: 'search',
      // 文件路径
      component: () => import('@/views/stock/components/search.vue'),
      meta: { title: '库存查询' } // 相关参数
    },
    {
      path: '/searchTest', // url#后面的名称
      name: 'searchTest',
      // 文件路径
      component: () => import('@/views/stock/components/searchTest.vue'),
      meta: { title: '库存' } // 相关参数
    },
    {
      path: '/actionsheet', // url#后面的名称
      name: 'actionsheet',
      // 文件路径
      component: () => import('@/components/Actionsheet/actionSheet.vue'),
      meta: { title: '弹出框' } // 相关参数
    },

    {
      path: '/test1', // url#后面的名称
      name: 'test1',
      // 文件路径
      component: () => import('@/components/Search/searchItem.vue'),
      meta: { title: '查询相关' } // 相关参数
    },
    {
      path: '/index',
      component: resolve => require(['../views/calendar/index.vue'], resolve)
    }
  ]
})
