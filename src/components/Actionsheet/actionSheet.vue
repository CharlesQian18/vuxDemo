<template>
  <div>
    <actionsheet v-model="show" :menus="menu" theme="android" @on-click-menu="click"
      @on-after-hide="log('after hide')" @on-after-show="log('after show')">
    </actionsheet>
  </div>
</template>

<script>
import {Actionsheet} from 'vux'
import {
  search
} from '@/api/index'
export default {
  name: 'showItem',
  components: {
    Actionsheet
  },
  props: {
    AfterChange: Function
  },
  data () {
    return {
      menu: {},
      show: false,
      param: {},
      url: '',
      list: []
    }
  },
  watch: {
    param: {
      handler: function (val, oldval) {
        if (val.type !== oldval.type) {
          this.handleSearch()
        }
      }
    }
  },
  methods: {
    log (str) {
    },
    // 显示并加载数据
    handleShow (url, param) {
      this.show = true
      this.param = param
      this.url = url
    },
    handleSearch () {
      search(this.param, this.url).then(res => {
        if (!res.data.list.data) return
        this.list = res.data.list.data
        let josnText = '{'
        let i = 1
        this.list.forEach(d => {
          josnText += '"menu' + i + '":"' + d.dicname + '",'
          i++
        })
        josnText = josnText.replace(/(.*)[,，]$/, '$1') + '}'
        this.menu = JSON.parse(josnText)
      }).catch(err => {
        console.log(err)
      })
    },
    // 返回值
    click (key) {
      const index = parseInt(key.replace('menu', '')) - 1
      const item = this.list[index]
      console.log(item)
      this.AfterChange(item)
    }
  }
}

</script>

<style>
  .popup0 {
    padding-bottom: 15px;
    height: 200px;
  }

  .popup1 {
    width: 100%;
    height: 100%;
  }

</style>
