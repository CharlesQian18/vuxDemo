<template>
  <div>
    <sticky :className="'sub-navbar draft'"  v-if="hideHeader">
      <el-button type="primary" @click="handleSet">返回列表
      </el-button>
    </sticky>

    <inline-calendar ref="calendar" @on-change="onChange" @on-view-change="onViewChange" class="inline-calendar-demo"
      :show.sync="show" v-model="postFrom.value" :range="range" :show-last-month="showLastMonth"
      :show-next-month="showNextMonth" :highlight-weekend="highlightWeekend" :return-six-rows="return6Rows"
      :hide-week-list="hideWeekList" :replace-text-list="replaceTextList"
      :weeks-list="weeksList" :render-function="buildSlotFn" :disable-past="disablePast" :disable-future="true"
      :disable-weekend="disableWeekend" :disable-date-function="disableDateFunction" :back-color-list="ColorList">
    </inline-calendar>

    <group>
      <cell :title="postFrom.name+'-餐补次数'" :value="postFrom.total "></cell>
      <cell :title="'餐补次数(午)'" :value="postFrom.onMeal "></cell>
      <cell :title="'餐补日期(午)'" :value="postFrom.onMealDays "></cell>
      <cell :title="'餐补次数(晚)'" :value="postFrom.offMeal "></cell>
      <cell :title="'餐补日期(晚)'" :value="postFrom.offMealDays "></cell>
      <!-- <cell :title="'当前选择时间'" :value="postFrom.value"></cell> -->
      <x-input label-width="4em" :title="'备注'" placeholder="请输入备注" v-model="postFrom.fnote"></x-input>
    </group>

    <div style="margin: 15px;">
      <x-button :type="postFrom.btnType" @click.native="handelPost" :disabled="postFrom.isDisable">{{postFrom.btnTitle}}
      </x-button>
    </div>
    <alert v-model="show" :title="'提示'"> {{ '备注必填' }}</alert>
  </div>
</template>

<script>
import {
  InlineCalendar,
  Group,
  XSwitch,
  Radio,
  XButton,
  Cell,
  Divider,
  XInput,
  Alert
} from 'vux'
import {
  parseTime
} from '@/utils/index.js'
import axios from 'axios'
import Sticky from '@/components/Sticky' // 粘性header组件
import { isHasUser } from '@/utils/getToken.js'
const url = 'http://120.236.71.199:8014/'

const companyId = 2

export default {

  // created () {
  // this.postFrom.userId = getUrlKey('userid') ? getUrlKey('userid') : ''
  // this.hideHeader = isHasUser(this.postFrom.userId)
  // this.postFrom.name = getUrlKey('name') ? getUrlKey('name') : '未找到用户'
  // this.postFrom.value = new Date().getFullYear() + '-' + new Date().getMonth()
  // console.log(1111)
  // this.fetch()
  // },

  mounted () {
    this.postFrom.userId = this.$route.params.userid
    this.hideHeader = isHasUser(this.postFrom.userId)
    this.postFrom.name = this.$route.params.name
    this.postFrom.value = new Date().getFullYear() + '-' + new Date().getMonth()
    this.fetch()
  },
  methods: {
    handleGetUserinfo () {
    },
    handleSet () {
      const that = this
      that.$router.push({ path: '/list' })
    },
    onChange (val) {
      const length = this.ColorList.length
      for (let i = 0; i < length; i++) {
        if (this.ColorList[i].day === val) {
          this.curruntValue = this.ColorList[i]
          this.postFrom.isDisable = false
          this.postFrom.fnote = this.ColorList[i].fnote
          if (this.ColorList[i].type === 0) {
            this.postFrom.btnTitle = '设置为正常'
            this.postFrom.btnType = 'primary'
          } else {
            this.postFrom.btnTitle = '设置为异常'
            this.postFrom.btnType = 'warn'
          }
          this.postFrom.id = this.ColorList[i].id
          this.current = this.succeedLisp[i]
        }
      }
    },
    onViewChange (val, count) {
      this.valueObejct = val
      if (count > 0) {
        this.fetch()
      }
    },
    fetch () {
      this.postFrom.total = 0
      let month = new Date().getMonth()
      if (this.valueObejct.month) {
        month = this.valueObejct.month
      }
      axios.get(url + 'attendance/list', {
        params: {
          userId: this.postFrom.userId,
          month: month,
          companyId: companyId
        }
      }).then(res => {
        if (res.data.data) {
          this.handleInit()
          res.data.data.forEach(d => {
            d.workDate = parseTime(d.workDate, '{y}-{m}-{d}')
            if (!d.onTime && !d.offTime) {
              return false
            }
            d.onTime = parseTime(d.onTime, '{h}:{i}')
            d.offTime = parseTime(d.offTime, '{h}:{i}')
            let type = 1
            if (d.ischange === 0) {
              d.onTime = d.onTime + '(' + (!d.onProcType || d.onProcType === '' ? d.onRemark : d.onProcType) + ')'
              d.offTime = d.offTime + '(' + (!d.offProcType || d.offProcType === '' ? d.offRemark : d.offProcType) + ')'
            }
            if (d.onMeal === 0) {
              type = 0
            } else {
              this.postFrom.onMealDays += d.workDate.substring(8, 10) + ','
            }
            if (d.offMeal === 1) {
              this.postFrom.offMealDays += d.workDate.substring(8, 10) + ','
            }

            this.postFrom.onMeal += d.onMeal
            this.postFrom.offMeal += d.offMeal
            this.postFrom.total += d.onMeal + d.offMeal

            this.ColorList.push({
              type: type,
              day: d.workDate,
              fnote: d.remark,
              id: d.id
            })
            this.succeedList.push(d)
          })
          this.handleColor()
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    handleInit () {
      this.postFrom.onMeal = 0
      this.postFrom.offMeal = 0
      this.postFrom.total = 0
      this.postFrom.onMealDays = ''
      this.postFrom.offMealDays = ''
    },
    // 改变颜色和文字
    handleColor () {
      this.buildSlotFn = (line, index, data) => {
        for (let i = 0; i < this.ColorList.length; i++) {
          if (this.ColorList[i].day === data.formatedDate) {
            return '<div style="font-size:12px;text-align:center;"> ' + this.succeedList[i].onTime + '</div>' +
                '<div style="font-size:12px;text-align:center;"> ' + this.succeedList[i].offTime + '</div>' +
                '<div style="font-size:12px;text-align:center;"> 餐补:' + (this.succeedList[i].onMeal + this
              .succeedList[i].offMeal) + '</div>' +
                '<div style="font-size:12px;text-align:center;"> ' + ((!this.ColorList[i].fnote || this.ColorList[i]
              .fnote.length === 0) ? '' : '备注:' + this.ColorList[i].fnote) + '</div>'
          }
        }
        return '<div style="height:19px;"></div>'
      }
    },
    handelPost () {
      // this.curruntValue.type === 0 &&
      console.log(this.postFrom.fnote)
      if (!this.postFrom.fnote || this.postFrom.fnote.length === 0) {
        this.show = true
        // this.$message({
        //   message: '备注必填',
        //   type: 'warning'
        // })
        return
      } else {
        this.show = false
      }
      var type = 0
      if (this.curruntValue.type === 0) {
        type = 1
      }
      // 请求后端设置卡类型
      axios.post(url + 'attendance/setNormal', {
        id: this.curruntValue.id,
        type: type,
        fnote: this.postFrom.fnote
      }).then(res => {
        if (res.data.code === 20000) {
          location.reload()
        }
      })
    }
  },
  data () {
    return {
      show: false,
      postFrom: {
        total: 0,
        value: '',
        isDisable: true,
        btnType: 'primary',
        btnTitle: '设置为正常',
        fnote: '',
        userId: '',
        id: 0,
        onMeal: 0,
        offMeal: 0,
        onMealDays: '',
        offMealDays: ''
      },
      valueObejct: {},
      curruntValue: {}, // 当前颜色值
      current: {}, // 当前选择
      range: false,
      showLastMonth: true,
      showNextMonth: true,
      highlightWeekend: false,
      return6Rows: true,
      hideHeader: false,
      hideWeekList: false,
      replaceTextList: {},
      ColorList: [],
      succeedList: [],
      changeWeeksList: false,
      weeksList: [],
      buildSlotFn: () => '', // 设置时间
      disablePast: false,
      disableWeekend: false,
      disableDateFunction (date) {
        if (date.formatedDate === '2017-10-16') {
          return true
        }
      }
    }
  },
  watch: {
    changeWeeksList (val) {
      this.weeksList = val ? ['日', '一', '二', '三', '四', '五', '六 '] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    }
  },
  components: {
    InlineCalendar,
    Group,
    XSwitch,
    Radio,
    XButton,
    Cell,
    Divider,
    XInput,
    Alert,
    Sticky
  }
}

</script>

<style lang="less" scoped>
  .inline-calendar-demo {
    background: rgba(255, 255, 255, 0.9);
  }

</style>
