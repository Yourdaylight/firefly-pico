<template>
  <view class="dashboard-page">
    <uni-pull-refresh :refreshing="isLoadingAccounts" @refresh="onRefresh">
      <view class="dashboard-content">
        <dashboard-control />

        <dashboard-calendar :style="getStyleForCard(dashboardCard.calendar)" />

        <dashboard-accounts :style="getStyleForCard(dashboardCard.accounts)" />

        <dashboard-week-bars :style="getStyleForCard(dashboardCard.expensesLastWeek)" />

        <dashboard-summary :style="getStyleForCard(dashboardCard.transactionsSummary)" />

        <dashboard-budgets :style="getStyleForCard(dashboardCard.budgets)" />

        <dashboard-tag-totals :style="getStyleForCard(dashboardCard.expensesByTag)" />

        <dashboard-category-totals :style="getStyleForCard(dashboardCard.expensesByCategory)" />

        <dashboard-todo-transactions :style="getStyleForCard(dashboardCard.todoTransactions)" />

        <view class="configure-cards" @click="navigateToConfigure">
          <text>{{ $t('dashboard.configure_cards') }}</text>
        </view>
      </view>
    </uni-pull-refresh>
  </view>
</template>

<script>
import { debounce } from 'lodash/function'
import { dashboardCard } from '@/constants/DashboardConstants.js'
import RouteConstants from '@/constants/RouteConstants.js'
import { addMonths } from 'date-fns'
import DashboardTagTotals from '@/components/dashboard/dashboard-tag-totals/dashboard-tag-totals.vue'
import DashboardCategoryTotals from '@/components/dashboard/dashboard-category-totals/dashboard-category-totals.vue'
import DashboardTodoTransactions from '@/components/dashboard/dashboard-todo-transactions/dashboard-todo-transactions.vue'

export default {
  data() {
    return {
      isLoadingAccounts: false
    }
  },
  computed: {
    isLoadingDashboard() {
      return this.$store.state.dataStore.isLoadingAccounts || 
             this.$store.state.dataStore.isLoadingDashboardTransactions ||
             this.$store.state.dataStore.isLoadingDashboardTransactionsLastWeek
    }
  },
  methods: {
    onRefresh() {
      this.isLoadingAccounts = true
      Promise.all([
        this.$store.dispatch('dataStore/fetchAccounts'),
        this.$store.dispatch('dataStore/fetchDashboardTransactionsForInterval'),
        this.$store.dispatch('dataStore/fetchDashboardTransactionsForWeek'),
        this.$store.dispatch('dataStore/fetchTransactionsWithTodos'),
        this.$store.dispatch('dataStore/fetchExchangeRate'),
        this.$store.dispatch('dataStore/fetchBudgets')
      ]).finally(() => {
        this.isLoadingAccounts = false
      })
    },
    getStyleForCard(dashboardCard) {
      const cardCode = dashboardCard.code
      const position = this.$store.state.profileStore.dashboardWidgetsConfig.findIndex(item => item.code === cardCode)
      const field = this.$store.state.profileStore.dashboardWidgetsConfig.find(item => item.code === cardCode)
      const isVisible = field ? field.isVisible : true
      return `order: ${position}; ${isVisible ? '' : 'display: none'}`
    },
    navigateToConfigure() {
      uni.navigateTo({
        url: RouteConstants.ROUTE_SETTINGS_DASHBOARD_CARDS_ORDER
      })
    }
  },
  mounted() {
    this.onRefreshDebounce = debounce(this.onRefresh, 200)
    this.onRefreshDebounce()
  }
}
</script>

<style scoped>
.dashboard-page {
  padding: 10px;
}
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.configure-cards {
  padding: 15px;
  text-align: center;
  color: #1989fa;
}
</style>
