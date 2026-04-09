<template>
  <div class="container">
    <!-- 1. 수입, 지출, 수익 -->
    <div class="content-wrapper">
      <section class="summary-grid">
        <!-- 총수입 -->
        <div class="card summary-card">
          <p class="summary-label">총 수입</p>
          <p class="summary-value positive">
            +{{
              formatMoney(
                totalIncome,
                settingsStore.currency,
                settingsStore.exchangeRate,
              )
            }}
          </p>
        </div>
        <!-- 총지출 -->
        <div class="card summary-card">
          <p class="summary-label">총 지출</p>
          <p class="summary-value negative">
            -{{
              formatMoney(
                totalExpense,
                settingsStore.currency,
                settingsStore.exchangeRate,
              )
            }}
          </p>
        </div>
        <!-- 순수익 -->
        <div class="card summary-card">
          <p class="summary-label">순수익</p>
          <p class="summary-value">
            {{
              formatMoney(
                totalIncome - totalExpense,
                settingsStore.currency,
                settingsStore.exchangeRate,
              )
            }}
          </p>
        </div>
      </section>
      <!-- 2-1. 월별 수입 및 지출 -->
      <section class="card stats-section">
        <h3 class="section-title">월별 수입 및 지출</h3>
        <div class="chart-container">
          <Bar :data="chartData" :options="chartOptions" />
        </div>
      </section>

      <!-- 2-2. 카테고리별 지출 차트(필요시 추가)-->
      <!-- <section class="card stats-section">
        <h3 class="section-title">카테고리별 지출 비율</h3>
        <div class="doughnut-container">
          <Doughnut :data="doughnutData" :options="doughnutOptions" />
        </div>
      </section> -->

      <!-- 3. 최근 거래내역 -->
      <section class="card">
        <h3 class="section-title">최근 거래내역</h3>
        <div class="text-list">
          <div
            v-for="text in filteredTransactions"
            :key="text.id"
            class="text-item"
          >
            <div class="text-left">
              <div
                :class="['icon-circle', text.type === 'income' ? 'in' : 'out']"
              >
                {{ text.type === 'income' ? '↗' : '↘' }}
              </div>
              <div>
                <p class="text-title">{{ text.title }}</p>
                <p class="text-info">{{ text.date }}</p>
              </div>
            </div>
            <div class="text-right">
              <p
                :class="[
                  'text-amount',
                  text.type === 'income' ? 'positive' : 'negative',
                ]"
              >
                {{ text.type === 'income' ? '+' : '-' }}
                {{
                  formatMoney(
                    text.amount,
                    settingsStore.currency,
                    settingsStore.exchangeRate,
                  )
                }}

                {{ text.amount < 0 ? '' : '+' }}
              </p>
              <!-- 나중에 카테고리 - 배지 표현 추가 -->
              <!-- <span :class="['status-badge', text.status.toLowerCase()]">{{
                text.status
              }}</span> -->
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useSettingsStore } from '@/stores/settings';
import { formatMoney } from '@/utils/formatter';

const settingsStore = useSettingsStore();

import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

// Chart.js 등록
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

const store = useTransactionStore();

// 데이터 초기 로드
onMounted(() => {
  store.fetchData();
});

// 날짜 변경 감시
watch(
  () => [store.currentYear, store.currentMonth],
  () => {
    store.fetchData();
  },
);

const totalIncome = computed(() => store.monthlyIncome || 0);
const totalExpense = computed(() => store.monthlyExpense || 0);

// 필터링된 내역
const filteredTransactions = computed(() => {
  if (!store.transactions) return [];
  return store.transactions.filter((t) => {
    const [y, m] = t.date.split('-').map(Number);
    return y === store.currentYear && m === store.currentMonth;
  });
});

// 차트 데이터 생성
const chartData = computed(() => {
  const monthCount = store.currentMonth; // 변수 정의 추가
  const labels = [];
  const targetMonths = [];
  const incomeData = Array(monthCount).fill(0);
  const expenseData = Array(monthCount).fill(0);

  // 1월부터 현재 월까지 순서대로 생성
  for (let i = 0; i < monthCount; i++) {
    const d = new Date(store.currentYear, i, 1);
    targetMonths.push(d);
    labels.push(`${i + 1}월`);
  }

  // 데이터 합산 (store.transactions 직접 참조)
  if (store.transactions) {
    store.transactions.forEach((item) => {
      const itemDate = new Date(item.date);
      targetMonths.forEach((target, index) => {
        if (
          itemDate.getFullYear() === target.getFullYear() &&
          itemDate.getMonth() === target.getMonth()
        ) {
          const amt = Number(item.amount);
          if (item.type === 'income') {
            // 수익인 경우
            incomeData[index] += amt;
          } else {
            expenseData[index] += Math.abs(amt);
          }
        }
      });
    });
  }

  return {
    labels,
    datasets: [
      {
        label: '수입',
        backgroundColor: '#10b981',
        data: incomeData,
        borderRadius: 3,
      },
      {
        label: '지출',
        backgroundColor: '#f43f5e',
        data: expenseData,
        borderRadius: 3,
      },
    ],
  };
});

// 차트 옵션
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += formatMoney(
              context.parsed.y,
              settingsStore.currency,
              settingsStore.exchangeRate,
            );
          }
          return label;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#f3f4f6' },
      ticks: {
        callback: function (value) {
          return formatMoney(
            value,
            settingsStore.currency,
            settingsStore.exchangeRate,
          );
        },
      },
    },

    x: { grid: { display: false } },
  },
};

const transactions = ref([
  {
    id: 1,
    title: '점심',
    date: '2026-03-23',
    type: 'expense',
    categoryName: '식비',
    amount: -8000,
    paymethod: '신용카드',
    memo: '',
  },
  {
    id: 2,
    title: '필기구 구입',
    date: '2026-04-03',
    type: 'expense',
    categoryName: '공부',
    amount: -1500,
    paymethod: '현금',
    memo: '',
  },
  {
    id: 3,
    title: '급여',
    date: '2026-04-10',
    type: 'income',
    categoryName: '수입',
    amount: 500000,
    paymethod: '은행',
    memo: '',
  },
]);

// 초기값 데이터
const newInput = ref({
  title: '',
  amount: null,
  type: 'expense',
  categoryName: '식비',
  paymethod: '신용카드',
  memo: '',
});

const openModal = () => {
  isModalOpen.value = true;
};
</script>

<style scoped>
/* 전체 배경 및 폰트 */
.container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 100px 20px 40px 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 카드 스타일 */
.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
  width: 100%;
}
.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}
.summary-card {
  text-align: center;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 0;
}
/* section title */
.section-title,
.summary-label {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #374151;
}
/* 총수익, 총지출, 순수익 금액 */
.summary-value {
  font-size: 22px;
  font-weight: 800;
  color: blue;
}
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  margin-bottom: 2px;
}
.summary-card {
  margin-bottom: 0 !important;
  text-align: center;
}

.input-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

input,
select {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
}

input:focus {
  border-color: #4f46e5;
}

.btn-primary {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.text-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
}

.text-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.icon-circle.out {
  background: #fef2f2;
  color: #ef4444;
}
.icon-circle.in {
  background: #f0fdf4;
  color: #22c55e;
}

/* 최근 거래내역 */
/* 내역명 */
.text-title {
  font-weight: 700;
  color: #374151;
  margin: 0;
}
/* 거래일자 · 결제수단 */
.text-info {
  font-size: 12px;
  color: #9ca3af;
  margin: 2px 0 0 0;
}
/* 금액 */
.text-amount {
  font-weight: 700;
  font-size: 18px;
  margin: 0;
}
.summary-value {
  font-weight: 700;
  font-size: 18px;

  margin: 0;
}
.negative {
  color: #ef4444;
}
.positive {
  color: #22c55e;
}
/* 차트 영역 설정 */
.stats-section {
  width: 100%;
}
.chart-container {
  height: 350px;
  width: 100%;
  position: relative;
  margin-top: 10px;
}
.chart-placeholder {
  height: 300px;
  background: #fdfdfd;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
}
</style>
