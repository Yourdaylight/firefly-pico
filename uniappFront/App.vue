<template>
  <view>
    <app-loading />
    <page-container>
      <router-view />
    </page-container>
  </view>
</template>

<script>
import AppLoading from '@/components/ui-kit/app-loading.vue'
import { useDataStore } from '@/stores/dataStore'
import { useProfileStore } from '@/stores/profileStore'
import { useAppStore } from '@/stores/appStore'
import RouteConstants from '@/constants/RouteConstants'

export default {
  components: {
    AppLoading
  },
  data() {
    return {
      theme: 'white'
    }
  },
  computed: {
    pwaColor() {
      return this.theme === 'dark' ? '#1c1c1e' : '#ffffff'
    }
  },
  onLaunch() {
    this.initApp()
  },
  methods: {
    async initApp() {
      const appStore = useAppStore()
      const profileStore = useProfileStore()
      const dataStore = useDataStore()
      
      if (!appStore.authToken) {
        uni.redirectTo({
          url: `/${RouteConstants.ROUTE_SETTINGS_SETUP}`
        })
        return
      }
      
      await dataStore.init()
      appStore.fetchLatestAppVersion()
      await profileStore.fetchProfile()
      await dataStore.syncEverythingIfOld()
      
      this.theme = profileStore.darkTheme ? 'dark' : 'white'
    }
  }
}
</script>

<style>
/* 全局样式 */
page {
  background-color: #F8F8F8;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.15s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(0.2rem);
}
</style>
