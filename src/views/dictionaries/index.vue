<template>
  <div>
    <x-header :right-options="{showMore: true}" @on-click-more="showMenus = true" @on-click-back="$router.push({ path:'/'})" >{{sataus|filterTitle}}</x-header>
    <group>
      <x-input title="类型" placeholder="类型" required  :show-clear="true"
        placeholder-align="right" text-align="right" v-model="postList.type"></x-input>
      <x-input title="编码" placeholder="编码" required  :show-clear="true"
        placeholder-align="right" text-align="right" v-model="postList.dicno"></x-input>
      <x-input title="名称" placeholder="名称" required  :show-clear="true"
        placeholder-align="right" text-align="right" v-model="postList.dicname"></x-input>
        <x-switch title="是否系统参数" v-model="postList.issystem"></x-switch>
    </group>
    <x-button type="primary" @click.native="add">保存</x-button>

    <!-- 插件 -->
    <action-sheet ref="showItem" :AfterChange="handleAfterChange"></action-sheet>
    <search-item ref="searchItem" :AfterChange="handleSearchAfter"></search-item>

    <actionsheet :menus="menus" v-model="showMenus" show-cancel @on-click-menu="handleclick"></actionsheet>
    <alert v-model="Tipshow" :title="'提示'" :content="tipContent"></alert>

    <confirm v-model="ConfirmShow" :title="'删除确认'" @on-confirm="ConfirmClick">
      {{ '确定删除？' }}
    </confirm>

    <confirm v-model="ConfirmAllShow" :title="'删除确认'" @on-confirm="ConfirmAllCilck">
      {{ '确定全部删除？' }}
    </confirm>
  </div>
</template>

<script>
import {
  Search,
  Group,
  Cell,
  XButton,
  XInput,
  GroupTitle,
  Divider,
  XHeader,
  Actionsheet,
  Alert,
  Confirm
} from 'vux'
import dingScan from '@/components/dingScan/dingScan.vue'// 扫码
import actionSheet from '@/components/Actionsheet/actionSheet.vue'
import searchItem from '@/components/Search/searchItem.vue'
import {
  add,
  search,
  del
} from '@/api/index'
var url = 'dictionaries'

export default {
  name: 'search',
  components: {
    Search,
    Group,
    Cell,
    XButton,
    XInput,
    actionSheet,
    GroupTitle,
    Divider,
    searchItem,
    XHeader,
    Actionsheet,
    Alert,
    Confirm,
    dingScan
  },
  filters: {
    filterTitle (sataus) {
      if (sataus === 'Z') {
        return '新增字典'
      } else {
        return '修改字典'
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 初始化
    init () {
      this.postList = {} // 后端参数
    },
    // 新增一条
    handleAdd () {
      this.postList.entry.push({
        fentryid: '',
        position: '',
        sfid: '',
        sfName: '',
        qrcode: '',
        po: '',
        supplier: '',
        batchno: '',
        materialid: '',
        materialName: '',
        materialCode: '',
        typeName: '',
        inventory_type: ''
      })
    },
    // 删除操作
    handleDel (index) {
      this.index = index
      this.ConfirmShow = true
    },
    // 删除明细
    ConfirmClick () {
      this.ConfirmShow = false
      if (this.postList.entry[this.index].fentryid === 0) {
        this.postList.entry.splice(this.index)
      } else {
        this.handleDelete('inventoryDetail/' + this.postList.entry[this.index].fentryid, 1)
      }
    },
    // 整单删除
    ConfirmAllCilck () {
      this.handleDelete('dictionaries/' + this.postList.id, 2)
      this.ConfirmAllShow = false
    },
    // 删除事件
    handleDelete (delUrl, type) {
      del({}, delUrl).then(res => {
        if (type === 1) {
          this.postList.entry.splice(this.index)
        } else {
          this.postList = {
            billTypeName: '',
            orgName: '',
            entry: []
          }
        }
      })
    },
    // 弹出框返回值
    onFocus (type, index = -1) {
      this.index = index
      const param = {
        'type': type
      }
      // 更改后加载数据
      this.$refs['showItem'].handleShow('dictionariesList', param)
    },
    // 弹出框操作后操作返回值
    handleAfterChange (list) {
      switch (list.type) {
        case 'BILLTYPE':
          this.postList.billTypeName = list.dicname
          this.postList.bill_type = list.id
          break
        case 'ORG':
          this.postList.orgName = list.dicname
          this.postList.orgid = list.id
          break
        case 'STOCKTYPE':
          this.postList.entry[this.index].typeName = list.dicname
          this.postList.entry[this.index].inventory_type = list.id
          break
      }
    },
    // 查询弹出
    onFocusSearch (path, index, dataUrl = '', params = {}, title = '') {
      this.index = index
      this.$refs['searchItem'].handleShow(path, params, dataUrl, title)
    },
    // 查询框返回搜索结果，然后搜索单条数据
    handleSearchAfter (item) {
      if ('CW,WL'.indexOf(item.dataUrl) > -1) {
        this.handleSearchReturn(item)
        return
      }
      search({}, item.dataUrl + '/' + item.other).then(res => {
        console.log(res)
        if (!res.data) return
        this.handleSearchReturn(item, res.data)
      }).catch(err => {
        console.log(err)
      })
    },
    // 处理查询返回值
    handleSearchReturn (item, data) {
      console.log(item)
      switch (item.dataUrl) {
        case 'warehouseone':
          this.postList.wsName = data.name
          this.postList.wsid = data.wsid
          break
        case 'CW':
          this.postList.entry[this.index].sfName = item.name
          this.postList.entry[this.index].sfid = item.other
          break
        case 'WL':
          this.postList.entry[this.index].materialName = item.name
          this.postList.entry[this.index].materialid = item.other
          this.postList.entry[this.index].materialCode = item.code
          break
        default:
          console.log(data)
          this.postList = data
          this.sataus = 'A'
          this.menus.menu3 = '删除'
          break
      }
    },
    // 扫码
    handleScan (index) {
      this.index = index
      this.$refs['dingScan'].handleScan()
    },
    // 扫码返回
    returnResult (qrcode) {
      this.postList.entry[this.index].qrcode = qrcode
    },
    // 点击更多
    handleclick (val) {
      if (val === 'menu2') {
        this.onFocusSearch('dictionariesList', -1, 'dictionaries', {}, '输入编码或者名称查询')
      } else if (val === 'menu1') {
        this.init()
      } else {
        this.ConfirmAllShow = true
      }
    },
    // 提交数据到后端
    add () {
      add(this.postList, url).then(res => {
        if (!res.data) {
          this.tipContent = '操作成功'
          this.Tipshow = true
          return
        }
        if (typeof (res.data.entry) === 'undefined') {
          res.data.entry = []
        }
        this.postList = res.data
        this.tipContent = '操作成功'
        this.Tipshow = true
        this.sataus = 'A'
        this.menus.menu3 = '删除'
      }).catch(err => {
        this.tipContent = '操作失败'
        this.Tipshow = true
        console.log(err)
      })
    }
  },
  data () {
    return {
      showMenus: false, // 显示更多
      menus: { // 更多选项
        menu1: '新增',
        menu2: '查询'
      },
      postList: {
        billTypeName: '',
        orgName: '',
        wsName: '',
        entry: []
      }, // 后端参数
      sataus: 'Z', // 单据状态
      Tipshow: false, // 是否显示提示框
      tipContent: '', // 提示框得文本
      ConfirmShow: false, // 是否确定框
      index: -1, // 当前选择行
      ConfirmAllShow: false// 整单删除提示
    }
  }
}

</script>
<style scoped>
  .div_Padding {
    padding: 15px;
  }
  a{
   color: blue
  }
</style>
