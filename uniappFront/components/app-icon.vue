<template>
  <view class="svg-icon" :style="iconStyle">
    <text v-if="isTablerIcon" class="icon-font" :style="{fontSize: size + 'px', lineHeight: size + 'px'}">{{ icon }}</text>
    <image v-else :src="icon" mode="aspectFit" :style="{width: size + 'px', height: size + 'px'}"/>
  </view>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 25
    },
    stroke: {
      type: Number,
      default: 1.7
    }
  },
  computed: {
    isTablerIcon() {
      return this.icon.startsWith('ti-')
    },
    iconStyle() {
      return {
        width: this.size + 'px',
        height: this.size + 'px'
      }
    }
  }
}
</script>

<style>
.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.icon-font {
  font-family: 'tabler-icons';
}
</style>
