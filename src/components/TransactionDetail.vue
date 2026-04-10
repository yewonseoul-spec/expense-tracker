<template>
    <div class="card" :class="t.type">
        <!-- 상단: 아이콘 + 카테고리 + 날짜 -->
        <div class="top">
            <div class="left">
                <span class="icon">{{ icon }}</span>
                <span class="category" :style="{ background: categoryColors.bg, color: categoryColors.color }">
                    {{ t.categoryName }}
                </span>
            </div>
            <span class="date">{{ formatDate(t.date) }}</span>
        </div>

        <!-- 메모 + 결제수단 (금액 바로 위) -->
        <div class="info">
            <div v-if="t.payment" class="payment">💳 {{ t.payment }}</div>
            <div v-if="t.memo" class="memo">📝 {{ t.memo }}</div>
        </div>

        <!-- 내역 제목 -->
        <div class="title">{{ t.title || '제목 없음' }}</div>

        <!-- 금액 -->
        <div class="amount" :class="t.type">
            {{ t.type === 'income' ? '+' : '-' }}{{ Number(t.amount).toLocaleString() }}원
        </div>

        <!-- 수정/삭제 버튼 -->
        <div class="actions">
            <button @click="$emit('edit', t)">수정</button>
            <button @click="$emit('delete', t.id)">삭제</button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    t: Object,
    categoryColors: Object,
    icon: String
});

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${d.getFullYear()})`;
};
</script>

<style scoped>
.card {
    border-radius: 14px;
    padding: 16px;
    margin: 12px 0;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 8px;
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

.icon {
    font-size: 18px;
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
}

.info {
    display: flex;
    flex-direction: row;
    gap: 12px;
    font-size: 12px;
    color: #555;
}

.payment {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #555;
}

.memo {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #777;
}

.title {
    font-size: 18px;
    font-weight: 700;
    margin-top: 4px;
}

.amount {
    font-size: 20px;
    font-weight: bold;
    margin-top: 2px;
}

.amount.income {
    color: #1b5e20;
}

.amount.expense {
    color: #b71c1c;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 6px;
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
    background-color: #0288d1;
    color: white;
}

.actions button:last-child {
    background-color: #d32f2f;
    color: white;
}

.card.income {
    background: linear-gradient(135deg, #e8f5e9, #f1fff5);
}

.card.expense {
    background: linear-gradient(135deg, #fdecea, #fff5f5);
}
</style>