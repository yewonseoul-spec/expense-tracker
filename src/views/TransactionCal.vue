<script setup>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';

const router = useRouter();
const transactionStore = useTransactionStore();

const currentDate = ref(new Date());
const selectedDate = ref(null);

// 카테고리 스타일
const categories = {
  식사: { bg: '#fdecea', color: '#c62828' },
  교통: { bg: '#e3f2fd', color: '#1565c0' },
  쇼핑: { bg: '#fff3e0', color: '#ef6c00' },
  수입: { bg: '#e0f7ec', color: '#2e7d32' },
  고정비: { bg: '#ede7f6', color: '#5e35b1' },
};

// ✅ 날짜 포맷 통일 함수 (핵심🔥)
function formatToYYYYMMDD(dateInput) {
  const d = new Date(dateInput);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ✅ 월 데이터 가져오기
onMounted(() => {
  console.log(currentDate.value);

  transactionStore.getMonth(currentDate.value, '1');
});

// ✅ 월 변경 시 다시 호출
watch(currentDate, (newDate) => {
  transactionStore.getMonth(newDate, '1');
});

// ✅ store 데이터
const transactions = computed(() =>
  Array.isArray(transactionStore.userMonth)
    ? transactionStore.userMonth
    : []
);

// ✅ 날짜별 그룹핑 (포맷 강제 통일)
const transactionsByDate = computed(() => {
  const map = {};

  transactions.value.forEach((t) => {
    const dateKey = formatToYYYYMMDD(t.date);

    if (!map[dateKey]) map[dateKey] = [];
    map[dateKey].push(t);
  });

  return map;
});

// 캘린더용 날짜 생성
function formatDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getStartDay(year, month) {
  return new Date(year, month, 1).getDay();
}

// ✅ 캘린더 데이터
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDay(year, month);

  const days = [];

  for (let i = 0; i < startDay; i++) days.push(null);

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = formatDate(year, month, i);

    const dayTransactions = transactionsByDate.value[dateStr] || [];

    const total = dayTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

    days.push({
      day: i,
      date: dateStr,
      transactions: dayTransactions,
      total,
    });
  }

  while (days.length < 42) days.push(null);

  return days;
});

// 월 이동
function prevMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1
  );
}

function nextMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1
  );
}

// 날짜 클릭
async function selectDay(day) {
  if (!day) return;

  selectedDate.value = day.date;

  await transactionStore.getDate(day.date, '1');

  router.push({
    name: 'TransactionList',
    params: { date: day.date }
  });
}
</script>

<template>
  <div>
    <div class="calendar">

      <div class="header">
        <button @click="prevMonth">◀</button>
        <h2>
          {{ currentDate.getFullYear() }}년 {{ currentDate.getMonth() + 1 }}월
        </h2>
        <button @click="nextMonth">▶</button>
      </div>

      <div class="weekdays">
        <div v-for="d in ['일', '월', '화', '수', '목', '금', '토']" :key="d">
          {{ d }}
        </div>
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
                background: categories[t.categoryName]?.bg,
                color: categories[t.categoryName]?.color,
              }">
                <span>{{ t.categoryName }}</span>
                <span>
                  {{ t.amount > 0 ? '+' : '' }}{{ Number(t.amount).toLocaleString() }}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>

    <router-view />
  </div>
</template>

<style scoped>
.calendar {
  width: 100%;
  max-width: 1200px;
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
  color: green;
}

.total.minus {
  color: red;
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
