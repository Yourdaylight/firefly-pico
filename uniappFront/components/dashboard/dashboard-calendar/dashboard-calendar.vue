<template>
  <view class="dashboard-calendar">
    <dashboard-calendar-month :start="startDate" :end="endDate" />
  </view>
</template>

<script>
export default {
  computed: {
    startDate() {
      return new Date(this.$store.state.dataStore.dashboardDateStart)
    },
    endDate() {
      return new Date(this.$store.state.dataStore.dashboardDateEnd)
    }
  }
}
</script>

<style scoped>
.dashboard-calendar {
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  margin: 10px 0;
}
</style>
