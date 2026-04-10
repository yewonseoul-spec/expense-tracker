<template>
  <div class="form-card">
    <!-- ── 헤더 ── -->
    <div class="form-header">
      <div class="form-title-row">
        <h5 class="form-title">거래 {{ isEdit ? '수정' : '등록' }}</h5>
        <span class="form-badge" :class="isEdit ? 'badge--edit' : 'badge--new'">
          {{ isEdit ? '수정' : '새 거래' }}
        </span>
      </div>
      <button class="close-btn" @click="$emit('close')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>

    <!-- ── 지출 / 수입 탭 ── -->
    <div class="type-tab">
      <button
        class="type-btn"
        :class="
          form.type === 'expense' ? 'type-btn--expense' : 'type-btn--inactive'
        "
        @click="setType('expense')"
      >
        지출
      </button>
      <button
        class="type-btn"
        :class="
          form.type === 'income' ? 'type-btn--income' : 'type-btn--inactive'
        "
        @click="setType('income')"
      >
        수입
      </button>
    </div>

    <!-- ── 폼 본문 ── -->
    <div class="form-body">
      <!-- 금액 -->
      <div
        class="amount-section"
        :class="
          form.type === 'expense'
            ? 'amount-section--expense'
            : 'amount-section--income'
        "
      >
        <span class="amount-currency">{{ currencySymbol }}</span>
        <input
          v-model.number="form.amount"
          type="number"
          min="0"
          class="amount-input"
          placeholder="0"
          @input="clearError('amount')"
        />
        <span class="amount-unit">원</span>
      </div>
      <p v-if="errors.amount" class="field-error">{{ errors.amount }}</p>

      <!-- 내역명 -->
      <div class="field-row">
        <label class="field-label">내역명</label>
        <input
          v-model="form.memo"
          type="text"
          class="field-input"
          :class="{ 'field-input--error': errors.memo }"
          placeholder="거래 내역을 입력하세요"
          @input="clearError('memo')"
        />
      </div>
      <p v-if="errors.memo" class="field-error">{{ errors.memo }}</p>

      <!-- 날짜 -->
      <div class="field-row">
        <label class="field-label">날짜</label>
        <input v-model="form.date" type="date" class="field-input" />
      </div>

      <!-- 카테고리 -->
      <div class="field-row">
        <label class="field-label">카테고리</label>
        <select
          v-model="form.categoryName"
          class="field-select"
          :class="{
            'field-select--error': errors.categoryName,
            'field-select--expense':
              form.categoryName && form.type === 'expense',
            'field-select--income': form.categoryName && form.type === 'income',
          }"
          @change="clearError('categoryName')"
        >
          <option value="" disabled>선택</option>
          <option v-for="cat in currentCategories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
      <p v-if="errors.categoryName" class="field-error">
        {{ errors.categoryName }}
      </p>

      <!-- 결제수단 (지출만) -->
      <div v-if="form.type === 'expense'" class="field-block">
        <label class="field-label">결제수단</label>
        <div class="chip-group">
          <button
            v-for="method in paymentMethods"
            :key="method"
            type="button"
            class="chip"
            :class="
              form.paymentMethod === method ? 'chip--payment' : 'chip--default'
            "
            @click="form.paymentMethod = method"
          >
            {{ method }}
          </button>
        </div>
      </div>

      <!-- 메모 -->
      <div class="field-row">
        <label class="field-label">메모</label>
        <input
          v-model="form.note"
          type="text"
          class="field-input"
          placeholder="메모 (선택)"
        />
      </div>
    </div>

    <!-- ── 하단 버튼 ── -->
    <div class="form-footer">
      <button class="btn-cancel" @click="$emit('close')">취소</button>
      <button
        class="btn-submit"
        :class="
          form.type === 'expense' ? 'btn-submit--expense' : 'btn-submit--income'
        "
        :disabled="submitting"
        @click="handleSubmit"
      >
        <span v-if="submitting" class="spinner"></span>
        {{ isEdit ? '수정하기' : '등록하기' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore();
const EXCHANGE_RATE = 1500;

const props = defineProps({
  editData: { type: Object, default: null },
  defaultDate: { type: String, default: '' },
});

const emit = defineEmits(['close', 'saved']);

const store = useTransactionStore();
const isEdit = computed(() => !!props.editData);
const submitting = ref(false);
const errors = reactive({ amount: '', memo: '', categoryName: '' });

const expenseCategories = [
  '식비',
  '카페·간식',
  '교통',
  '쇼핑',
  '의료·건강',
  '문화·여가',
  '통신',
  '교육',
  '여행',
  '기타',
];
const incomeCategories = [
  '급여',
  '용돈',
  '부업·프리랜서',
  '투자·배당',
  '환급',
  '기타',
];
const paymentMethods = [
  '신용카드',
  '체크카드',
  '현금',
  '계좌이체',
  '카카오페이',
  '네이버페이',
];

const currentCategories = computed(() =>
  form.type === 'expense' ? expenseCategories : incomeCategories,
);

const initForm = () => {
  if (props.editData) {
    return {
      type: props.editData.type || 'expense',
      amount: props.editData.amount || 0,
      memo: props.editData.memo || '',
      date:
        props.editData.date ||
        props.defaultDate ||
        new Date().toISOString().slice(0, 10),
      categoryName: props.editData.categoryName || '',
      paymentMethod: props.editData.paymentMethod || '신용카드',
      note: props.editData.note || '',
    };
  }
  return {
    type: 'expense',
    amount: 0,
    memo: '',
    date: props.defaultDate || new Date().toISOString().slice(0, 10),
    categoryName: '',
    paymentMethod: '신용카드',
    note: '',
  };
};

const form = reactive(initForm());

watch(
  () => props.editData,
  () => Object.assign(form, initForm()),
);

const setType = (type) => {
  form.type = type;
  const cats = type === 'expense' ? expenseCategories : incomeCategories;
  if (!cats.includes(form.categoryName)) form.categoryName = '';
};

const clearError = (field) => {
  errors[field] = '';
};

const validate = () => {
  let valid = true;
  if (!form.amount || form.amount <= 0) {
    errors.amount = '금액을 입력해주세요.';
    valid = false;
  }
  if (!form.memo.trim()) {
    errors.memo = '내역명을 입력해주세요.';
    valid = false;
  }
  if (!form.categoryName) {
    errors.categoryName = '선택.';
    valid = false;
  }
  return valid;
};

const handleSubmit = async () => {
  if (!validate()) return;

  submitting.value = true;
  try {
    let finalAmount = Number(form.amount);

    if (settingsStore.currency === 'USD') {
      finalAmount = finalAmount * settingsStore.exchangeRate;
    }

    const data = {
      type: form.type,
      amount: finalAmount,
      memo: form.memo.trim(),
      date: form.date,
      categoryName: form.categoryName,
      paymentMethod: form.paymentMethod,
      note: form.note.trim(),
    };
    if (isEdit.value) {
      await store.updateTransaction(props.editData.id, data);
    } else {
      await store.addTransaction(data);
    }
    emit('saved');
  } catch {
    errors.amount = '저장에 실패했습니다. 서버 연결을 확인해주세요.';
  } finally {
    submitting.value = false;
  }
};

const currencySymbol = computed(() => {
  return settingsStore.currency === 'USD' ? '$' : '₩';
});
</script>

<style scoped>
/* ── 카드 ── */
.form-card {
  background: var(--card-bg);
  border-radius: 20px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
  width: 100%;
  max-width: 480px;
  overflow: hidden;
}

/* ── 헤더 ── */
.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0;
}

.form-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.form-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
}

.badge--new {
  background: #dcfce7;
  color: #16a34a;
}

.badge--edit {
  background: #fef9c3;
  color: #a16207;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
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

.close-btn:hover {
  filter: brightness(0.9);
  color: var(--text-secondary);
}

/* ── 타입 탭 ── */
.type-tab {
  display: flex;
  margin: 20px 24px 0;
  background: #f3f4f6;
  border-radius: 10px;
  padding: 4px;
  gap: 4px;
}

.type-btn {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s,
    box-shadow 0.15s;
}

.type-btn--inactive {
  background: transparent;
  color: var(--text-secondary);
}

.type-btn--expense {
  background: var(--card-bg);
  color: var(--color-danger);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.type-btn--income {
  background: var(--card-bg);
  color: #16a34a;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

/* ── 금액 ── */
.amount-section {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 20px 24px 16px;
  border-bottom: 2px solid var(--border-color);
}

.amount-section--expense {
  border-bottom-color: var(--color-danger);
}
.amount-section--income {
  border-bottom-color: var(--color-success);
}

.amount-currency {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-secondary);
}

.amount-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 32px;
  font-weight: 800;
  color: var(--text-primary);
  text-align: right;
  background: transparent;
  letter-spacing: -1px;
}

.amount-input::placeholder {
  color: var(--text-secondary);
}

.amount-input::-webkit-outer-spin-button,
.amount-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.amount-input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.amount-unit {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-secondary);
}

/* ── 폼 본문 ── */
.form-body {
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}

.field-block {
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
  min-width: 52px;
}

.field-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--text-primary);
  background: transparent;
}

.field-input--error {
  color: var(--color-danger);
}

.field-input::placeholder {
  color: #d1d5db;
}

.field-error {
  font-size: 12px;
  color: var(--color-danger);
  margin: 2px 0 6px;
  padding-left: 64px;
}

/* ── 드롭다운 ── */
.field-select {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--text-primary);
  background: transparent;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M7 10l5 5 5-5z' fill='%239ca3af'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 4px center;
  padding-right: 20px;
}

.field-select--error {
  color: var(--color-danger);
}
.field-select--expense {
  color: var(--color-danger);
  font-weight: 600;
}
.field-select--income {
  color: var(--color-success);
  font-weight: 600;
}

/* ── 칩 그룹 (결제수단용) ── */
.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.chip {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12.5px;
  font-weight: 500;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.12s;
}

.chip--default {
  background: var(--card-bg);
  color: var(--text-secondary);
}

.chip--default:hover {
  filter: brightness(0.95);
}

.chip--payment {
  background: #dbeafe;
  border-color: #93c5fd;
  color: #2563eb;
  font-weight: 600;
}

/* ── 하단 버튼 ── */
.form-footer {
  display: flex;
  gap: 10px;
  padding: 16px 24px 24px;
  border-top: 1px solid var(--border-color);
}

.btn-cancel {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--card-bg);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-cancel:hover {
  background: #f9fafb;
}

.btn-submit {
  flex: 2;
  padding: 12px;
  border: none;
  border-radius: 10px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition:
    opacity 0.15s,
    transform 0.1s;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-submit:not(:disabled):hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
.btn-submit--expense {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}
.btn-submit--income {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

html.dark .badge--new {
  background: rgba(22, 163, 74, 0.2);
  color: #4ade80;
}

html.dark .badge--edit {
  background: rgba(161, 98, 7, 0.2);
  color: #facc15;
}

html.dark .chip--default:hover {
  filter: brightness(1.2);
}

html.dark .chip--payment {
  background: rgba(37, 99, 235, 0.2);
  border-color: rgba(37, 99, 235, 0.5);
  color: #60a5fa;
}

html.dark .field-input::placeholder {
  color: #6b7280;
}

html.dark .btn-cancel:hover,
html.dark .close-btn:hover {
  filter: brightness(1.2);
}

html.dark .field-select option {
  background-color: var(--card-bg);
  color: var(--text-primary);
}
</style>
