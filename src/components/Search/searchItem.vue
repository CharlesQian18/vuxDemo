<template>
  <div >
    <popup v-model="show" height="100%">
       <popup-header left-text="返回" :right-text="''" :title="title" @on-click-left="show=false"></popup-header>
      <div class="popup1">
        <search @result-click="resultClick" @on-change="getResult" :results="results" v-model="value"
          position="absolute" auto-scroll-to-top top="46px" @on-focus="onFocus" @on-cancel="onCancel"
          @on-submit="onSubmit" ref="search">
        </search>
      </div>
    </popup>
  </div>
</template>

<script>
import {
  Search,
  Group,
  Cell,
  XButton,
  Popup,
  PopupHeader
} from 'vux'

import {
  search
} from '@/api/index'
import { setTimeout } from 'timers'

export default {
  name: 'search1',
  components: {
    Search,
    Group,
    Cell,
    XButton,
    Popup,
    PopupHeader
  },
  props: {
    AfterChange: Function
  },
  mounted () {
    // this.setFocus()
  },
  methods: {
    setFocus () {
      this.$refs.search.setFocus()
    },
    resultClick (item) {
      this.AfterChange(item)
      this.show = false
    },
    // 显示并加载数据
    handleShow (url, param, dataUrl = '', title = '') {
      this.value = ''
      this.show = true
      this.url = url
      this.dataUrl = dataUrl
      this.results = []
      this.param = param
      if (title !== '') {
        this.title = title
      }
      // this.$refs.search.setFocus()
    },
    getResult (val) {
      if (!this.isonFocus) return

      this.param.CodeOrName = val
      setTimeout(() => {
        this.results = []
        search(this.param, this.url).then(res => {
          let list = []
          if (',WL,inventory'.indexOf(this.dataUrl) > 0) {
            if (!res.data) return
            list = res.data
          } else {
            if (!res.data.list.data) return
            list = res.data.list.data
          }
          console.log(list)
          let i = 0
          list.forEach(d => {
            this.results.push({
              title: `${d.code}   ${d.name} `,
              other: this.changeData(d, i),
              dataUrl: this.dataUrl,
              name: d.name,
              code: d.code
            })
            i++
          })
        }).catch(err => {
          console.log(err)
        })
      }, 500)
    },
    changeData (item, i) {
      if (typeof (item.sfid) !== 'undefined') {
        return item.sfid
      }
      if (typeof (item.wsid) !== 'undefined') {
        return item.wsid
      }
      if (typeof (item.id) !== 'undefined') {
        return item.id
      }
      if (typeof (item.id) !== 'undefined') {
        return item.id
      }
      return i
    },
    onSubmit () {
      this.$refs.search.setBlur()
      this.$vux.toast.show({
        type: 'text',
        position: 'top',
        text: 'on submit'
      })
    },
    onFocus () {
      this.isonFocus = true
    },
    onCancel () {
      this.isonFocus = false
      this.show = false
    }
  },
  data () {
    return {
      results: [],
      value: '',
      show: false,
      param: {},
      url: '',
      dataUrl: '',
      isonFocus: false,
      title: '请输入编码或者名称搜索'
    }
  }
}
</script>
<style lang="less" scoped>
  .popup1 {
    width: 100%;
    height: 100%;
  }

</style>
