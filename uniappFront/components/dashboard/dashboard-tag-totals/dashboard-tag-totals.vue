<template>
  <view class="tag-totals-card">
    <view class="card-header">
      <text class="title">{{ $t('dashboard.expenses_by_tags.title') }}:</text>
      <button size="mini" @click="onToggleTagMode">{{ tagModeDisplayName }}</button>
    </view>

    <view class="tag-list">
      <view v-for="bar in barsList" class="tag-item" @click="onShowActionSheet(bar)">
        <view class="tag-info">
          <app-icon :icon="Tag.getIcon(bar.tag) ?? TablerIconConstants.tag" :size="20" />
          <text class="tag-name">{{ ellipsizeText(bar.label, 25) }}</text>
        </view>
        
        <view class="progress-container">
          <view class="progress-bar" :style="{width: `${bar.percent}%`}"></view>
        </view>

        <text class="tag-amount">{{ bar.value }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import Tag from '@/models/Tag.js'
import TablerIconConstants from '@/constants/TablerIconConstants.js'
import RouteConstants from '@/constants/RouteConstants.js'
import Transaction from '@/models/Transaction.js'
import { formatNumberForDashboard } from '@/utils/NumberUtils.js'
import DateUtils from '@/utils/DateUtils.js'

export default {
  computed: {
    tagModeDisplayName() {
      return this.$store.state.dataStore.dashboard.tagsWidgetModeOnlyRootTag 
        ? this.$t('dashboard.expenses_by_tags.one_root_tag')
        : this.$t('dashboard.expenses_by_tags.all_tags')
    },
    barsList() {
      const tagTotalDictionary = this.$store.state.dataStore.dashboardExpensesByTag
      const maxAmount = Math.max(...Object.values(tagTotalDictionary))

      return Object.keys(tagTotalDictionary)
        .map(tagId => {
          const tag = this.$store.state.dataStore.tagDictionaryById[tagId]
          const amount = tagTotalDictionary[tagId]
          const percent = (amount / maxAmount) * 100
          return {
            tag: tag,
            tag_id: tagId,
            label: tag ? Tag.getDisplayNameEllipsized(tag) : this.$t('not_set'),
            value: formatNumberForDashboard(amount),
            percent: percent
          }
        })
        .sort((a, b) => b.percent - a.percent)
        .slice(0, 15)
    }
  },
  methods: {
    onToggleTagMode() {
      this.$store.commit('dataStore/toggleTagsWidgetMode')
    },
    ellipsizeText(text, maxLength) {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    },
    onShowActionSheet({ tag }) {
      uni.showActionSheet({
        itemList: ['Edit tag', 'Show transactions'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.onGoToTag(tag)
          } else {
            this.onGoToTransactions(tag)
          }
        }
      })
    },
    onGoToTag(tag) {
      if (tag) {
        uni.navigateTo({
          url: `${RouteConstants.ROUTE_TAG_ID}/${tag.id}`
        })
      }
    },
    onGoToTransactions(tag) {
      const startDate = DateUtils.dateToString(this.$store.state.dataStore.dashboardDateStart)
      const endDate = DateUtils.dateToString(this.$store.state.dataStore.dashboardDateEnd)
      
      if (!tag) {
        uni.navigateTo({
          url: `${RouteConstants.ROUTE_TRANSACTION_LIST}?without_tag=true&date_start=${startDate}&date_end=${endDate}&type=${Transaction.types.expense.code}`
        })
        return
      }

      uni.navigateTo({
        url: `${RouteConstants.ROUTE_TRANSACTION_LIST}?tag_id=${tag.id}&date_start=${startDate}&date_end=${endDate}&type=${Transaction.types.expense.code}`
      })
    }
  }
}
</script>

<style scoped>
.tag-totals-card {
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  margin: 10px 0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.title {
  font-weight: bold;
}
.tag-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tag-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tag-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 5px;
}
.tag-name {
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
  background-color: #1989fa;
  border-radius: 4px;
}
.tag-amount {
  width: 60px;
  text-align: right;
  font-size: 12px;
}
</style>
