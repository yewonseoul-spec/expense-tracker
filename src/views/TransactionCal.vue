<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useUserStore } from '@/stores/user';
import TransactionForm from '@/components/TransactionForm.vue';
import TransactionDetail from '@/components/TransactionDetail.vue';
import { useSettingsStore } from '@/stores/settings';
import { formatMoney } from '@/utils/formatter';

const transactionStore = useTransactionStore();
const userStore = useUserStore();
const userId = computed(() => userStore.userInfo.id);

const settingsStore = useSettingsStore();

const props = defineProps({ isBackground: Boolean });

const selectedDay = ref(null);
const editingTransaction = ref(null);

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

onMounted(() => {
  if (!props.isBackground && userId.value)
    transactionStore.getMonth(currentDate.value, userId.value);
});
watch(currentDate, (newDate) => {
  if (!props.isBackground && userId.value)
    transactionStore.getMonth(newDate, userId.value);
});
watch(userId, (newId) => {
  if (!props.isBackground && newId)
    transactionStore.getMonth(currentDate.value, newId);
});

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
  if (selectedDay.value?.date === day.date) {
    selectedDay.value = null;
    return;
  }
  await transactionStore.getDate(day.date, userId.value);
  selectedDay.value = day;
}

const categoryList2 = [
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

function getCategory(name) {
  const c = categoryList2.find((cat) => cat.name === name);
  return c ? { bg: '#fff', color: c.color } : { bg: '#eee', color: '#333' };
}

function getCategoryIcon(name) {
  const c = categoryList2.find((cat) => cat.name === name);
  return c ? c.icon : '📌';
}

function openEdit(t) {
  editingTransaction.value = t;
}

function closeEdit() {
  editingTransaction.value = null;
}

const selectedDayDate = computed(() => {
  if (!selectedDay.value) return null;
  const d = new Date(selectedDay.value.date);
  return {
    monthDay: `${d.getMonth() + 1}월 ${d.getDate()}일`,
    year: d.getFullYear(),
  };
});

async function refreshSelectedDay() {
  if (!selectedDay.value) return;
  await transactionStore.getDate(selectedDay.value.date, userId);
  if (transactionStore.userData.length === 0) {
    selectedDay.value = null;
  }
}

async function handleSaved() {
  editingTransaction.value = null;
  await refreshSelectedDay();
  await transactionStore.getMonth(currentDate.value, userId.value);
}

async function handleDeleted(id) {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  await transactionStore.deleteTransaction(id);
  editingTransaction.value = null;
  await transactionStore.getDate(selectedDay.value.date, userId);
  await transactionStore.getMonth(currentDate.value, userId.value);
  if (transactionStore.userData.length === 0) {
    selectedDay.value = null;
  }
}

const displayAmount = (amount) => {
  return formatMoney(
    amount,
    settingsStore.currency,
    settingsStore.exchangeRate,
  );
};
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
      <button
        v-for="c in categoryList"
        :key="c.name"
        @click="toggleCategory(c.name)"
        :class="{ active: selectedCategories.includes(c.name) }"
        :style="{
          borderColor: c.color,
          background: selectedCategories.includes(c.name)
            ? c.color
            : 'transparent',
          color: selectedCategories.includes(c.name) ? '#ffffff' : c.color,
        }"
      >
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
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="cell"
          @click="selectDay(day)"
        >
          <div v-if="day">
            <div class="date">{{ day.day }}</div>
            <div
              class="total"
              :class="{ plus: day.total > 0, minus: day.total < 0 }"
            >
              {{ day.total !== 0 ? displayAmount(day.total) : '' }}
            </div>
            <div class="items">
              <div
                v-for="(t, i) in day.transactions"
                :key="i"
                class="item"
                :style="{
                  background: categories[t.categoryName]?.bg,
                  color: categories[t.categoryName]?.color,
                }"
              >
                <span>{{ t.categoryName }}</span>
                <span>{{ displayAmount(Math.abs(t.amount)) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <router-view v-if="!isBackground" />

    <!-- 날짜 클릭 시 거래 상세 리스트 -->
    <div v-if="selectedDay && !editingTransaction" class="detail-panel">
      <div class="detail-header">
        <span class="detail-date">{{ selectedDayDate?.monthDay }}</span>
        <button class="detail-close" @click="selectedDay = null">✕</button>
      </div>
      <TransactionDetail
        v-for="t in transactionStore.userData"
        :key="t.id"
        :t="t"
        :categoryColors="getCategory(t.categoryName)"
        :icon="getCategoryIcon(t.categoryName)"
        @edit="openEdit"
        @delete="handleDeleted"
      />
    </div>

    <!-- 수정 폼 오버레이 -->
    <div v-if="editingTransaction" class="form-overlay">
      <TransactionForm
        :editData="editingTransaction"
        @close="closeEdit"
        @saved="handleSaved"
      />
    </div>
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
  color: var(--text-primary);
}

.header button {
  background: transparent;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 18px;
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
  background: var(--color-success);
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
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-primary);
  padding: 5px;
  box-sizing: border-box;
  cursor: pointer;
}

.total.plus {
  color: var(--color-success);
  font-weight: 600;
}

.total.minus {
  color: var(--color-danger);
  font-weight: 600;
}

.detail-panel {
  position: fixed;
  right: 0;
  top: 120px;
  width: 420px;
  max-height: calc(100vh - 140px);
  background: white;
  border-radius: 12px 0 0 12px;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.12);
  padding: 16px;
  overflow-y: auto;
  z-index: 100;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--card-bg);
  color: var(--text-primary);
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.detail-date {
  font-size: 16px;
  font-weight: bold;
}

.detail-close {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.item {
  font-size: 11px;
  padding: 2px 4px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
}

.form-overlay {
  position: fixed;
  inset: 0;
  z-index: 800;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 116px 16px 24px;
  overflow-y: auto;
}

html.dark .weekdays {
  background: var(--card-bg);
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}

html.dark .item {
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid currentColor;
  filter: brightness(2.5) saturate(1.2);

  font-weight: 600;
}

html.dark .category-filter button {
  filter: brightness(2);
}

html.dark .detail-panel {
  background-color: rgba(0, 0, 0, 0.9);
}

html.dark .detail-header {
  border: 1px solid var(--border-color);
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.5);
}
</style>
