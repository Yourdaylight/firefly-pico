import BaseModel from '@/models/BaseModel'
import TransactionTransformer from '@/transformers/TransactionTransformer'
import TransactionRepository from '@/repository/TransactionRepository'
import { useProfileStore } from '@/stores/profileStore'
import Account from '@/models/Account'
import _, { get, isEqual } from 'lodash'
import Currency from '@/models/Currency.js'

class Transaction extends BaseModel {
  getTransformer() {
    return TransactionTransformer
  }

  getRepository() {
    return new TransactionRepository()
  }

  getEmpty() {
    const profileStore = useProfileStore()

    let type =
      Transaction.getTransactionTypeForAccounts({
        source: profileStore.defaultAccountSource,
        destination: profileStore.defaultAccountDestination,
      }) ?? Transaction.types.expense

    let date = new Date()
    let minute = Math.ceil(date.getMinutes() / 10) * 10
    date.setMinutes(minute)

    return {
      attributes: {
        transactions: [
          {
            amount: '',
            date: date,
            tags: profileStore.defaultTags,
            description: '',
            notes: '',
            accountSource: profileStore.defaultAccountSource,
            accountDestination: profileStore.defaultAccountDestination,
            type: type,
            category: profileStore.defaultCategory,
            currencyForeign: profileStore.defaultForeignCurrency,
          },
        ],
      },
    }
  }

  // ... (保持原有Transaction类的内容不变)
}

export default Transaction
