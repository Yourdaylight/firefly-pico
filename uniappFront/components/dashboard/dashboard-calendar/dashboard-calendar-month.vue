<template>
  <view class="month">
    <view class="month-header">
      <view class="month-title">
        <text class="text-primary">{{ monthName }}</text> {{ yearName }}
      </view>
      <view class="weekdays">
        <view v-for="dayName in dayNames" class="weekday">{{ dayName }}</view>
      </view>
    </view>

    <view class="calendar-grid">
      <view v-for="week in calendar" class="week-row">
        <dashboard-calendar-month-day 
          v-for="day in week" 
          :day="day" 
          :month="month" 
          :is-visible="getIsVisible(day)" 
        />
      </view>
    </view>
  </view>
</template>

<script>
import { addDays, eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns'

export default {
  props: {
    start: Date,
    end: Date
  },
  computed: {
    month() {
      return startOfMonth(this.start)
    },
    monthName() {
      return format(this.start, 'MMMM')
    },
    yearName() {
      return this.start.getFullYear()
    },
    dayNames() {
      return Array.from({ length: 7 }, (_, i) => {
        const date = addDays(startOfWeek(new Date()), i)
        return format(date, 'EEEEEE').toUpperCase()
      })
    },
    calendar() {
      const start = startOfWeek(this.start)
      const end = endOfWeek(this.end)
      const days = eachDayOfInterval({ start, end })
      return days.reduce((weeks, day, i) => {
        if (i % 7 === 0) weeks.push([])
        weeks[weeks.length - 1].push(day)
        return weeks
      }, [])
    }
  },
  methods: {
    getIsVisible(day) {
      return day >= this.start && day <= this.end
    }
  }
}
</script>

<style scoped>
.month {
  padding: 10px;
}
.month-header {
  margin-bottom: 10px;
}
.month-title {
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  margin: 10px 0;
}
.weekdays {
  display: flex;
  margin-bottom: 5px;
}
.weekday {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #999;
}
.calendar-grid {
  display: flex;
  flex-direction: column;
}
.week-row {
  display: flex;
}
.text-primary {
  color: #007AFF;
}
</style>
