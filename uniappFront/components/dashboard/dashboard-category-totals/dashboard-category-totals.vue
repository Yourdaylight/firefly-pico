<template>
  <view class="category-totals-card">
    <text class="title">{{ $t('dashboard.expenses_by_categories') }}:</text>
    
    <view class="category-list">
      <view v-for="bar in barsList" class="category-item" @click="onShowActionSheet(bar)">
        <view class="category-info">
          <app-icon :icon="Category.getIcon(bar.category) ?? TablerIconConstants.category" :size="20" />
          <text class="category-name">{{ ellipsizeText(bar.label, 25) }}</text>
        </view>
        
        <view class="progress-container">
          <view class="progress-bar" :style="{width: `${bar.percent}%`, backgroundColor: '#F06292'}"></view>
        </view>

        <text class="category-amount">{{ bar.value }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import Category from '@/models/Category.js'
import TablerIconConstants from '@/constants/TablerIconConstants.js'
import RouteConstants from '@/constants/RouteConstants.js'
import Transaction from '@/models/Transaction.js'
import { formatNumberForDashboard } from '@/utils/NumberUtils.js'
import DateUtils from '@/utils/DateUtils.js'

export default {
  computed: {
    barsList() {
      const dictionary = this.$store.state.dataStore.dashboardExpensesByCategory
      const maxAmount = Math.max(...Object.values(dictionary))

      return Object.keys(dictionary)
        .map(categoryId => {
          const category = this.$store.state.dataStore.categoryDictionary[categoryId]
          const amount = dictionary[categoryId]
          const percent = (amount / maxAmount) * 100
          return {
            category: category,
            label: category ? Category.getDisplayName(category) : this.$t('not_set'),
            value: formatNumberForDashboard(amount),
            percent: percent
          }
        })
        .sort((a, b) => b.percent - a.percent)
        .slice(0, 15)
    }
  },
  methods: {
    ellipsizeText(text, maxLength) {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    },
    onShowActionSheet({ category }) {
      uni.showActionSheet({
        itemList: ['Edit category', 'Show transactions'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.onGoToCategory(category)
          } else {
            this.onGoToTransactions(category)
          }
        }
      })
    },
    onGoToCategory(category) {
      if (category) {
        uni.navigateTo({
          url: `${RouteConstants.ROUTE_CATEGORY_ID}/${category.id}`
        })
      }
    },
    onGoToTransactions(category) {
      const startDate = DateUtils.dateToString(this.$store.state.dataStore.dashboardDateStart)
      const endDate = DateUtils.dateToString(this.$store.state.dataStore.dashboardDateEnd)
      
      if (!category) {
        uni.navigateTo({
          url: `${RouteConstants.ROUTE_TRANSACTION_LIST}?without_category=true&date_start=${startDate}&date_end=${endDate}&type=${Transaction.types.expense.code}`
        })
        return
      }

      uni.navigateTo({
        url: `${RouteConstants.ROUTE_TRANSACTION_LIST}?category_id=${category.id}&date_start=${startDate}&date_end=${endDate}&type=${Transaction.types.expense.code}`
      })
    }
  }
}
</script>

<style scoped>
.category-totals-card {
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  margin: 10px 0;
}
.title {
  font-weight: bold;
  margin-bottom: 10px;
}
.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.category-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.category-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 5px;
}
.category-name {
  font-size: 12px;
}
.progress-container {
  flex: 2;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  border-radius: 4px;
}
.category-amount {
  width: 60px;
  text-align: right;
  font-size: 12px;
}
</style>
