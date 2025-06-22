<template>
  <view class="summary-card" @click="$emit('click')">
    <app-icon :icon="icon" :size="24" />
    <view class="card-content">
      <view class="card-title">{{ title }}</view>
      <view :class="subtitleClass">{{ subtitle }}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    title: String,
    subtitle: [String, Number],
    subtitleClass: {
      type: String,
      default: ''
    },
    icon: String
  },
  computed: {
    computedSubtitleClass() {
      return `card-subtitle ${this.subtitleClass}`
    }
  }
}
</script>

<style scoped>
.summary-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  margin: 5px;
}
.card-content {
  margin-top: 5px;
  text-align: center;
}
.card-title {
  font-size: 12px;
  color: #999;
}
.card-subtitle {
  font-weight: bold;
  font-size: 14px;
  margin-top: 2px;
}
.text-success {
  color: #52c41a;
}
.text-danger {
  color: #f5222d;
}
.text-primary {
  color: #1890ff;
}
</style>
