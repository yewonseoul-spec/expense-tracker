import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  // 통화 설정 상태 (기본값 KRW)
  const currency = ref(localStorage.getItem('currency') || 'KRW');

  const exchangeRate = ref(1500);

  // 통화 설정 변경 액션
  const setCurrency = (newCurrency) => {
    currency.value = newCurrency;
    localStorage.setItem('currency', newCurrency);
  };

  return { currency, exchangeRate, setCurrency };
});
