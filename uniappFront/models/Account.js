import { faker } from '@faker-js/faker'
import BaseModel from '@/models/BaseModel'
import AccountTransformer from '@/transformers/AccountTransformer'
import AccountRepository from '@/repository/AccountRepository'
import _, { get } from 'lodash'
import Transaction from '@/models/Transaction'
import { NUMBER_FORMAT } from '@/utils/NumberUtils.js'
import Currency from '@/models/Currency.js'

export default class Account extends BaseModel {
  getTransformer() {
    return AccountTransformer
  }

  getRepository() {
    return new AccountRepository()
  }

  getEmpty() {
    return {
      attributes: {
        name: '',
        icon: null,
        type: Account.types.asset,
        account_role: Account.roleAssets.default,
        include_net_worth: true,
        is_dashboard_visible: true,
      },
    }
  }

  // ... (保持原有Account类的内容不变)
}
