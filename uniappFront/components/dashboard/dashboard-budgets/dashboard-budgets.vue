<template>
  <view class="budgets-card">
    <view class="section-title">{{ $t('budgets') }}:</view>

    <template v-if="hasBudgets">
      <view class="chips-container">
        <app-chip :title="`${$t('dashboard.budget.budgeted')}:`" :subtitle="budgetLimitTotalFormatted" />
        <app-chip :title="`${$t('dashboard.budget.spent')}:`" :subtitle="budgetLimitSpentFormatted" />
        <app-chip :title="`${$t('dashboard.budget.remaining')}:`" :subtitle="budgetLimitRemainingFormatted" />
      </view>

      <view class="budgets-grid">
        <dashboard-budget-item v-for="budget in budgetList" :value="budget" :key="budget.id" />
      </view>
    </template>

    <view v-else class="no-budgets">{{ $t('dashboard.no_budgets') }}</view>
  </view>
</template>

<script>
import { formatNumberForDashboard } from '@/utils/NumberUtils.js'

export default {
  computed: {
    budgetList() {
      return this.$store.state.dataStore.budgetList
    },
    hasBudgets() {
      return this.budgetList.length > 0
    },
    budgetLimitTotalFormatted() {
      return `${formatNumberForDashboard(this.$store.state.dataStore.budgetLimitTotal)} ${this.$store.state.dataStore.dashboardCurrencyCode}`
    },
    budgetLimitSpentFormatted() {
      return `${formatNumberForDashboard(this.$store.state.dataStore.budgetLimitSpent)} ${this.$store.state.dataStore.dashboardCurrencyCode}`
    },
    budgetLimitRemainingFormatted() {
      return `${formatNumberForDashboard(this.$store.state.dataStore.budgetLimitRemaining)} ${this.$store.state.dataStore.dashboardCurrencyCode}`
    }
  }
}
</script>

<style scoped>
.budgets-card {
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  margin: 10px 0;
}
.section-title {
  font-weight: bold;
  margin-bottom: 15px;
}
.chips-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;
}
.budgets-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.no-budgets {
  color: #999;
  font-size: 12px;
  text-align: center;
  margin: 10px 0;
}
</style>
