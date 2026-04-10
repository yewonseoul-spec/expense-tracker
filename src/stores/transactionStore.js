import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', () => {
  const now = new Date();
  const transactions = ref([]);
  const categories = ref([]);
  const selectedDate = ref(now.toISOString().slice(0, 10));
  const currentYear = ref(now.getFullYear());
  const currentMonth = ref(now.getMonth() + 1);

  const monthlyIncome = computed(() =>
    transactions.value
      .filter((t) => {
        const [y, m] = t.date.split('-').map(Number);
        return (
          y === currentYear.value &&
          m === currentMonth.value &&
          t.type === 'income'
        );
      })
      .reduce((sum, t) => sum + Number(t.amount), 0),
  );

  const monthlyExpense = computed(() =>
    transactions.value
      .filter((t) => {
        const [y, m] = t.date.split('-').map(Number);
        return (
          y === currentYear.value &&
          m === currentMonth.value &&
          t.type === 'expense'
        );
      })
      .reduce((sum, t) => sum + Number(t.amount), 0),
  );

  const selectedDateTransactions = computed(() =>
    transactions.value.filter((t) => t.date === selectedDate.value),
  );

  const fetchData = async () => {
    try {
      const [transRes, catRes] = await Promise.all([
        axios.get('/api/transactions'),
        axios.get('/api/Categories'),
      ]);
      transactions.value = transRes.data;
      categories.value = catRes.data;
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    }
  };

  const addTransaction = async (data) => {
    const res = await axios.post('/api/transactions', data);
    transactions.value.push(res.data);
  };

  const updateTransaction = async (id, data) => {
    const res = await axios.put(`/api/transactions/${id}`, data);
    const idx = transactions.value.findIndex((t) => t.id === id);
    if (idx !== -1) transactions.value[idx] = res.data;
  };

  const deleteTransaction = async (id) => {
    await axios.delete(`/api/transactions/${id}`);
    transactions.value = transactions.value.filter((t) => t.id !== id);
  };

  const prevMonth = () => {
    if (currentMonth.value === 1) {
      currentYear.value--;
      currentMonth.value = 12;
    } else {
      currentMonth.value--;
    }
  };

  const nextMonth = () => {
    if (currentMonth.value === 12) {
      currentYear.value++;
      currentMonth.value = 1;
    } else {
      currentMonth.value++;
    }
  };

  const goToday = () => {
    const today = new Date();
    currentYear.value = today.getFullYear();
    currentMonth.value = today.getMonth() + 1;
    selectedDate.value = today.toISOString().slice(0, 10);
  };

  ////////////
  // 1. 달력에 들어갈 리스트(년-월 필요)
  let userMonth = ref([]);

  function getMonthRange(year, month) {
    const lastDay = new Date(year, month, 0).getDate();

    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

    return { start, end };
  }

  const getMonth = async (date, userId) => {
    console.log(date + ' ' + userId);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    console.log(year + ' ' + month);

    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = `${year}-${String(month).padStart(2, '0')}-31`;

    console.log(start);
    console.log(end);

    const res = await axios.get('/api/transactions', {
      params: {
        // userId,
        date_gte: start,
        date_lte: end,
      },
    });
    console.log('===================');

    console.log(res.data);

    userMonth.value = res.data;
    console.log(userMonth.value);
  };

  // 2. 달력에서 클릭했을 때 해당 날짜에 해당하는 거래 리스트(년-월-일 필요)
  let userData = ref([]);
  const getDate = async (date, userId) => {
    // http://localhost:3000/transactions?userId=1&date=2026-04-01
    const URL = '/api/transactions';

    let response = await axios.get(URL, {
      params: {
        // userId: userId,   // 👈 문자열로 보내기
        date: date,
      },
    });
    console.log(response.data);
    userData.value = response.data;
  };

  ///////////
  return {
    transactions,
    categories,
    selectedDate,
    currentYear,
    currentMonth,
    monthlyIncome,
    monthlyExpense,
    selectedDateTransactions,
    fetchData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    prevMonth,
    nextMonth,
    goToday,
    userData,
    getDate,
    getMonth,
    userMonth,
  };
});
