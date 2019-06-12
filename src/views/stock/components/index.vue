<template>
  <div>
    <x-header :right-options="{showMore: true}" @on-click-more="showMenus = true" @on-click-back="$router.push({ path:'/'})" >{{sataus|filterTitle}}</x-header>

    <group>
      <x-input title="单号"  :disabled="true"  :show-clear="false"
        placeholder-align="right" text-align="right" v-model="postList.billno"></x-input>

       <x-input title="单据类型" placeholder="单据类型" required  :show-clear="false" @on-focus="onFocus('BILLTYPE')"
        placeholder-align="right" text-align="right" v-model="postList.billTypeName"></x-input>

      <x-input title="组织" placeholder="组织" required  :show-clear="false"
        placeholder-align="right" text-align="right" v-model="postList.orgName"  @on-focus="onFocus('ORG')"></x-input>

      <x-input title="仓库" placeholder="仓库" required  :show-clear="false" v-model="postList.wsName"
        placeholder-align="right" text-align="right" @on-focus="onFocusSearch('warehouseList',-1,'warehouseone')"></x-input>
    </group>

    <div v-for="(o,index) in postList.entry" :key="(o,index)" class="div_Padding">
      <group>
        <group-title slot="title">{{stockTitle}}明细({{index+1}})<span style="float:right;"><a href="javascript:;"
              @click="handleDel(index)">删除</a></span></group-title>

        <x-input title="条码" placeholder="条码" required  :show-clear="false"
          placeholder-align="right" text-align="right" v-model="o.qrcode">
           <x-button slot="right" type="primary" mini @click.native="handleScan(index)">扫码</x-button>
        </x-input>

        <x-input title="仓位" placeholder="仓位" required  :show-clear="false"
          placeholder-align="right" text-align="right" v-model="o.sfName" @on-focus="onFocusSearch('shelfList',index,'CW',{wsid:postList.wsid})"></x-input>

        <x-input title="产品编码" placeholder="输入产品编码" required  :show-clear="false"
          placeholder-align="right" text-align="right" v-model="o.materialCode" @on-focus="onFocusSearch('materialList',index,'WL')"></x-input>

        <x-input title="产品名称" placeholder=""  :show-clear="false" :disabled="true"
          placeholder-align="right" text-align="right" v-model="o.materialName"></x-input>

        <x-input title="颜色" placeholder="颜色" required  :show-clear="false"
          placeholder-align="right" text-align="right" v-model="o.color"></x-input>

        <x-input title="库存类型" placeholder="库存类型" required  :show-clear="false" @on-focus="onFocus('STOCKTYPE',index)"
          placeholder-align="right" text-align="right" v-model="o.typeName"></x-input>

        <x-input title="重量" placeholder="重量" required  :show-clear="false"
          placeholder-align="right" text-align="right" v-model="o.weight"></x-input>

                  <x-input title="PO" placeholder="PO" required  :show-clear="false" v-model="o.po"
          placeholder-align="right" text-align="right"></x-input>

        <x-input title="供应商" placeholder="供应商"   :show-clear="false"
          placeholder-align="right" text-align="right" v-model="o.supplier"></x-input>

        <x-input title="批号" placeholder="批号"   :show-clear="false"
          placeholder-align="right" text-align="right" v-model="o.batchno"></x-input>

        <x-input title="备注" placeholder="备注"   :show-clear="false"
          placeholder-align="right" text-align="right" v-model="o.remark"></x-input>
      </group>
    </div>
    <div class="div_Padding">
      <divider><a href="javascript:;" @click="handleAdd">+增加{{stockTitle}}明细</a></divider>
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

    <ding-scan :returnResult='handleReturnResult' ref="dingScan"></ding-scan>
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
var url = 'inventory'

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
  props: {
    stockType: {
      type: String,
      default: ''
    }
  },
  filters: {
    filterTitle (sataus) {
      if (sataus === 'Z') {
        return '新增单据'
      } else {
        return '修改单据'
      }
    }
  },
  // 初始化
  mounted () {
    if (this.stockType === '') {
      this.$router.push({path: '/'})
    }
    this.init()
    this.postList.billTypeCode = this.stockType
    this.stockTitle = this.stockType === 'RK' ? '入库' : '出库'
    search({type: 'BILLTYPE'}, 'dictionariesList').then(res => {
      if (!res.data.list.data) { return }
      res.data.list.data.forEach(d => {
        if (d.dicno === this.stockType) {
          this.postList.billTypeName = d.dicname
          this.postList.bill_type = d.id
        }
      })
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    // 初始化
    init () {
      this.postList = {
        billTypeName: '',
        orgName: '',
        wsName: '',
        entry: [],
        billno: '',
        billTypeCode: ''
      } // 后端参数
    },
    // 新增一条
    handleAdd () {
      this.postList.entry.push({
        fentryid: '',
        position: '',
        sfid: '',
        weight: 0,
        color: '',
        sfName: '',
        qrcode: '',
        po: '',
        supplier: '',
        batchno: '',
        materialid: '',
        materialName: '',
        materialCode: '',
        typeName: '',
        inventory_type: '',
        remark: '',
        sid: ''
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
      if (this.postList.entry[this.index].fentryid === 0 || this.postList.entry[this.index].fentryid === '') {
        this.postList.entry.splice(this.index)
      } else {
        this.handleDelete('inventoryDetail/' + this.postList.entry[this.index].fentryid, 1)
      }
    },
    // 整单删除
    ConfirmAllCilck () {
      this.handleDelete('inventory/' + this.postList.sid, 2)
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
    handleReturnResult (qrcode) {
      // alert(qrcode)
      this.postList.entry[this.index].qrcode = qrcode
      if (this.stockType === 'RK') return
      search({qrcode: qrcode}, 'Inventoryentry').then(res => {
        if (!res.data) { return }
        let i = 0
        res.data.forEach(d => {
          if (i === 0) {
            this.postList.entry[this.index].fentryid = d.fentryid
            this.postList.entry[this.index].position = d.position
            this.postList.entry[this.index].sfid = d.sfid
            this.postList.entry[this.index].weight = d.weight
            this.postList.entry[this.index].color = d.color
            this.postList.entry[this.index].sfName = d.sfName
            this.postList.entry[this.index].qrcode = d.qrcode
            this.postList.entry[this.index].po = d.po
            this.postList.entry[this.index].supplier = d.supplier

            this.postList.entry[this.index].batchno = d.batchno
            this.postList.entry[this.index].materialid = d.materialid
            this.postList.entry[this.index].materialName = d.materialName
            this.postList.entry[this.index].materialCode = d.materialCode

            this.postList.entry[this.index].typeName = d.typeName
            this.postList.entry[this.index].inventory_type = d.inventory_type
            this.postList.entry[this.index].remark = d.remark
            this.postList.entry[this.index].sid = d.sid
          } else {
            this.postList.entry.push(d)
          }
          i++
        })
      }).catch(err => {
        console.log(err)
      })
    },
    // 点击更多
    handleclick (val) {
      if (val === 'menu2') {
        this.onFocusSearch('inventory', -1, 'inventory', {}, '输入单号，条码或者款号查询')
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
    },
    // 保存验证
    verify () {
      if (this.postList.billTypeName === '') {
        this.tipContent = '单据类型必填！'
        this.Tipshow = true
        return
      }
      if (this.postList.orgName === '') {
        this.tipContent = '组织必填！'
        this.Tipshow = true
        return
      }
      if (this.postList.wsName === '') {
        this.tipContent = '仓库必填！'
        this.Tipshow = true
        return
      }
      // 明细
      if (this.postList.entry.length === 0) {
        this.tipContent = '明细必填！'
        this.Tipshow = true
        return
      }
      let i = 0
      this.postList.entry.forEach(d => {
        if (d.sfName === '') {
          this.tipContent = '第' + i + '行，' + '仓位必填！'
          this.Tipshow = true
          return
        }
        if (this.postList.qrcode === '') {
          this.tipContent = '第' + i + '行，' + '条码必填！'
          this.Tipshow = true
          return
        }
        if (this.postList.materialCode === '') {
          this.tipContent = '第' + i + '行，' + '产品编码必填！'
          this.Tipshow = true
          return
        }
        if (this.postList.billTypeName === '') {
          this.tipContent = '单据类型必填！'
          this.Tipshow = true
        }
        i++
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
      ConfirmAllShow: false, // 整单删除提示
      stockTitle: ''
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
