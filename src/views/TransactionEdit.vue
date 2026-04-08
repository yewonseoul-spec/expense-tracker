<template>
  <div class="form-page">

    <!-- 로딩 -->
    <div v-if="loading" class="status-screen">
      <div class="spinner-lg"></div>
    </div>

    <!-- 없는 거래 -->
    <div v-else-if="!transaction" class="status-screen">
      <p class="status-msg">거래 내역을 찾을 수 없습니다.</p>
      <button class="btn-back" @click="goBack">돌아가기</button>
    </div>

    <!-- 폼 + 삭제 버튼 -->
    <div v-else class="form-wrapper">
      <TransactionForm
        :edit-data="transaction"
        @close="goBack"
        @saved="goBack"
      />
      <button class="btn-delete" @click="confirmDelete">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
        </svg>
        이 거래 삭제
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTransactionStore } from '@/stores/transactionStore';
import TransactionForm from '@/components/TransactionForm.vue';

const route = useRoute();
const router = useRouter();
const store = useTransactionStore();

const transaction = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    await store.fetchData();
    transaction.value = store.transactions.find(
      (t) => String(t.id) === String(route.params.id)
    ) ?? null;
  } catch {
    transaction.value = null;
  } finally {
    loading.value = false;
  }
});

const goBack = () => router.push('/Home');

const confirmDelete = async () => {
  if (!confirm('이 거래를 삭제할까요?')) return;
  try {
    await store.deleteTransaction(transaction.value.id);
    goBack();
  } catch {
    alert('삭제에 실패했습니다. 서버 연결을 확인해주세요.');
  }
};
</script>

<style scoped>
.form-page {
  min-height: calc(100vh - 108px);
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px 100px;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 480px;
}

/* 로딩 / 없음 */
.status-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.status-msg {
  font-size: 14px;
  color: #6b7280;
}

.btn-back {
  padding: 8px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
}

/* 삭제 버튼 */
.btn-delete {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: 1px solid #fca5a5;
  border-radius: 10px;
  background: #fff5f5;
  color: #dc2626;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  width: 100%;
  justify-content: center;
}

.btn-delete:hover {
  background: #fee2e2;
  border-color: #f87171;
}

/* 로딩 스피너 */
.spinner-lg {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
