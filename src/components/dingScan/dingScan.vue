<template>
  <div>

  </div>
</template>

<script>

import * as dd from 'dingtalk-jsapi' // 此方式为整体加载，也可按需进行加载

export default {
  props: {
    returnResult: Function
  },
  methods: {
    handleScan () {
      var _this = this
      dd.biz.util.scan({
        type: String, // type 为 all、qrCode、barCode，默认是all。
        onSuccess: function (data) {
          // onSuccess将在扫码成功之后回调
          /* data结构
        { 'text': String}
      */
          // 返回值
          _this.returnResult(data.text)
        },
        onFail: function (err) {
          console.log(err)
        }
      })
    }
  }
}

</script>
