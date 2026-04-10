import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  // --- 통화 설정 로직 ---

  // 통화 설정 상태 (기본값 KRW)
  const currency = ref(localStorage.getItem('currency') || 'KRW');

  const exchangeRate = ref(1500);

  // 통화 설정 변경 액션
  const setCurrency = (newCurrency) => {
    currency.value = newCurrency;
    localStorage.setItem('currency', newCurrency);
  };

  // --- 다크모드 설정 로직 ---
  // localStorage에서 문자열 'true'를 불리언(Boolean)으로 변환하여 초기화
  const isDarkMode = ref(localStorage.getItem('darkMode') === 'false');

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    localStorage.setItem('darkMode', isDarkMode.value); // 변경될 때마다 로컬 스토리지 저장
  };

  return { currency, exchangeRate, setCurrency, isDarkMode, toggleDarkMode };
});
