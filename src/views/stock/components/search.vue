<template>
  <div>
    <group>
      <cell @cell-font-size="10"  v-for="o in postList" :key="o" :title="o.materialName+'('+o.materialCode+')'" :inline-desc="'仓位: '+o.sfName+'|颜色:'+o.color+'('+o.typeName+')'" primary="content" :value="'库存:'+o.weight">
      </cell>
    </group>
  </div>
</template>

<script>
import {
  Group,
  GroupTitle,
  Cell,
  CellBox
} from 'vux'

import {
  search
} from '@/api/index'
export default {
  components: {
    Group,
    GroupTitle,
    Cell,
    CellBox

  },
  mounted () {
    this.fectchList()
  },
  data () {
    return {
      data1: 0,
      postList: [],
      page: 1

    }
  },
  methods: {
    fectchList () {
      search({page: this.page}, 'Inventoryentry').then(res => {
        if (!res.data) { return }
        this.postList = res.data
      }).catch(err => {
        console.log(err)
      })
    }
  }
}

</script>

<style scoped>
div_left{
  float: left;
}
</style>
