<template>
    <div class="modal" @click.self="closeModal">
        <div class="box">
            <div class="heading">
                <span class="date-header">{{ formattedDate }} 거래 내역</span>
                <button class="close-btn" @click="closeModal">✕</button>
            </div>

            <TransactionDetail v-for="t in transactionStore.userData" :key="t.id" :t="t"
                :categoryColors="getCategory(t.categoryName)" :icon="getCategoryIcon(t.categoryName)"
                @edit="editTransaction" @delete="deleteTransaction" />
        </div>
    </div>
</template>

<script setup>
import TransactionDetail from '@/components/TransactionDetail.vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const transactionStore = useTransactionStore();
const router = useRouter();
const route = useRoute();

const date = route.params.date;

// 임시 카테고리 정의 (TransactionCal.vue와 동일)
const categories = [
    { name: '수입', icon: '💰', bg: '#e8f5e9', color: '#2e7d32' },
    { name: '식비', icon: '🍔', bg: '#fdecea', color: '#c62828' },
    { name: '카페·간식', icon: '☕', bg: '#fff3e0', color: '#ef6c00' },
    { name: '교통', icon: '🚌', bg: '#e3f2fd', color: '#1565c0' },
    { name: '쇼핑', icon: '🛍️', bg: '#f3e5f5', color: '#6a1b9a' },
    { name: '의료·건강', icon: '💊', bg: '#e0f2f1', color: '#00695c' },
    { name: '문화·여가', icon: '🎬', bg: '#ede7f6', color: '#4527a0' },
    { name: '통신', icon: '📱', bg: '#e8eaf6', color: '#283593' },
    { name: '교육', icon: '📚', bg: '#e8f5e9', color: '#2e7d32' },
    { name: '여행', icon: '✈️', bg: '#e1f5fe', color: '#0277bd' },
    { name: '기타', icon: '📌', bg: '#eceff1', color: '#37474f' }
];

onMounted(() => transactionStore.getDate(date, '1'));

// 모달 닫기
const closeModal = () => router.push({ name: 'TransactionCal' });

// 카테고리 색상
const getCategory = (name) => {
    const c = categories.find(cat => cat.name === name);
    return c ? { bg: c.bg, color: c.color } : { bg: '#eee', color: '#333' };
};

// 카테고리 아이콘
const getCategoryIcon = (name) => {
    const c = categories.find(cat => cat.name === name);
    return c ? c.icon : '📌';
};

// 날짜 표시
const formattedDate = computed(() => {
    const d = new Date(date);
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${d.getFullYear()})`;
});

// 수정
const editTransaction = (t) => router.push({ name: 'EditTransaction', params: { id: t.id } });

// 삭제 후 갱신
const deleteTransaction = async (id) => {
    if (confirm('정말 삭제하시겠습니까?')) {
        await transactionStore.deleteTransaction(id);
        await transactionStore.getDate(date, '1');
    }
};
</script>

<style scoped>
.modal {
    display: block;
    position: fixed;
    z-index: 1;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
}

.box {
    background-color: white;
    position: absolute;
    right: 0;
    top: 100px;
    width: 500px;
    min-height: 900px;
    padding: 10px;
    border-radius: 10px;
    overflow-y: auto;
}

.heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #33a17f;
    color: white;
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 16px;
}

.close-btn {
    background: #ccc;
    border: none;
    border-radius: 6px;
    width: 28px;
    height: 28px;
    font-size: 16px;
    cursor: pointer;
    color: #333;
    line-height: 28px;
    text-align: center;
}
</style>