<template>
<div>
    <!-- start-date="2016-04-01"
  end-date="2018-05-30"
    :render-month='[new Date().getFullYear(), new Date().getMonth()]'
  -->
  <inline-calendar
  ref="calendar"
  @on-change="onChange"
  @on-view-change="onViewChange"
  class="inline-calendar-demo"
  :show.sync="show"
  v-model="postFrom.value"
  :range="range"
  :show-last-month="showLastMonth"
  :show-next-month="showNextMonth"
  :highlight-weekend="highlightWeekend"
  :return-six-rows="return6Rows"
  :hide-header="hideHeader"
  :hide-week-list="hideWeekList"
  :replace-text-list="replaceTextList"
  :weeks-list="weeksList"
  :render-function="buildSlotFn"
  :disable-past="disablePast"
  :disable-future="true"
  :disable-weekend="disableWeekend"
  :disable-date-function="disableDateFunction"
  :back-color-list="ColorList">
  </inline-calendar>

  <group>
    <cell :title="'餐补次数'"  :value="postFrom.total "></cell>
    <cell :title="'当前选择时间'" :value="postFrom.value"></cell>
      <x-input label-width="4em" :title="'备注'" placeholder="请输入备注" v-model="postFrom.fnote"></x-input>
  </group>

  <div style="margin: 15px;">
    <x-button :type="postFrom.btnType" @click.native="handelPost" :disabled="postFrom.isDisable">{{postFrom.btnTitle}}</x-button>
  </div>
 <alert v-model="show" :title="'提示'" > {{ '设置为正常时，备注必填' }}</alert>
</div>
</template>

<script>
import { InlineCalendar, Group, XSwitch, Radio, XButton, Cell, Divider, XInput, Alert } from 'vux'
import { parseTime } from '@/utils/index.js'
import axios from 'axios'

export default {
  created () {
    this.postFrom.userId = this.getUrlKey('userid') ? this.getUrlKey('userid') : '050305515626428343'
    this.postFrom.value = new Date().getFullYear() + '-' + new Date().getMonth()
    this.fetch()
  },
  methods: {
    getUrlKey (name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) ||
                    ['', ''])[1].replace(/\+/g, '%20')) || null
    },
    onChange (val) {
      this.ColorList.forEach(d => {
        if (d.day === val) {
          this.curruntValue = d
          this.postFrom.isDisable = false
          this.postFrom.fnote = d.fnote
          if (d.type === 0) {
            this.postFrom.btnTitle = '设置为正常'
            this.postFrom.btnType = 'primary'
          } else {
            this.postFrom.btnTitle = '设置为异常'
            this.postFrom.btnType = 'warn'
          }
        }
      })
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
      axios.get('http://120.236.71.199:8014/attendance/list', {
        params: {
          userId: this.postFrom.userId,
          month: month
        }
      }).then(res => {
        if (res.data.data) {
          res.data.data.forEach(d => {
            d.workDate = parseTime(d.workDate, '{y}-{m}-{d}')
            if (!d.onTime && !d.offTime) {
              return false
            }

            d.onTime = parseTime(d.onTime, '{h}:{i}')
            d.offTime = parseTime(d.offTime, '{h}:{i}')
            let type = 1
            if (d.onMeal + d.offMeal === 0) {
              type = 0
            }
            this.postFrom.total += d.onMeal + d.offMeal
            this.ColorList.push({type: type, day: d.workDate, fnote: ''})
            this.succeedList.push(d)
          })

          this.buildSlotFn = (line, index, data) => {
            for (let i = 0; i < this.ColorList.length; i++) {
              if (this.ColorList[i].day === data.formatedDate) {
                return '<div style="font-size:12px;text-align:center;"> ' + this.succeedList[i].onTime + '</div>' +
          '<div style="font-size:12px;text-align:center;"> ' + this.succeedList[i].offTime + '</div>' +
          '<div style="font-size:12px;text-align:center;"> 餐补:' + (this.succeedList[i].onMeal + this.succeedList[i].offMeal) + '</div>' +
          '<div style="font-size:12px;text-align:center;"> ' + (this.ColorList[i].fnote.length === 0 ? '' : '备注:' + this.ColorList[i].fnote) + '</div>'
              }
            }
            return '<div style="height:19px;"></div>'
          }
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    handelPost () {
      if (this.curruntValue.type === 0 && this.postFrom.fnote.length === 0) {
        this.show = true
        return false
      }
      if (this.curruntValue.type === 0) {
        this.curruntValue.type = 1
      } else {
        this.curruntValue.type = 0
      }
      this.curruntValue.fnote = this.postFrom.fnote
    }
  },
  data () {
    return {
      show: false,
      postFrom: {total: 0, value: '', isDisable: true, btnType: 'primary', btnTitle: '设置为正常', fnote: '', userId: ''},
      valueObejct: {},
      curruntValue: {},
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
    Alert
  }
}
</script>

<style lang="less" scoped>
.inline-calendar-demo {
  background: rgba(255,255,255,0.9);
}
</style>
