<script setup>
import { useRouter, useRoute } from 'vue-router'; // ✅ 추가
import { ref, computed, onMounted, watch } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useSettingsStore } from '@/stores/settings';
import { useUserStore } from '@/stores/user';
import { formatMoney } from '@/utils/formatter';

const router = useRouter();
const route = useRoute(); // ✅ 추가
const transactionStore = useTransactionStore();
const settingsStore = useSettingsStore();

const currentDate = ref(new Date());
const selectedCategories = ref(['전체']);

const categoryList = [
  { name: '전체', icon: '📊', color: '#455a64' },
  { name: '수입', icon: '💰', color: '#2e7d32' },
  { name: '식비', icon: '🍔', color: '#d32f2f' },
  { name: '카페·간식', icon: '☕', color: '#f57c00' },
  { name: '교통', icon: '🚌', color: '#1976d2' },
  { name: '쇼핑', icon: '🛍️', color: '#8e24aa' },
  { name: '의료·건강', icon: '💊', color: '#009688' },
  { name: '문화·여가', icon: '🎬', color: '#7b1fa2' },
  { name: '통신', icon: '📱', color: '#3949ab' },
  { name: '교육', icon: '📚', color: '#689f38' },
  { name: '여행', icon: '✈️', color: '#0288d1' },
  { name: '기타', icon: '📌', color: '#616161' },
];

function toggleCategory(name) {
  if (name === '전체') {
    selectedCategories.value = ['전체'];
    return;
  }
  selectedCategories.value = selectedCategories.value.filter(
    (c) => c !== '전체',
  );
  const idx = selectedCategories.value.indexOf(name);
  if (idx > -1) selectedCategories.value.splice(idx, 1);
  else selectedCategories.value.push(name);
  if (selectedCategories.value.length === 0)
    selectedCategories.value = ['전체'];
}

const categories = {
  수입: { bg: '#e8f5e9', color: '#2e7d32' },
  식비: { bg: '#fdecea', color: '#c62828' },
  '카페·간식': { bg: '#fff3e0', color: '#ef6c00' },
  교통: { bg: '#e3f2fd', color: '#1565c0' },
  쇼핑: { bg: '#f3e5f5', color: '#6a1b9a' },
  '의료·건강': { bg: '#e0f2f1', color: '#00695c' },
  '문화·여가': { bg: '#ede7f6', color: '#4527a0' },
  통신: { bg: '#e8eaf6', color: '#283593' },
  교육: { bg: '#e8f5e9', color: '#2e7d32' },
  여행: { bg: '#e1f5fe', color: '#0277bd' },
  기타: { bg: '#eceff1', color: '#37474f' },
};

function formatToYYYYMMDD(dateInput) {
  const d = new Date(dateInput);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}


const userStore = useUserStore();
let userId = computed(() => userStore.userId);
onMounted(() => transactionStore.getMonth(currentDate.value, userId));

watch(currentDate, (newDate) => transactionStore.getMonth(newDate, userId));


watch(
  () => route.name,
  (name) => {
    if (name === 'TransactionCal') {
      transactionStore.getMonth(currentDate.value, userId);
    }
  }
);

const transactions = computed(() =>
  Array.isArray(transactionStore.userMonth) ? transactionStore.userMonth : [],
);

const transactionsByDate = computed(() => {
  const map = {};
  transactions.value.forEach((t) => {
    const dateKey = formatToYYYYMMDD(t.date);
    const isIncome = t.type === 'income';
    if (!selectedCategories.value.includes('전체')) {
      const match =
        selectedCategories.value.includes(t.categoryName) ||
        (isIncome && selectedCategories.value.includes('수입'));
      if (!match) return;
    }
    if (!map[dateKey]) map[dateKey] = [];
    map[dateKey].push(t);
  });
  return map;
});

function formatDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getStartDay(year, month) {
  return new Date(year, month, 1).getDay();
}

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const days = [];
  const startDay = getStartDay(year, month);
  const daysInMonth = getDaysInMonth(year, month);

  for (let i = 0; i < startDay; i++) days.push(null);

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = formatDate(year, month, i);
    const dayTransactions = transactionsByDate.value[dateStr] || [];
    const grouped = {};
    dayTransactions.forEach((t) => {
      const key = t.type === 'income' ? '수입' : t.categoryName;
      if (!grouped[key]) grouped[key] = { categoryName: key, amount: 0 };
      grouped[key].amount += Number(t.amount) * (t.type === 'income' ? 1 : -1);
    });
    const mergedTransactions = Object.values(grouped);
    const total = mergedTransactions.reduce((sum, t) => sum + t.amount, 0);
    days.push({
      day: i,
      date: dateStr,
      transactions: mergedTransactions,
      total,
    });
  }

  while (days.length < 42) days.push(null);
  return days;
});

function prevMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
  );
}
function nextMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
  );
}

async function selectDay(day) {
  if (!day) return;
  await transactionStore.getDate(day.date, userStore.userInfo.id);
  router.push({ name: 'TransactionList', params: { date: day.date } });
}
</script>

<template>
  <div class="container">
    <div class="header">
      <button @click="prevMonth">◀</button>
      <h2>
        {{ currentDate.getFullYear() }}년 {{ currentDate.getMonth() + 1 }}월
      </h2>
      <button @click="nextMonth">▶</button>
    </div>

    <div class="category-filter">
      <button v-for="c in categoryList" :key="c.name" @click="toggleCategory(c.name)"
        :class="{ active: selectedCategories.includes(c.name) }" :style="{
          borderColor: c.color,
          background: selectedCategories.includes(c.name) ? c.color : 'white',
          color: selectedCategories.includes(c.name) ? 'white' : c.color,
        }">
        {{ c.icon }} {{ c.name }}
      </button>
    </div>

    <div class="calendar">
      <div class="weekdays">
        <div v-for="d in ['일', '월', '화', '수', '목', '금', '토']" :key="d">
          {{ d }}
        </div>
      </div>

      <div class="grid">
        <div v-for="(day, index) in calendarDays" :key="index" class="cell" @click="selectDay(day)">
          <div v-if="day">
            <div class="date">{{ day.day }}</div>
            <div class="total" :class="{ plus: day.total > 0, minus: day.total < 0 }">
              {{
                day.total !== 0
                  ? formatMoney(
                    day.total,
                    settingsStore.currency,
                    settingsStore.exchangeRate,
                  )
                  : ''
              }}
            </div>
            <div class="items">
              <div v-for="(t, i) in day.transactions" :key="i" class="item" :style="{
                background: categories[t.categoryName]?.bg,
                color: categories[t.categoryName]?.color,
              }">
                <span>{{ t.categoryName }}</span>
                <span>{{
                  formatMoney(
                    Math.abs(t.amount),
                    settingsStore.currency,
                    settingsStore.exchangeRate,
                  )
                }}</span>
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
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  margin: 30px 0 15px;
}

.category-filter {
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
  flex-wrap: nowrap;
}

.category-filter button {
  border: 2px solid;
  padding: 5px 10px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
}

.category-filter button.active {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
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
  grid-auto-rows: minmax(120px, auto);
}

.cell {
  border: 1px solid #eee;
  padding: 5px;
  box-sizing: border-box;
  cursor: pointer;
}

.total.plus {
  color: green;
  font-weight: 600;
}

.total.minus {
  color: red;
  font-weight: 600;
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
