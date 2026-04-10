<template>
  <div class="card" :class="t.type">
    <div class="top">
      <div class="left">
        <!-- 카테고리 아이콘 (달력과 동일) -->
        <span class="icon">{{ icon }}</span>
        <span
          class="category"
          :style="{
            background: categoryColors.bg,
            color: categoryColors.color,
          }"
        >
          {{ t.categoryName }}
        </span>
      </div>
      <span class="date">{{ t.date }}</span>
    </div>

    <div class="middle">
      <span class="amount" :class="t.type">
        {{ t.type === 'income' ? '+' : '-' }}
        {{ displayAmount(Number(t.amount)) }}원
      </span>
    </div>

    <div class="bottom">
      {{ t.memo }}
    </div>

    <div class="actions">
      <button @click="$emit('edit', t)">수정</button>
      <button @click="$emit('delete', t.id)">삭제</button>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings';
import { formatMoney } from '@/utils/formatter';

const props = defineProps({
  t: Object,
  categoryColors: Object,
  icon: String,
});

const settingsStore = useSettingsStore();

const displayAmount = (amount) => {
  return formatMoney(
    amount,
    settingsStore.currency,
    settingsStore.exchangeRate,
  );
};
</script>

<style scoped>
.card {
  background-color: var(--card-bg);
  border-radius: 14px;
  padding: 16px;
  margin: 12px 0;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 아이콘 크기 */
.icon {
  font-size: 20px;
}

.category {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
}

.date {
  font-size: 12px;
  opacity: 0.6;
  color: var(--text-secondary);
}

.middle {
  font-size: 20px;
  font-weight: bold;
}

.amount.income {
  color: var(--color-success);
}

.amount.expense {
  color: var(--color-danger);
}

.bottom {
  font-size: 13px;
  color: var(--text-secondary);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.actions button {
  padding: 4px 8px;
  font-size: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.actions button:hover {
  opacity: 0.8;
}

.actions button:first-child {
  background-color: var(--color-info);
  color: white;
}

.actions button:last-child {
  background-color: var(--color-danger);
  color: white;
}

.card.income {
  background: linear-gradient(135deg, #e8f5e9, #f1fff5);
}

.card.expense {
  background: linear-gradient(135deg, #fdecea, #fff5f5);
}

html.dark .card.income,
html.dark .card.expense {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.4);
}

html.dark .category {
  background: rgba(255, 255, 255, 0.08) !important;
  filter: brightness(2.5) saturate(1.2);
}

html.dark .actions button:first-child {
  background-color: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
}

html.dark .actions button:last-child {
  background-color: rgba(248, 113, 113, 0.2);
  color: #f87171;
}
</style>
