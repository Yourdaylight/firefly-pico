<template>
  <view class="budget-item" @click="onGoToBudget">
    <app-icon :icon="value.attributes.icon" :size="24" />
    <view class="budget-content">
      <text class="budget-name">{{ displayName }}</text>
      <text class="budget-amount">{{ formatNumberForDashboard(budgetLimitSpent) }} / {{ formatNumberForDashboard(budgetLimitAmount) }} {{ budgetCurrencySymbol }}</text>
      <text class="budget-interval">{{ budgetLimitInterval }}</text>
    </view>
  </view>
</template>

<script>
import RouteConstants from '@/constants/RouteConstants.js'
import Budget from '@/models/Budget.js'
import BudgetLimit from '@/models/BudgetLimit.js'
import { formatNumberForDashboard } from '@/utils/NumberUtils.js'

export default {
  props: {
    value: Object
  },
  computed: {
    displayName() {
      return this.value?.attributes?.name || ' - '
    },
    budgetLimitSpent() {
      return Math.abs(this.value?.attributes?.spent || 0)
    },
    budgetLimitAmount() {
      return this.value?.attributes?.amount || 0
    },
    budgetLimitInterval() {
      return BudgetLimit.getLimitInterval(this.value)
    },
    budgetCurrencySymbol() {
      return Budget.getCurrencySymbol(this.value)
    }
  },
  methods: {
    onGoToBudget() {
      if (!this.value?.id) return
      
      const url = `${RouteConstants.ROUTE_BUDGET_ID}/${this.value.id}`
      uni.navigateTo({ url })
    }
  }
}
</script>

<style scoped>
.budget-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  margin: 5px;
}
.budget-content {
  margin-top: 5px;
  text-align: center;
}
.budget-name {
  font-weight: 600;
  font-size: 12px;
}
.budget-amount {
  font-size: 10px;
  margin-top: 2px;
}
.budget-interval {
  font-size: 10px;
  color: #999;
  margin-top: 2px;
}
</style>
