<template>
  <div class="container">
    <!-- 1. 수입, 지출, 수익 -->
    <div class="content-wrapper">
      <section class="summary-grid">
        <!-- 총수입 -->
        <div class="card summary-card">
          <p class="summary-label">총 수입</p>
          <p class="summary-value positive">
            +{{ totalIncome.toLocaleString() }}
          </p>
        </div>
        <!-- 총지출 -->
        <div class="card summary-card">
          <p class="summary-label">총 지출</p>
          <p class="summary-value negative">
            {{ totalExpense.toLocaleString() }}
          </p>
        </div>
        <!-- 순수익 -->
        <div class="card summary-card">
          <p class="summary-label">순수익</p>
          <p class="summary-value">
            {{ (totalIncome + totalExpense).toLocaleString() }}
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
          <div v-for="text in transactions" :key="text.id" class="text-item">
            <div class="text-left">
              <div :class="['icon-circle', text.amount < 0 ? 'out' : 'in']">
                {{ text.amount < 0 ? '↘' : '↗' }}
              </div>
              <div>
                <p class="text-title">{{ text.title }}</p>
                <p class="text-info">{{ text.date }} • {{ text.paymethod }}</p>
              </div>
            </div>
            <div class="text-right">
              <p
                :class="[
                  'text-amount',
                  text.amount < 0 ? 'negative' : 'positive',
                ]"
              >
                {{ text.amount < 0 ? '' : '+' }}
                {{ text.amount.toLocaleString() }}
              </p>
              <!-- 나중에 카테고리 배지 표현 추가 -->
              <!-- <span :class="['status-badge', text.status.toLowerCase()]">{{
                text.status
              }}</span> -->
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- 빠른 추가 버튼 -->
  <button @click="openModal" class="add">+</button>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore'; // Header 날짜 가져오기

//
// 날짜 필터링 기능
//
const store = useTransactionStore();

// 1. 헤더 날짜에 맞춰 거래 내역 필터링
const filteredTransactions = computed(() => {
  const selected = store.selectedDate;

  return transactions.value.filter((tx) => {
    const txDate = new Date(tx.date);
    return (
      txDate.getFullYear() === selected.year &&
      txDate.getMonth() + 1 === selected.month
    );
  });
});

// 2. 필터링된 날짜 데이터 적용
// 총 수입 계산
const totalIncome = computed(() =>
  filteredTransactions.value
    .filter((t) => t.amount > 0)
    .reduce((acc, cur) => acc + cur.amount, 0),
);

// 총 지출 계산
const totalExpense = computed(() =>
  filteredTransactions.value
    .filter((t) => t.amount < 0)
    .reduce((acc, cur) => acc + cur.amount, 0),
);

//
// 차트 등 기본설정
//
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js';

// Chart.js 필수 요소 등록
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
);

// 차트 데이터 설정 (임시 데이터)
const chartData = computed(() => {
  return {
    labels: ['1월', '2월', '3월', '4월'],
    datasets: [
      {
        label: '수입',
        backgroundColor: '#10b981',
        data: [1500000, 200000, 800000, 1200000],
      },
      {
        label: '지출',
        backgroundColor: '#f43f5e',
        data: [1000000, 310000, 750000, 2000000],
      },
    ],
  };
});

// 차트 디자인 설정
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#333',
      bodyColor: '#666',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 10,
      displayColors: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { display: true, drawBorder: false, color: '#f3f4f6' },
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

//
// 빠른 추가 버튼(+) 모달 이벤트
//
const isModalOpen = ref(false);

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

.section-title,
.summary-label {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #374151;
}

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

.text-title {
  font-weight: 700;
  color: #374151;
  margin: 0;
}
.text-info {
  font-size: 12px;
  color: #9ca3af;
  margin: 2px 0 0 0;
}

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

/* 빠른 신규추가 버튼 */
.add {
  position: fixed;
  bottom: 50px;
  right: calc(50% - 580px);
  width: 56px;
  height: 56px;
  background: #16a34a;
  color: white;
  border-radius: 50%;
  font-size: 28px;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 100;
}

.add:hover {
  transform: scale(1.1);
}

@media (max-width: 1250px) {
  .add {
    right: 30px;
  }
}
</style>
