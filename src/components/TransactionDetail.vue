<template>
    <div class="card" :class="t.type">
        <!-- 상단 -->
        <div class="top">
            <div class="left">
                <span class="icon">{{ icon }}</span>
                <span class="category" :style="{ background: categoryColors.bg, color: categoryColors.color }">
                    {{ t.categoryName }}
                </span>
            </div>
        </div>

        <!-- 제목 (메모 우선) -->
        <div class="title">
            {{ t.memo || t.title || '제목 없음' }}
        </div>

        <!-- 금액 -->
        <div class="amount" :class="t.type">
            {{ t.type === 'income' ? '+' : '-' }}
            {{ Number(t.amount).toLocaleString() }}원
        </div>

        <!-- 결제수단 -->
        <div v-if="t.paymentMethod" class="payment">
            💳 {{ t.paymentMethod }}
        </div>

        <!-- 메모 (있을 때만) -->
        <div v-if="t.note" class="memo">
            {{ t.note }}
        </div>

        <!-- 버튼 -->
        <div class="actions">
            <button @click="$emit('edit', t)">수정</button>
            <button @click="$emit('delete', t.id)">삭제</button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    t: Object,
    categoryColors: Object,
    icon: String
});
</script>

<style scoped>
.card {
    border-radius: 14px;
    padding: 16px;
    margin: 12px 0;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: 0.2s;
}

/* 🔥 수입 / 지출 배경 */
.card.income {
    background: linear-gradient(135deg, #e8f5e9, #f1fff5);
}

.card.expense {
    background: linear-gradient(135deg, #fdecea, #fff5f5);
}

/* hover */
.card:hover {
    transform: translateY(-3px);
}

/* 상단 */
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

/* 제목 */
.title {
    font-size: 18px;
    font-weight: 800;
    color: #111;
}

/* 금액 */
.amount {
    font-size: 20px;
    font-weight: bold;
}

.amount.income {
    color: #1b5e20;
}

.amount.expense {
    color: #b71c1c;
}

/* 메모 */
.memo {
    font-size: 13px;
    color: #555;
}

/* 결제수단 */
.payment {
    font-size: 12px;
    color: #777;
}

/* 버튼 */
.actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 6px;
}

.actions button {
    border: none;
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 6px;
    cursor: pointer;
}

.actions button:first-child {
    background: #0288d1;
    color: white;
}

.actions button:last-child {
    background: #d32f2f;
    color: white;
}
</style>