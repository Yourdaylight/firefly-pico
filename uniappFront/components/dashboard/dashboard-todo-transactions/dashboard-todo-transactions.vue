<template>
  <view class="todo-transactions-card">
    <view class="card-header">
      <text class="title">{{ $t('settings.dashboard.cards.todo_transactions') }}:</text>
      
      <button v-if="$store.state.dataStore.tagTodo" size="mini" @click="onGoToTodos">
        {{ $t('todo') }}: {{ $store.state.dataStore.dashboard.transactionsWithTodo.length }}
      </button>
      <view v-else class="no-tag">
        <text class="text-muted">{{ $t('no_todo_tag') }}</text>
      </view>
    </view>

    <view class="todo-list">
      <view v-for="transaction in $store.state.dataStore.dashboard.transactionsWithTodo" 
            :key="transaction.id" 
            class="todo-item"
            @click="onEditTransaction(transaction)">
        <text>{{ transaction.description || $t('no_description') }}</text>
        <text>{{ formatAmount(transaction.amount) }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import RouteConstants from '@/constants/RouteConstants.js'
import { formatNumberForDashboard } from '@/utils/NumberUtils.js'

export default {
  methods: {
    formatAmount(amount) {
      return formatNumberForDashboard(amount)
    },
    onEditTransaction(transaction) {
      uni.navigateTo({
        url: `${RouteConstants.ROUTE_TRANSACTION_ID}/${transaction.id}`
      })
    },
    onGoToTodos() {
      const todoTagId = this.$store.state.dataStore.tagTodo?.id
      if (!todoTagId) return
      
      uni.navigateTo({
        url: `${RouteConstants.ROUTE_TRANSACTION_LIST}?tag_id=${todoTagId}`
      })
    }
  }
}
</script>

<style scoped>
.todo-transactions-card {
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
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.todo-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
}
.text-muted {
  color: #999;
  font-size: 12px;
}
</style>
