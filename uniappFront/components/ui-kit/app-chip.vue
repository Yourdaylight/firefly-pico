<template>
  <view class="app-chip">
    <text v-if="title" class="title">{{ title }}</text>
    <text v-if="subtitle" class="subtitle">{{ subtitle }}</text>
  </view>
</template>

<script>
export default {
  props: {
    title: String,
    subtitle: String
  }
}
</script>

<style scoped>
.app-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 10px;
  background-color: #f5f5f5;
  border-radius: 16px;
  margin: 5px;
}
.title {
  font-weight: 600;
  font-size: 12px;
}
.subtitle {
  font-size: 14px;
  margin-top: 2px;
}
</style>
