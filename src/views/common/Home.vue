<template>
  <div>

    <group-title>基础资料</group-title>
    <grid :cols="4" :show-lr-borders="false">
      <grid-item :label="i.label" v-for="i in baseList" :key="i"  :link="i.link">
        <img slot="icon" :src="i.src">
      </grid-item>
    </grid>

    <group-title>库存管理</group-title>
    <grid :cols="4" :show-lr-borders="false">
      <grid-item :label="i.label" v-for="i in billList" :key="i"  :link="i.link">
        <img slot="icon" :src="i.src">
      </grid-item>
    </grid>

  </div>
</template>

<script>
import {
  Grid,
  GridItem,
  GroupTitle
} from 'vux'

export default {
  components: {
    Grid,
    GridItem,
    GroupTitle
  },
  data () {
    return {
      baseList: [{
        label: '数据字典',
        link: '/dictionaries',
        src: 'static/img/dictionaries.png'
      }, {
        label: '仓库管理',
        link: '/warehouse',
        src: 'static/img/warehouse.png'
      }],
      billList: [{
        label: '入库管理',
        link: '/inStock',
        src: 'static/img/instock.png'
      }, {
        label: '出库管理',
        link: '/outStock',
        src: 'static/img/outstock.png'
      }, {
        label: '库存调整',
        link: '/adaptStock',
        src: 'static/img/adapt.png'
      }, {
        label: '出入库明细查询',
        link: '/search',
        src: 'static/img/stocksearch.png'
      }]
    }
  },
  methods: {
    onItemClick () {
      console.log('on item click')
    }
  }
}
</script>

<style scoped>
  .grid-center {
    display: block;
    text-align: center;
    color: #666;
  }

  .weui-grids {
    background-color: #fff;
  }

</style>
