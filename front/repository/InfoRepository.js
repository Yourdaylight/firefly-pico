import BaseRepository from '~/repository/BaseRepository'
import axios from 'axios'

export default class InfoRepository extends BaseRepository {
  constructor(baseURL = '') {
    super('api/latest-version')
    this.baseURL = baseURL
  }

  async getLatestVersion() {
    return await axios.get(`${this.getUrl(this.baseURL)}`)
  }
}
