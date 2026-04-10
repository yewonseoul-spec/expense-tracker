<template>
  <div class="form-page">
    <TransactionForm :default-date="defaultDate" @close="goBack" @saved="goBack" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import TransactionForm from '@/components/TransactionForm.vue';

const router = useRouter();
const defaultDate = new Date().toISOString().slice(0, 10);
const goBack = () => router.back();
</script>

<style scoped>
.form-page {
  position: fixed;
  inset: 0;
  z-index: 800;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 116px 16px 24px;
  overflow-y: auto;
}
</style>
