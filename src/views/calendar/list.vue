<template>
  <div class="app-container">
    <sticky :className="'sub-navbar draft'">

      <el-button type="primary" @click="getList">刷新
      </el-button>
      <el-button type="primary" @click="handleExport">导出
      </el-button>
      <el-button type="primary" @click="handleSet">设置本人餐补
      </el-button>
    </sticky>
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%"
     @current-change="handleSelectionChange" :row-key='getRowKeys' :expand-row-keys="expands" @row-click="rowClick">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand" v-for="o in scope.row.changeAttendance"
            :key="o">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="日期">
                  <span>{{ o.workDate |parseTime}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="更新后餐补次数">
                  <span>{{ o.onMeal }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="异常原因">
                  <span>{{'上班：' + (!o.onProcType || o.onProcType === '' ? o.onRemark : o.onProcType)}}</span>
                  <p>{{'下班：' + (!o.offProcType || o.offProcType === '' ? o.offRemark : o.offProcType)}}</p>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="更正原因">
                  <span>{{ o.remark }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110" align="center" :render-header="checkFieldColumn"
        show-overflow-tooltip column-key="isConfirm">

        <template slot-scope="scope">
          <el-button type="success" v-if="scope.row.confirmDate!==null" disabled>已确认
          </el-button>
          <el-button type="primary" v-else @click="handelConfirm(scope.row)">未确认</el-button>
        </template>
      </el-table-column>

      <el-table-column label="时间" width="120" show-overflow-tooltip :render-header="customFieldColumn" align="center"
        column-key="month">
        <template slot-scope="scope">
          <span>{{scope.row.month}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="姓名" width="120" :render-header="customFieldColumn" align="center"
        column-key="userName">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="餐补次数(午)" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.workMealTimes}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="餐补日期(午)" minWidth="120px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.workMealDays}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="餐补次数(晚)" width="120px" align="center" column-key="salerName">
        <template slot-scope="scope">
          <span>{{scope.row.overMealTimes}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="餐补日期(晚)" minWidth="120px" align="center" column-key="orgName">
        <template slot-scope="scope">
          <span>{{scope.row.overTimeDays}}</span>
        </template>
      </el-table-column>

  <el-table-column show-overflow-tooltip label="调整次数" width="120px" align="center" column-key="creatorname">
        <!-- <template slot-scope="scope">
          <span>{{scope.row.workMealTimes+scope.row.overMealTimes}}</span>
        </template> -->
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.payTimes"></el-input>
          </template>
          <span v-else>{{scope.row.payTimes}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="餐补次数(合计)" width="120px" align="center" column-key="creatorname">
        <template slot-scope="scope">
          <span>{{scope.row.workMealTimes+scope.row.overMealTimes+parseInt(scope.row.payTimes===''||isNaN(scope.row.payTimes)?0:scope.row.payTimes)}}</span>
        </template>
    </el-table-column>

      <el-table-column show-overflow-tooltip label="金额" width="100px" align="center" column-key="creatorname">
        <template slot-scope="scope">
          <span>{{(scope.row.workMealTimes+scope.row.overMealTimes+ parseInt(scope.row.payTimes===''||isNaN(scope.row.payTimes)?0:scope.row.payTimes))*15}}</span>
          <!-- <span>{{scope.row.payAmount}}</span> -->
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="备注" width="100px" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.remark"></el-input>
          </template>
          <span v-else>{{scope.row.remark}}</span>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import {
  XHeader
} from 'vux'
import Sticky from '@/components/Sticky' // 粘性header组件
import {
  parseTime,
  getUrlKey
} from '@/utils/index.js'
import {
  inputFilter
} from '@/utils/list'
import axios from 'axios'
const url = 'http://120.236.71.199:8014/'

const companyId = 1
export default {
  components: {
    XHeader,
    Sticky
  },
  name: 'CalList',
  data () {
    return {
      search: '',
      FilterDate: '',
      list: [],
      total: 0,
      listLoading: true,
      multipleSelection: [],
      expands: [],
      listQuery: {
        isPage: true,
        pageNum: 1,
        pageSize: 10
      },
      // 获取row的key值
      getRowKeys (row) {
        return row.newID
      }
    }
  },
  created () {
    this.listQuery.companyId = companyId
    this.getList()
  },
  filters: {
    parseTime (val) {
      return parseTime(val, '{y}-{m}-{d}')
    }
  },
  methods: {
    handleSet () {
      // this.$router.push('/')
      const that = this
      that.$router.push({
        path: '/index'
      })
    },
    getList () {
      this.listLoading = true
      axios.get(url + 'attendance/collectList', {
        params: this.listQuery
      }).then(res => {
        if (res.data.data.list) {
          this.expands = []
          this.list = []
          var i = 1
          res.data.data.list.forEach(d => {
            d.newID = i
            d.edit = false
            this.list.push(d)
            if (d.changeTimes > 0) {
              this.expands.push(d.newID)
            }
            i++
          })

          this.listLoading = false
          this.total = res.data.data.total
        }
        console.log(this.expands)
      }).catch(res => {
        this.listLoading = false
      })
    },
    handleSizeChange (val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handelConfirm (row) {
      this.$confirm('确认后将无法修改, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirm(row)
      }).catch(() => {})
    },
    // 确认
    confirm (row) {
      var params = JSON.stringify({
        'companyId': companyId,
        'confirmUser': getUrlKey('userid'),
        'month': row.month,
        'userId': row.userId,
        'remark': row.remark,
        'payAmount': row.workMealTimes + row.overMealTimes + parseInt(row.payTimes === '' || isNaN(row.payTimes) ? 0 : row.payTimes) * 15,
        'payTimes': parseInt(row.payTimes === '' || isNaN(row.payTimes) ? 0 : row.payTimes)
      })
      this.listLoading = true
      axios({
        url: url + 'attendance/pay',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8' // application/x-www-form-urlencoded;charset=UTF-8
        },
        data: params,
        timeout: 6000
      }).then(res => {
        if (!res.data.data || res.data.code !== 20000) {
          return
        }
        row.confirmDate = res.data.data.confirmDate
        this.listLoading = false
      })
    },
    // 查询
    customFieldColumn (h, {
      column,
      $index
    }) {
      return (
        h('span', [
          h('span', column.label + ' '),
          h('el-input', {
            props: {
              placeholder: '请输入内容',
              clearable: true
            },
            on: {
              change: ($event) => {
                this.handleInputFilter($event, column)
              }
            }
          }, [
            h('i', {
              class: 'el-icon-question'
            })
          ])
        ])
      )
    },
    checkFieldColumn (h, {
      column,
      $index
    }) {
      return (
        h('span', [
          h('span', column.label + ' '),
          h('el-checkbox', {
            props: {
              clearable: true
            },
            on: {
              change: ($event) => {
                this.handleInputFilter($event, column)
              }
            }
          }, [
            h('i', {
              class: 'el-icon-question'
            })
          ])
        ])
      )
    },

    handleInputFilter (value, column) {
      if (column.columnKey === 'isConfirm' && value === false) {
        value = ''
      }
      this.listQuery = inputFilter(value, column, this.listQuery)
      if (column.columnKey === 'month') {
        try {
          let date = new Date(value)
          this.listQuery.year = date.getFullYear()
          this.listQuery.month = date.getMonth() + 1
        } catch (error) {
          this.$message({
            message: '请正确填写时间,格式：2019-01',
            type: 'warning'
          })
        }
      }
      this.getList()
    },

    // 导出
    handleExport () {
      let Query = JSON.parse(JSON.stringify(this.listQuery))
      Query.isPage = false
      this.listLoading = true
      axios.get(url + 'attendance/collectList', {
        params: Query
      }).then(res => {
          import('@/components/Excel/Export2Excel').then(excel => {
            const tHeader = ['时间', '姓名', '餐补次数(午)', '餐补日期(午)', '餐补次数(晚)', '餐补日期(晚)', '调整次数', '餐补次数(合计)', '金额']
            const filterVal = ['month', 'name', 'workMealTimes', 'workMealDays', 'overMealTimes',
              'overTimeDays', 'payTimes',
              'total', 'amount'
            ]
            const list = res.data.data
            const data = this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '餐补' + new Date().getTime(),
              autoWidth: 100
            })
            this.downloadLoading = false
          })
          this.listLoading = false
      }).catch(d => {
        this.listLoading = false
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        v.total = v.workMealTimes + v.overMealTimes + v.payTimes
        v.amount = v.total * 15
        return v[j]
      }))
    },
    // 在<table>里，我们已经设置row的key值设置为每行数据id：row-key="id"
    rowClick (row, event, column) {
      if (this.expands.indexOf(row.newID) < 0) {
        this.expands.push(row.id)
      } else {
        this.expands.remove(row.id)
      }
    },
    // 行改变时发生
    handleSelectionChange (currentRow, oldCurrentRow) {
      currentRow.edit = true
      if (oldCurrentRow != null) {
        oldCurrentRow.edit = false
      }
      // this.currentRow = currentRow
    }

  }
}

</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;

  }

  .space-btn {
    padding: 5px 0;
    margin: 10px;
    text-align: center;
    border: 1px red solid;
  }

  .space {
    padding: 30px 0;
    margin: 10px;
    text-align: center;
    border: 1px green solid;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

</style>
