import { defineStore } from 'pinia'
import { cloneDeep, get, head, isEqual, keyBy, set, uniq } from 'lodash'
import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import AccountRepository from '@/repository/AccountRepository'
import CategoryRepository from '@/repository/CategoryRepository'
import TagRepository from '@/repository/TagRepository'
import AccountTransformer from '@/transformers/AccountTransformer'
import TransactionTemplateRepository from '@/repository/TransactionTemplateRepository'
import CurrencyRepository from '@/repository/CurrencyRepository'
import { useProfileStore } from '@/stores/profileStore'
import { addMonths, differenceInDays, getDate, setDate, startOfDay, startOfMonth, subDays, subMonths, subYears } from 'date-fns'
import CategoryTransformer from '@/transformers/CategoryTransformer'
import TagTransformer from '@/transformers/TagTransformer'
import TransactionTemplateTransformer from '@/transformers/TransactionTemplateTransformer'
import Account from '@/models/Account'
import TransactionRepository from '@/repository/TransactionRepository'
import Transaction from '@/models/Transaction'
import TransactionTransformer from '@/transformers/TransactionTransformer'
import { listToTree, setLevel, sortByPath, treeToList } from '@/utils/DataUtils'
import Tag from '@/models/Tag.js'
import { convertCurrency, convertTransactionAmountToCurrency, convertTransactionsTotalAmountToCurrency } from '@/utils/CurrencyUtils'
import { getExcludedTransactionFilters } from '@/utils/DashboardUtils.js'
import { uniqBy } from 'lodash/array.js'
import BudgetRepository from '@/repository/BudgetRepository.js'
import BudgetTransformer from '@/transformers/BudgetTransformer.js'
import BudgetLimitTransformer from '@/transformers/BudgetLimitTransformer.js'
import Currency from '@/models/Currency.js'

export const useDataStore = defineStore('data', {
  state: () => ({
    isLoading: false,
    dashboard: {
      month: null,
      transactionsList: [],
      transactionsListLastWeek: [],
      transactionsWithTodo: [],
      tagsWidgetModeOnlyRootTag: useLocalStorage('tagsWidgetModeOnlyRootTag', true),
    },
    exchangeRates: useLocalStorage('exchangeRates', {}),
    dashboardCurrency: useLocalStorage('dashboardCurrency', null, { serializer: StorageSerializers.object }),
    transactionTemplateList: useLocalStorage('transactionTemplateList', []),
    categoryList: useLocalStorage('categoryList', []),
    budgetList: useLocalStorage('budgetList', []),
    budgetLimitList: useLocalStorage('budgetLimitList', []),
    accountList: useLocalStorage('accountList', []),
    tagList: useLocalStorage('tagList', []),
    currenciesList: useLocalStorage('currenciesList', []),
    lastSync: useLocalStorage('lastSync', null, {
      serializer: {
        read: (v) => v ? new Date(v) : null,
        write: (v) => v ? v.toISOString() : null,
      },
    }),
    isSyncRequiredByMissingExtras: false,
    isLoadingAccounts: false,
    isLoadingTags: false,
    isLoadingCategories: false,
    isLoadingBudgets: false,
    isLoadingTransactionTemplates: false,
    isLoadingDashboardTransactions: false,
    isLoadingDashboardTransactionsLastWeek: false,
    isLoadingExchangeRates: false,
  }),

  getters: {
    dashboardAccounts(state) {
      const profileStore = useProfileStore()
      return state.accountList.filter((account) => {
        const isTypeAssetOrLiability = [Account.types.asset.fireflyCode, Account.types.liability.fireflyCode].includes(Account.getType(account)?.fireflyCode)
        return isTypeAssetOrLiability && 
               Account.getIsActive(account) && 
               Account.getIsIncludedInNetWorth(account) && 
               (Account.getBalance(account) != 0 || profileStore.dashboard.areEmptyAccountsVisible)
      })
    },
    // 其他getters保持不变...
  },

  actions: {
    async fetchExchangeRate() {
      this.isLoadingExchangeRates = true
      this.exchangeRates = await new CurrencyRepository().getCurrencyExchange()
      this.isLoadingExchangeRates = false
    },

    async fetchTransactionsWithTodos() {
      if (!this.tagTodo) return
      let filters = [{
        field: 'query',
        value: `tag_is:"${Tag.getDisplayNameEllipsized(this.tagTodo)}"`
      }]
      let list = await new TransactionRepository().searchTransaction({ filters })
      list = get(list, 'data') ?? []
      this.dashboard.transactionsWithTodo = TransactionTransformer.transformFromApiList(list)
    },

    // 其他actions保持不变...
  }
})
