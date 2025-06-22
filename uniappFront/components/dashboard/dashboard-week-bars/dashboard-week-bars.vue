<template>
  <view class="week-bars-card">
    <view class="card-title">{{ $t('dashboard.expenses_week') }}:</view>
    <view class="bars-container">
      <view class="flex-1" />
      <view 
        v-for="bar in barsList" 
        class="bar-item" 
        @click="onClick(bar)"
      >
        <view class="bar-label">{{ bar.label }}</view>
        <view class="bar-value">{{ bar.value }}</view>
        <view class="bar-chart">
          <view 
            class="bar-fill" 
            :style="{ height: `${bar.percent}%` }"
          />
        </view>
      </view>
      <view class="flex-1" />
    </view>
  </view>
</template>

<script>
import { eachDayOfInterval, format, startOfDay, subDays } from 'date-fns'
import RouteConstants from '@/constants/RouteConstants.js'
import Transaction from '@/models/Transaction.js'
import { formatNumberForDashboard } from '@/utils/NumberUtils.js'
import DateUtils from '@/utils/DateUtils.js'

export default {
  computed: {
    barsList() {
      const amountsList = Object.values(this.$store.state.dataStore.dashboardExpenseByDay)
      const maxAmount = Math.max(...amountsList)

      const daysList = eachDayOfInterval({
        start: subDays(new Date(), 7),
        end: startOfDay(new Date()),
      })
      return daysList.map((date) => {
        const weekdayName = format(date, 'E').toUpperCase()
        const amount = this.$store.state.dataStore.dashboardExpenseByDay[DateUtils.dateToString(date)] || 0
        const percent = (amount / maxAmount) * 100

        return {
          date: date,
          label: weekdayName,
          value: formatNumberForDashboard(amount),
          percent: percent,
        }
      })
    }
  },
  methods: {
    onClick(bar) {
      const url = `${RouteConstants.ROUTE_TRANSACTION_LIST}?dateAfter=${format(bar.date, 'yyyy-MM-dd')}&dateBefore=${format(bar.date, 'yyyy-MM-dd')}&transactionType=${Transaction.types.expense.code}`
      uni.navigateTo({ url })
    }
  }
}
</script>

<style scoped>
.week-bars-card {
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  margin: 10px 0;
}
.card-title {
  font-weight: bold;
  margin-bottom: 15px;
}
.bars-container {
  display: flex;
  align-items: flex-end;
  height: 150px;
}
.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 5px;
}
.bar-label {
  font-size: 12px;
  margin-bottom: 5px;
}
.bar-value {
  font-size: 10px;
  margin-bottom: 5px;
}
.bar-chart {
  width: 20px;
  height: 100px;
  background-color: #f5f5f5;
  border-radius: 3px;
  position: relative;
}
.bar-fill {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #1890ff;
  border-radius: 3px;
  transition: height 0.3s;
}
</style>
