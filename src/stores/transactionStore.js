import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
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
  };
});
