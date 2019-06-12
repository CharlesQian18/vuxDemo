<template>
  <div>
    <inline-loading></inline-loading>
    <span style="vertical-align:middle;display:inline-block;font-size:14px;">&nbsp;&nbsp;{{ '钉钉登陆中' }}</span>
  </div>
</template>

<script>
import {
  InlineLoading
} from 'vux'
import * as dd from 'dingtalk-jsapi' // 此方式为整体加载，也可按需进行加载
import axios from 'axios'

export default {
  components: {
    InlineLoading
  },
  mounted () {
    var _this = this
    dd.ready(function () {
      // dd.ready参数为回调函数，在环境准备就绪时触发，jsapi的调用需要保证在该回调函数触发后调用，否则无效。
      dd.runtime.permission.requestAuthCode({
        corpId: 'ding8b7c178b89e1e74f35c2f4657eb6378f',
        onSuccess: function (result) {
          axios.get('http://192.168.1.75:8888/dingLogin', {
            params: {
              code: result.code
            }
          }).then(res => {
            if (res.data.data.errcode === 0) {
              _this.$router.push({
                name: 'CalList',
                params: {
                  userid: res.data.data.userid,
                  name: res.data.data.name
                }
              })
            } else {
              _this.$message.err(res.data.data.errmsg)
            }
            console.log(res.data.data)
          })
          // 请求后端设置卡类型
        },
        onFail: function (err) {
          alert(err)
        }
      })
    })
  }

}

</script>
