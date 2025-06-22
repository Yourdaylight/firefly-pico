<template>
  <view :class="dayClass" :style="dayStyle" @click="onClick">
    <view class="day-frame">
      <template v-if="isVisible">
        <view class="day-number">{{ dayOfMonth }}</view>
        <view v-if="amountIncome" class="text-success text-size-10">{{ amountIncome }}</view>
        <view v-if="amountExpense" class="text-danger text-size-10">{{ amountExpense }}</view>
        <view v-if="amountTransfer" class="text-primary text-size-10">{{ amountTransfer }}</view>
      </template>
    </view>
  </view>
</template>

<script>
import { format, getDate, isWeekend, isToday } from 'date-fns'
import Transaction from '@/models/Transaction.js'
import { formatNumberForDashboard } from '@/utils/NumberUtils.js'
import RouteConstants from '@/constants/RouteConstants.js'

export default {
  props: {
    day: Date,
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    formattedDate() {
      return this.isVisible ? format(this.day, 'yyyy-MM-dd') : null
    },
    dayOfMonth() {
      return this.isVisible ? getDate(this.day) : null
    },
    dayClass() {
      return {
        'day': true,
        'day-weekend': isWeekend(this.day),
        'day-today': isToday(this.day)
      }
    },
    amountIncome() {
      const value = this.$store.state.dataStore.dashboardCalendarTransactionsByDate?.[this.formattedDate]?.[Transaction.types.income.code]
      return value ? formatNumberForDashboard(value) : null
    },
    amountExpense() {
      const value = this.$store.state.dataStore.dashboardCalendarTransactionsByDate?.[this.formattedDate]?.[Transaction.types.expense.code]
      return value ? formatNumberForDashboard(value) : null
    },
    amountTransfer() {
      const value = this.$store.state.dataStore.dashboardCalendarTransactionsByDate?.[this.formattedDate]?.[Transaction.types.transfer.code]
      return value ? formatNumberForDashboard(value) : null
    },
    isCellEmpty() {
      return !this.amountIncome && !this.amountExpense && !this.amountTransfer
    },
    dayStyle() {
      return this.isCellEmpty ? { height: '50px' } : {}
    }
  },
  methods: {
    onClick() {
      const url = `${RouteConstants.ROUTE_TRANSACTION_LIST}?dateAfter=${format(this.day, 'yyyy-MM-dd')}&dateBefore=${format(this.day, 'yyyy-MM-dd')}`
      uni.navigateTo({ url })
    }
  }
}
</script>

<style scoped>
.day {
  flex: 1;
  padding: 5px;
  text-align: center;
  border: 1px solid #eee;
}
.day-frame {
  min-height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.day-number {
  font-size: 14px;
  margin-bottom: 2px;
}
.day-weekend {
  background-color: #f9f9f9;
}
.day-today {
  background-color: #e6f7ff;
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
.text-size-10 {
  font-size: 10px;
}
</style>
