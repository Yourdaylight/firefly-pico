<template>
  <div>
    <!-- 这里放置公共组件 -->
    <router-view />
  </div>
</template>

<script>
export default {
  onLaunch() {
    console.log('App Launch')
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  }
}
</script>

<style>
/* 这里放置全局样式 */
</style>
