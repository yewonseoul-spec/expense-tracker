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
            v-for="text in visibleTransactions"
            :key="text.id"
            class="text-item"
          >
            <!-- 좌측 표현요소 -->
            <div class="text-left">
              <!-- 수입 / 지출 아이콘으로 표현 -->
              <div
                :class="['icon-circle', text.type === 'income' ? 'in' : 'out']"
              >
                {{ text.type === 'income' ? '↗' : '↘' }}
              </div>
              <!-- 거래내역명 , 거래일자 -->
              <div>
                <p class="text-memo">{{ text.memo }}</p>
                <p class="text-info">{{ text.date }}</p>
              </div>
            </div>
            <!-- 우측 표현요소 -->
            <div class="text-right">
              <!-- 금액, 카테고리 표기-->
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
              </p>
              <!-- 배지 표현 추가, 거래내역의 카테고리 디자인 참조 -->
              <!-- <span
                v-if="text.categoryName"
                class="status-badge"
                :style="getBadgeStyle(text.categoryName)"
              >
                {{ text.categoryName }}
              </span> -->
            </div>
          </div>
        </div>
        <!-- 하단 더보기 버튼 관련 기능-->
        <div v-if="filteredTransactions.length > 5" class="more-btn-container">
          <button @click="toggleList" class="more-btn-styled">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                v-if="!isFullList"
                d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
                fill="currentColor"
              />
              <path
                v-else
                d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useUserStore } from '@/stores/user'; // 사용자 정보
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

// categories 선언
// const categories = {
//   수입: { bg: '#e8f5e9', color: '#2e7d32' },
//   식비: { bg: '#fdecea', color: '#c62828' },
//   '카페·간식': { bg: '#fff3e0', color: '#ef6c00' },
//   교통: { bg: '#e3f2fd', color: '#1565c0' },
//   쇼핑: { bg: '#f3e5f5', color: '#6a1b9a' },
//   '의료·건강': { bg: '#e0f2f1', color: '#00695c' },
//   '문화·여가': { bg: '#ede7f6', color: '#4527a0' },
//   통신: { bg: '#e8eaf6', color: '#283593' },
//   교육: { bg: '#e8f5e9', color: '#2e7d32' },
//   여행: { bg: '#e1f5fe', color: '#0277bd' },
//   기타: { bg: '#eceff1', color: '#37474f' },
// };

const props = defineProps({ isBackground: Boolean });

const store = useTransactionStore();
const userStore = useUserStore();
const currentUserId = computed(() => userStore.userId);

// 데이터 초기 로드
onMounted(() => {
  if (!props.isBackground) store.fetchData();
});

// 날짜 / 사용자 변경 감시
watch(
  () => [store.currentYear, store.currentMonth],
  () => {
    if (!props.isBackground) store.fetchData();
  },
);

const totalIncome = computed(() => {
  return filteredTransactions.value
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
});

const totalExpense = computed(() => {
  return filteredTransactions.value
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
});

// 필터링된 내역
const filteredTransactions = computed(() => {
  if (!store.transactions || !currentUserId.value) return [];

  return (
    store.transactions
      .filter((t) => {
        //  사용자 id 체크
        const idCheck = String(t.userId) === String(currentUserId.value);
        // 날짜 체크
        const [y, m] = t.date.split('-').map(Number);
        const isDate = y === store.currentYear && m === store.currentMonth;

        return idCheck && isDate;
      })
      // 일자별 내림차순 정렬
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  );
});

// 차트 데이터 생성
const chartData = computed(() => {
  const monthCount = store.currentMonth; // 변수 정의 추가
  const labels = [];
  const targetMonths = [];
  const incomeData = Array(monthCount).fill(0);
  const expenseData = Array(monthCount).fill(0);

  // 다크 모드 상태에 따른 색상
  const isDark = settingsStore.isDarkMode;
  const colorSuccess = isDark ? '#34d399' : '#10b981'; // 수입
  const colorDanger = isDark ? '#fb7185' : '#f43f5e'; // 지출

  // 1월부터 현재 월까지 순서대로 생성
  for (let i = 0; i < monthCount; i++) {
    const d = new Date(store.currentYear, i, 1);
    targetMonths.push(d);
    labels.push(`${i + 1}월`);
  }

  // 데이터 합산 (store.transactions 직접 참조)
  if (store.transactions) {
    store.transactions.forEach((item) => {
      // 현재 사용자 데이터만 합산되도록 체크
      if (String(item.userId) !== String(currentUserId.value)) return;

      const itemDate = new Date(item.date);
      const itemYear = itemDate.getFullYear();
      const itemMonth = itemDate.getMonth();

      if (itemYear === store.currentYear && itemMonth < monthCount) {
        const amt = Number(item.amount);
        if (item.type === 'income') {
          // 수익인 경우
          incomeData[itemMonth] += amt;
        } else {
          expenseData[itemMonth] += Math.abs(amt);
        }
      }
    });
  }

  return {
    labels,
    datasets: [
      {
        label: '수입',
        backgroundColor: colorSuccess,
        data: incomeData,
        borderRadius: 8,
      },
      {
        label: '지출',
        backgroundColor: colorDanger,
        data: expenseData,
        borderRadius: 8,
      },
    ],
  };
});

// 차트 옵션
const chartOptions = computed(() => {
  // 다크 모드 상태에 따른 색상
  const isDark = settingsStore.isDarkMode;
  const textColor = isDark ? '#ffffff' : '#374151';
  const gridColor = isDark ? '#3d3d3d' : '#f3f4f6';

  return {
    responsive: true,
    maintainAspectRatio: false,
    color: textColor,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
        },
      },
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
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          callback: function (value) {
            return formatMoney(
              value,
              settingsStore.currency,
              settingsStore.exchangeRate,
            );
          },
        },
      },

      x: {
        grid: { display: false },
        ticks: {
          color: textColor,
        },
      },
    },
  };
});

// 최근 거래 카테고리 배지 표기
// const getBadgeStyle = (categoryName) => {
//   const config = categories[categoryName] || categories['기타'];
//   return {
//     backgroundColor: config.bg,
//     color: config.color,
//   };
// };

// 최근 거래 내역 더보기 기능
const isModalOpen = ref(false);
const displayCount = ref(4); // 최근 거래내역 보여줄 갯수 지정

// 위에서 필터링 한 filteredTransactions 사용하여 displayCount 만큼만 자르기
const visibleTransactions = computed(() => {
  return filteredTransactions.value.slice(0, displayCount.value);
});

// 모든 내역을 조회하였는지 확인
const isFullList = computed(() => {
  return displayCount.value >= filteredTransactions.value.length;
});

// 더보기 버튼 클릭 시 실행할 함수
const toggleList = () => {
  if (isFullList.value) {
    // 모두 조회한 경우 리스트를 접고 초기화
    displayCount.value = 4;
  } else {
    // 리스트 내역이 더 있다면 추가
    displayCount.value += 4;
  }
};
</script>

<style scoped>
/* 전체 배경 및 폰트 */
.container {
  background-color: transparent;
  padding: 20px 20px 40px 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 카드 스타일 */
.card {
  background-color: var(--card-bg);
  border-radius: 16px;
  padding: 24px;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
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
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-primary);
}
/* 총수익, 총지출, 순수익 금액 */
.summary-value {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-info);
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
  border-bottom: 1px solid var(--border-color);
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
  border: 10px dashed #e5e7eb;
  border-radius: 12px;
}
/* 최근 거래내역 */
/* 내역명 */
.text-memo {
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}
/* 거래일자 · 결제수단 */
.text-info {
  font-size: 12px;
  color: var(--text-secondary);
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
  color: var(--color-danger);
}
.positive {
  color: var(--color-success);
}

/* 배지 기본 스타일 */
.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  margin-top: 4px;
}
/* 금액과 배지를 세로로 정렬하기 위해 부모 요소 확인 */
.text-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

/* 최근 거래내역 더보기 버튼 */
.more-btn-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.more-btn {
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

.more-btn:hover {
  background-color: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.more-btn-styled {
  width: 100%;
  max-width: 200px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}
</style>
