<template>
  <view class="text-size-14 flex-center-vertical gap-1">
    <text class="text-muted text-size-12">{{ $t('dashboard.controls') }}:</text>
    <view class="app-button-small" @click="onToggleTotalCurrency">
      <app-icon :icon="TablerIconConstants.transaction" :size="14" />
      {{ $store.state.dataStore.dashboardCurrencyCode }}
    </view>

    <view class="app-button-small" @click="onToggleShowDashboardAccountValues">
      <app-icon :icon="$store.state.profileStore.dashboard.showAccountAmounts ? TablerIconConstants.eyeHidden : TablerIconConstants.eyeVisible" :size="20" />
    </view>
  </view>
</template>

<script>
import TablerIconConstants from '@/constants/TablerIconConstants.js'

export default {
  computed: {
    hasMultipleCurrencies() {
      return this.$store.state.dataStore.dashboardAccountsCurrencyList.length > 1
    }
  },
  methods: {
    onToggleTotalCurrency() {
      if (this.$store.state.dataStore.dashboardAccountsCurrencyList.length === 0) {
        return
      }
      let index = this.$store.state.dataStore.dashboardAccountsCurrencyList
        .findIndex(currency => currency.id === this.$store.state.dataStore.dashboardCurrency?.id)
      let newIndex = (index + 1) % this.$store.state.dataStore.dashboardAccountsCurrencyList.length
      this.$store.commit('dataStore/setDashboardCurrency', 
        this.$store.state.dataStore.dashboardAccountsCurrencyList[newIndex])
    },
    onToggleShowDashboardAccountValues() {
      this.$store.commit('profileStore/toggleDashboardAccountValues')
    }
  }
}
</script>
