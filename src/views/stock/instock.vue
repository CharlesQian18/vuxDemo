<template>
<in-Stock :stock-type="'RK'"></in-Stock>
</template>
<script>
import inStock from './components/index'
export default {
  name: 'instock',
  components: { inStock }
}
</script>
