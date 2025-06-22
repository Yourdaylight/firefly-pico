<template>
  <view class="dashboard-accounts">
    <view class="flex-center-vertical">
      <view class="van-cell-group-title">{{ $t('dashboard.account_total') }}:</view>
    </view>

    <view class="accounts-grid">
      <view v-for="account in visibleDashboardAccounts" :key="account.id" class="account-item" @click="onShowActionSheet(account)">
        <app-icon :icon="Account.getIcon(account) ?? TablerIconConstants.account" :size="24" />
        <view class="account-details">
          <view class="font-400 text-size-12 text-center text-muted">{{ Account.getDisplayName(account) }}</view>
          <view class="font-700 text-size-12 text-center">{{ getAccountAmount(account) }}</view>
        </view>
      </view>
    </view>

    <view v-if="hasHiddenAccounts" class="flex-center">
      <view @click="toggleHiddenAccounts" class="p-5 m-5 button-link">
        {{ showHiddenAccounts ? $t('view_less') : $t('view_more') }}
        <app-icon :icon="showHiddenAccounts ? 'minus' : 'plus'" :size="20" />
      </view>
    </view>

    <view class="flex-center text-size-13 m-10 flex-wrap">
      <view class="flex-center text-size-13 me-1">
        <app-icon icon="cash" class="text-muted" :size="24" />
        <text class="font-400 text-muted">{{ $t('total')}}: </text>
      </view>

      <text v-for="(totalValue, totalCurrency) in $store.state.dataStore.dashboardAccountsTotalByCurrency" 
            class="font-700 ms-1 mx-1 app-select-option-tag">
        {{ formatNumberForDashboard(totalValue) }} {{ totalCurrency }}
      </text>
    </view>

    <view v-if="hasMultipleCurrencies" class="flex-center text-size-13 mb-3 gap-1">
      <text class="font-700">~{{ accountTotal }} {{ Currency.getCode($store.state.dataStore.dashboardCurrency) }}</text>
    </view>
  </view>
</template>

<script>
import TablerIconConstants from '@/constants/TablerIconConstants.js'
import Account from '@/models/Account.js'
import RouteConstants from '@/constants/RouteConstants.js'
import { formatNumberForDashboard } from '@/utils/NumberUtils.js'
import Currency from '@/models/Currency.js'

export default {
  data() {
    return {
      showHiddenAccounts: false
    }
  },
  computed: {
    visibleDashboardAccounts() {
      const sortedAccounts = [...this.$store.state.dataStore.dashboardAccounts].sort(
        (a, b) => Account.getIsVisibleOnDashboard(b) - Account.getIsVisibleOnDashboard(a))
      return this.showHiddenAccounts ? sortedAccounts : sortedAccounts.filter(
        account => Account.getIsVisibleOnDashboard(account))
    },
    hasHiddenAccounts() {
      return this.$store.state.dataStore.dashboardAccounts.some(
        account => !Account.getIsVisibleOnDashboard(account))
    },
    accountTotal() {
      return formatNumberForDashboard(this.$store.state.dataStore.dashboardAccountsEstimatedTotal)
    },
    hasMultipleCurrencies() {
      return this.$store.state.dataStore.dashboardAccountsCurrencyList.length > 1
    }
  },
  methods: {
    toggleHiddenAccounts() {
      this.showHiddenAccounts = !this.showHiddenAccounts
    },
    getAccountAmount(account) {
      return `${formatNumberForDashboard(Account.getBalance(account))} ${Account.getCurrencySymbol(account)}`
    },
    onShowActionSheet(account) {
      uni.showActionSheet({
        itemList: [this.$t('edit_account'), this.$t('show_transactions')],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.onGoToAccount(account)
          } else {
            this.onGoToTransactions(account)
          }
        }
      })
    },
    onGoToTransactions(account) {
      if (account) {
        const url = `${RouteConstants.ROUTE_TRANSACTION_LIST}?accountId=${account.id}`
        uni.navigateTo({ url })
      }
    },
    onGoToAccount(account) {
      if (account) {
        uni.navigateTo({ 
          url: `${RouteConstants.ROUTE_ACCOUNT_ID}/${account.id}`
        })
      }
    }
  }
}
</script>

<style scoped>
.dashboard-accounts {
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  margin: 10px 0;
}
.accounts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 10px 0;
}
.account-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}
.account-details {
  margin-top: 5px;
  text-align: center;
}
</style>
