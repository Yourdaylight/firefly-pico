<template>
  <view class="summary-card">
    <view class="section-title">{{ $t('dashboard.transactions_summary.title') }}:</view>
    
    <view class="grid-container">
      <dashboard-summary-card
        @click="onGoToTransactionsByType(Transaction.types.income)"
        :icon="TablerIconConstants.dashboardTotalIncomes"
        :title="$t('transaction.type.income')"
        :subtitle="totalIncomeFormatted"
        subtitleClass="text-success"
      />

      <dashboard-summary-card
        @click="onGoToTransactionsByType(Transaction.types.expense)"
        :icon="TablerIconConstants.dashboardTotalExpenses"
        :title="$t('transaction.type.expense')"
        :subtitle="totalExpenseFormatted"
        subtitleClass="text-danger"
      />

      <dashboard-summary-card
        @click="onGoToTransactionsByType(Transaction.types.transfer)"
        :icon="TablerIconConstants.dashboardTotalTransfers"
        :title="$t('transaction.type.transfer')"
        :subtitle="totalTransferFormatted"
        subtitleClass="text-primary"
      />

      <dashboard-summary-card 
        :icon="TablerIconConstants.dashboardTotalSurplus" 
        title="Surplus" 
        :subtitle="totalSurplusFormatted" 
      />

      <dashboard-summary-card 
        :icon="TablerIconConstants.dashboardTransactionsCount" 
        :title="$t('toolbar.transactions')" 
        :subtitle="$store.state.dataStore.totalTransactionsCount" 
      />

      <dashboard-summary-card 
        :icon="TablerIconConstants.account" 
        :title="$t('dashboard.transactions_summary.days_remaining')" 
        :subtitle="remainingDays" 
      />
    </view>

    <view class="section-title">{{ $t('dashboard.transactions_summary.savings_summary') }}:</view>
    <view class="grid-container" @click="onNavigateToTransactionSavings">
      <dashboard-summary-card 
        :icon="TablerIconConstants.dashboardTransactionsCount" 
        :title="$t('toolbar.transactions')" 
        :subtitle="$store.state.dataStore.transactionsListSavingsCount" 
      />

      <dashboard-summary-card 
        :icon="TablerIconConstants.dashboardCoin" 
        :title="$t('amount')" 
        :subtitle="transactionsListSavingsAmount" 
        :subtitleClass="savingsAmountClass" 
      />

      <dashboard-summary-card 
        :icon="TablerIconConstants.dashboardSavingsPercent" 
        :title="$t('percentage')" 
        :subtitle="savingsPercentFormatted" 
        subtitleClass="text-primary" 
      />
    </view>
  </view>
</template>

<script>
import TablerIconConstants from '@/constants/TablerIconConstants.js'
import { addMonths, differenceInDays, startOfDay, subDays, subMonths } from 'date-fns'
import RouteConstants from '@/constants/RouteConstants.js'
import Transaction from '@/models/Transaction.js'
import { formatNumberForDashboard } from '@/utils/NumberUtils.js'
import DateUtils from '@/utils/DateUtils.js'

export default {
  computed: {
    startDate() {
      let dateCurrentMonth = startOfDay(new Date()).setDate(this.$store.state.profileStore.dashboard.firstDayOfMonth)
      return dateCurrentMonth > new Date() ? subMonths(dateCurrentMonth, 1) : dateCurrentMonth
    },
    endDate() {
      return subDays(addMonths(this.startDate, 1), 1)
    },
    remainingDays() {
      return differenceInDays(this.endDate, startOfDay(new Date())) + 1
    },
    totalExpenseFormatted() {
      return formatNumberForDashboard(this.$store.state.dataStore.totalExpenseThisMonth)
    },
    totalIncomeFormatted() {
      return formatNumberForDashboard(this.$store.state.dataStore.totalIncomeThisMonth)
    },
    totalTransferFormatted() {
      return formatNumberForDashboard(this.$store.state.dataStore.totalTransfersThisMonth)
    },
    totalSurplusFormatted() {
      return formatNumberForDashboard(this.$store.state.dataStore.totalSurplusThisMonth)
    },
    transactionsListSavingsAmount() {
      return formatNumberForDashboard(this.$store.state.dataStore.transactionsListSavingsAmount)
    },
    savingsAmountClass() {
      return this.$store.state.dataStore.transactionsListSavingsAmount > 0 ? 'text-success' : 'text-danger'
    },
    savingsPercentFormatted() {
      return `${Math.trunc(this.$store.state.dataStore.transactionsListSavingsPercentage)} %`
    }
  },
  methods: {
    onGoToTransactionsByType(transactionType) {
      const url = `${RouteConstants.ROUTE_TRANSACTION_LIST}?transactionType=${transactionType.code}&dateAfter=${DateUtils.dateToString(this.$store.state.dataStore.dashboardDateStart)}&dateBefore=${DateUtils.dateToString(this.$store.state.dataStore.dashboardDateEnd)}`
      uni.navigateTo({ url })
    },
    onNavigateToTransactionSavings() {
      if (this.$store.state.dataStore.transactionsListSavings.length === 0) return
      
      const transactionIds = this.$store.state.dataStore.transactionsListSavings.map(item => item.id).join(',')
      const url = `${RouteConstants.ROUTE_TRANSACTION_LIST}?id=${transactionIds}`
      uni.navigateTo({ url })
    }
  }
}
</script>

<style scoped>
.summary-card {
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  margin: 10px 0;
}
.section-title {
  font-weight: bold;
  margin-bottom: 15px;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}
</style>
