<script setup>
import { ref, computed } from 'vue'

const currentDate = ref(new Date())
const selectedDate = ref(null)

const categories = {
    식사: { bg: '#fdecea', color: '#c62828' },
    교통: { bg: '#e3f2fd', color: '#1565c0' },
    쇼핑: { bg: '#fff3e0', color: '#ef6c00' },
    수입: { bg: '#e0f7ec', color: '#2e7d32' },
    고정비: { bg: '#ede7f6', color: '#5e35b1' }
}

const transactions = ref([
    { date: '2026-04-08', title: '점심', amount: -9000, category: '식사' },
    { date: '2026-04-08', title: '버스', amount: -1400, category: '교통' },
    { date: '2026-04-05', title: '월급', amount: 3500000, category: '수입' }
])

function formatDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate()
}

function getStartDay(year, month) {
    return new Date(year, month, 1).getDay()
}

const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const startDay = getStartDay(year, month)

    const days = []

    for (let i = 0; i < startDay; i++) days.push(null)

    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = formatDate(year, month, i)
        const dayTransactions = transactions.value.filter(t => t.date === dateStr)
        const total = dayTransactions.reduce((sum, t) => sum + t.amount, 0)

        days.push({ day: i, date: dateStr, transactions: dayTransactions, total })
    }

    while (days.length < 42) days.push(null)

    return days
})

function prevMonth() {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}

function nextMonth() {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}

function selectDay(day) {
    if (!day) return
    selectedDate.value = day.date
}
</script>

<template>
    <div class="calendar">
        <div class="header">
            <button @click="prevMonth">◀</button>
            <h2>{{ currentDate.getFullYear() }}년 {{ currentDate.getMonth() + 1 }}월</h2>
            <button @click="nextMonth">▶</button>
        </div>

        <div class="weekdays">
            <div v-for="d in ['일', '월', '화', '수', '목', '금', '토']" :key="d">{{ d }}</div>
        </div>

        <div class="grid">
            <div v-for="(day, index) in calendarDays" :key="index" class="cell"
                :class="{ selected: selectedDate === day?.date }" @click="selectDay(day)">
                <div v-if="day">
                    <div class="date">{{ day.day }}</div>

                    <div class="total" :class="{ plus: day.total > 0, minus: day.total < 0 }">
                        {{ day.total !== 0 ? day.total.toLocaleString() : '' }}
                    </div>

                    <div class="items">
                        <div v-for="(t, i) in day.transactions" :key="i" class="item" :style="{
                            background: categories[t.category]?.bg,
                            color: categories[t.category]?.color
                        }">
                            <span>{{ t.title }}</span>
                            <span>{{ t.amount.toLocaleString() }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.calendar {
    width: 900px;
    margin: 0 auto;
    font-family: sans-serif;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: #3f8f73;
    color: white;
    text-align: center;
    padding: 10px 0;
}

.grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.cell {
    border: 1px solid #eee;
    min-height: 120px;
    padding: 5px;
    cursor: pointer;
}

.cell.selected {
    outline: 2px solid #3f8f73;
}

.date {
    font-size: 13px;
}

.total.plus {
    color: green
}

.total.minus {
    color: red
}

.item {
    font-size: 11px;
    padding: 2px 4px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    margin-top: 2px;
}
</style>