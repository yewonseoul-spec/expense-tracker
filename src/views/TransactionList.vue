<template>
    <div class="modal" @click.self="closeModal">
        <div class="box">
            <!-- 상단 날짜 표시 -->
            <div class="heading">
                <div class="date-display">
                    <span class="month-day">{{ monthDay }}</span>
                    <span class="year">{{ year }}</span>
                </div>
            </div>

            <!-- 거래 내역 카드 -->
            <TransactionDetail v-for="t in transactionStore.userData" :key="t.id" :t="t"
                :categoryColors="getCategory(t.categoryName)" :icon="getCategoryIcon(t.categoryName)"
                @edit="editTransaction" @delete="deleteTransaction" />

            <!-- 왼쪽 상단 X 버튼 (화면 밖에 붙임) -->
            <button class="close-modal" @click="closeModal">✖️</button>
        </div>
    </div>
</template>

<script setup>
import TransactionDetail from '@/components/TransactionDetail.vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useUserStore } from '@/stores/user';
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const transactionStore = useTransactionStore();
const router = useRouter();
const route = useRoute();
const userId = useUserStore().userInfo.id;

const date = route.params.date;

// TransactionCal.vue와 동일한 카테고리 배열
const categories = [
    { name: '전체', icon: '📊', color: '#455a64' },
    { name: '수입', icon: '💰', color: '#2e7d32' },
    { name: '식비', icon: '🍔', color: '#d32f2f' },
    { name: '카페·간식', icon: '☕', color: '#f57c00' },
    { name: '교통', icon: '🚌', color: '#1976d2' },
    { name: '쇼핑', icon: '🛍️', color: '#8e24aa' },
    { name: '의료·건강', icon: '💊', color: '#009688' },
    { name: '문화·여가', icon: '🎬', color: '#7b1fa2' },
    { name: '통신', icon: '📱', color: '#3949ab' },
    { name: '교육', icon: '📚', color: '#689f38' },
    { name: '여행', icon: '✈️', color: '#0288d1' },
    { name: '기타', icon: '📌', color: '#616161' }
];

onMounted(() => transactionStore.getDate(date, userId));

const closeModal = () => router.push({ name: 'TransactionCal' });

const monthDay = computed(() => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
});
const year = computed(() => {
    if (!date) return '';
    const d = new Date(date);
    return d.getFullYear();
});

// 카테고리 색상
const getCategory = (name) => {
    const c = categories.find(cat => cat.name === name);
    return c ? { bg: '#fff', color: c.color } : { bg: '#eee', color: '#333' };
};

// 달력과 동일한 아이콘
const getCategoryIcon = (name) => {
    const c = categories.find(cat => cat.name === name);
    return c ? c.icon : '📌';
};

const editTransaction = (t) => router.push({ name: 'EditTransaction', params: { id: t.id } });

const deleteTransaction = async (id) => {
    if (confirm('정말 삭제하시겠습니까?')) {
        await transactionStore.deleteTransaction(id);
        await transactionStore.getDate(date, userId);
        await transactionStore.getMonth(new Date(date), userId);
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
    top: 120px;
    width: 500px;
    min-height: 900px;
    padding: 10px;
    border-radius: 10px;
    overflow-y: auto;
}

.heading {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #33a17f;
    color: white;
    padding: 6px 10px;
    border-radius: 6px;
    margin-bottom: 10px;
}

.date-display {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.month-day {
    font-size: 16px;
    /* 기존보다 약간 키움 */
    font-weight: bold;
}

.year {
    font-size: 13px;
    /* 기존보다 약간 키움 */
    opacity: 0.8;
}

/* 왼쪽 상단 X 버튼 */
.close-modal {
    position: fixed;
    top: 10px;
    left: 10px;
    background: #9e9e9e;
    /* 연한 회색 */
    color: white;
    border: none;
    border-radius: 6px;
    width: 32px;
    height: 32px;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 100;
}

.close-modal:hover {
    opacity: 0.85;
}
</style>