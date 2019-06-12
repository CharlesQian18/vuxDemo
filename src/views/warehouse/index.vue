<template>
  <div>
   <x-header :right-options="{showMore: true}" @on-click-more="showMenus = true" @on-click-back="$router.push({ path:'/'})" >{{sataus|filterTitle}}</x-header>
    <group>
      <x-input title="编码" placeholder="编码" required ref="clearNo" placeholder-align="right" text-align="right"
        :show-clear="false" v-model="postList.code"></x-input>

      <x-input title="名称" placeholder="名称" required :show-clear="false" placeholder-align="right" text-align="right"
        v-model="postList.name"></x-input>

      <x-input title="管理员" placeholder="管理员" :show-clear="false" placeholder-align="right" text-align="right"
        v-model="postList.ws_admin"></x-input>

      <x-input title="地址" placeholder="地址" :show-clear="false" v-model="postList.address" placeholder-align="right"
        text-align="right"></x-input>
    </group>

    <div v-for="(o,index) in postList.entry" :key="(o,index)" class="div_Padding">
      <group>
        <group-title slot="title">仓位明细({{index+1}})<span style="float:right;"><a href="javascript:;"
              @click="handleDel(index)">删除</a></span></group-title>

        <x-input title="仓位号" placeholder="仓位号" required :show-clear="false" placeholder-align="right" text-align="right"
          v-model="o.code"></x-input>

        <x-input title="名称" placeholder="名称" required :show-clear="false" placeholder-align="right" text-align="right"
          v-model="o.name"></x-input>

        <x-input title="位置" placeholder="位置" :show-clear="false" v-model="o.position" placeholder-align="right"
          text-align="right"></x-input>

      </group>
    </div>
    <div class="div_Padding">
      <divider><a href="javascript:;" @click="handleAdd">+新增仓位明细</a></divider>
    </div>
    <div class="div_Padding">
      <x-button type="primary" @click.native="add">保存</x-button>
    </div>
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

import actionSheet from '@/components/Actionsheet/actionSheet.vue'
import searchItem from '@/components/Search/searchItem.vue'
import {
  add,
  search,
  del
} from '@/api/index'
var url = 'warehouse'

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
    Confirm
  },
  filters: {
    filterTitle (sataus) {
      if (sataus === 'Z') {
        return '新增仓库'
      } else {
        return '修改仓库'
      }
    }
  },
  methods: {
    // 新增一条
    handleAdd () {
      this.postList.entry.push({
        code: '',
        name: '',
        position: '',
        sfid: ''
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
      if (this.postList.entry[this.index].sfid === 0) {
        this.postList.entry.splice(this.index)
      } else {
        this.handleDelete('shelf/' + this.postList.entry[this.index].sfid, 1)
      }
    },
    // 整单删除
    ConfirmAllCilck () {
      this.handleDelete('warehouse/' + this.postList.wsid, 2)
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
    onFocus (type, index) {
      if (index === 0) {
        const param = {
          'type': type
        }
        // 更改后加载数据
        this.$refs['showItem'].handleShow('dictionariesList', param)
      } else if (index === 1) { // 搜索框
        this.$refs['searchItem'].handleShow('warehouseList', {}, '')
      }
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
      }
    },
    // 查询框返回搜索结果，然后搜索单条数据
    handleSearchAfter (item) {
      search({}, url + '/' + item.other).then(res => {
        console.log(res)
        if (!res.data) return
        this.postList = res.data
        this.sataus = 'A'
        this.menus.menu3 = '删除'
      }).catch(err => {
        console.log(err)
      })
    },
    // 点击更多
    handleclick (val) {
      if (val === 'menu2') {
        this.onFocus('List', 1)
      } else if (val === 'menu1') {
        this.postList = {
          billTypeName: '',
          orgName: '',
          entry: []
        }
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
      postList: { // 后端参数
        billTypeName: '',
        orgName: '',
        entry: []
      },
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
