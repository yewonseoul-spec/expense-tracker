<template>
  <div class="form-page">
    <TransactionForm
      :default-date="defaultDate"
      @close="goBack"
      @saved="goBack"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import TransactionForm from '@/components/TransactionForm.vue';

const router = useRouter();
const defaultDate = new Date().toISOString().slice(0, 10);
const goBack = () => router.push('/Home');
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
</style>
