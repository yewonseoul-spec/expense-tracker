import { defineStore } from 'pinia';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', {
  state: () => {
    const now = new Date();
    return {
      transactions: [],
      categories: [],
      selectedDate: now.toISOString().slice(0, 10),
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
    };
  },
  getters: {
    monthlyIncome: (state) =>
      state.transactions
        .filter((t) => {
          const [y, m] = t.date.split('-').map(Number);
          return (
            y === state.currentYear &&
            m === state.currentMonth &&
            t.type === 'income'
          );
        })
        .reduce((sum, t) => sum + Number(t.amount), 0),
    monthlyExpense: (state) =>
      state.transactions
        .filter((t) => {
          const [y, m] = t.date.split('-').map(Number);
          return (
            y === state.currentYear &&
            m === state.currentMonth &&
            t.type === 'expense'
          );
        })
        .reduce((sum, t) => sum + Number(t.amount), 0),
    selectedDateTransactions: (state) =>
      state.transactions.filter((t) => t.date === state.selectedDate),
  },
  actions: {
    async fetchData() {
      try {
        const [transRes, catRes] = await Promise.all([
          axios.get('/api/transactions'),
          axios.get('/api/Categories'),
        ]);
        this.transactions = transRes.data;
        this.categories = catRes.data;
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      }
    },
    async addTransaction(data) {
      const res = await axios.post('/api/transactions', data);
      this.transactions.push(res.data);
    },
    async updateTransaction(id, data) {
      const res = await axios.put(`/api/transactions/${id}`, data);
      const idx = this.transactions.findIndex((t) => t.id === id);
      if (idx !== -1) this.transactions[idx] = res.data;
    },
    async deleteTransaction(id) {
      await axios.delete(`/api/transactions/${id}`);
      this.transactions = this.transactions.filter((t) => t.id !== id);
    },
    prevMonth() {
      if (this.currentMonth === 1) {
        this.currentYear--;
        this.currentMonth = 12;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 12) {
        this.currentYear++;
        this.currentMonth = 1;
      } else {
        this.currentMonth++;
      }
    },
    goToday() {
      const now = new Date();
      this.currentYear = now.getFullYear();
      this.currentMonth = now.getMonth() + 1;
      this.selectedDate = now.toISOString().slice(0, 10);
    },
  },
});
