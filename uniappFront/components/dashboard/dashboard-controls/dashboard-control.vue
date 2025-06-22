<template>
  <view class="dashboard-control-date" :style="style">
    <view class="flex-center-vertical gap-2">
      <app-icon :icon="TablerIconConstants.leftArrow" @click.stop="onPreviousMonth" :size="24" class="m-10" />

      <view class="flex-1 flex-center flex-column my-2">
        <view @click="onChooseMonth" class="text-size-14 font-weight-600">{{ rangeTitle }}</view>
        <view v-if="y < 20">
          <dashboard-control-buttons />
        </view>
      </view>

      <app-icon :icon="TablerIconConstants.rightArrow" @click.stop="onNextMonth" :size="24" class="m-10" />
    </view>
  </view>

  <app-month-year v-model="dashboardMonth" :showDropdown.sync="showDropdown" />
</template>

<script>
import { addMonths } from 'date-fns'
import TablerIconConstants from '@/constants/TablerIconConstants.js'
import { useWindowScroll } from '@vueuse/core'
import { animateOnNext, animateOnPrevious } from '@/utils/AnimationUtils.js'
import DashboardControlButtons from '@/components/dashboard/dashboard-controls/dashboard-control-buttons.vue'
import DateUtils from '@/utils/DateUtils.js'

export default {
  data() {
    return {
      showDropdown: false,
      y: 0
    }
  },
  computed: {
    rangeTitle() {
      let date1 = DateUtils.dateToUI(this.$store.state.dataStore.dashboardDateStart)
      let date2 = DateUtils.dateToUI(this.$store.state.dataStore.dashboardDateEnd)
      return `${date1} - ${date2}`
    },
    dashboardMonth: {
      get() {
        return this.$store.state.dataStore.dashboard.month
      },
      set(value) {
        this.$store.commit('dataStore/setDashboardMonth', value)
      }
    },
    style() {
      return this.y > 20 ? `box-shadow: rgba(60, 64, 67, 0.1) 0px 1px 2px 0px, rgba(60, 64, 67, 0.05) 0px 1px 3px 1px;` : ``
    }
  },
  methods: {
    onNextMonth() {
      this.$store.commit('dataStore/setDashboardMonth', 
        addMonths(this.$store.state.dataStore.dashboard.month, 1))
      animateOnNext(this.$refs.dashboardControlDate)
    },
    onPreviousMonth() {
      this.$store.commit('dataStore/setDashboardMonth',
        addMonths(this.$store.state.dataStore.dashboard.month, -1))
      animateOnPrevious(this.$refs.dashboardControlDate)
    },
    onChooseMonth() {
      this.showDropdown = true
    }
  },
  mounted() {
    // 模拟useWindowScroll
    uni.onWindowScroll((res) => {
      this.y = res.scrollTop
    })
  },
  watch: {
    dashboardMonth(newValue) {
      this.$store.dispatch('dataStore/fetchDashboardTransactionsForInterval')
    }
  }
}
</script>
