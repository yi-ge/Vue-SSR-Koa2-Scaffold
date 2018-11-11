<template>
  <div>Hello {{ world }} {{ text }}</div>
</template>

<script>
export default {
  data () {
    return {
      text: null
    }
  },
  asyncData ({ store, route }) {
    // 触发 action 后，会返回 Promise
    return store.dispatch('api/fetchVal', route.params.id)
  },
  computed: {
    // 从 store 的 state 对象中的获取从API拿到的数据
    world () {
      return this.$store.state.api.text
    }
  },
  created () {
    this.text = 'SSR'
  }
}
</script>
