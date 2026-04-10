<template>
    <div class="card" :class="t.type">
        <div class="top">
            <div class="left">
                <!-- 카테고리 아이콘 (달력과 동일) -->
                <span class="icon">{{ icon }}</span>
                <span class="category" :style="{ background: categoryColors.bg, color: categoryColors.color }">
                    {{ t.categoryName }}
                </span>
            </div>
            <span class="date">{{ t.date }}</span>
        </div>

        <div class="middle">
            <span class="amount" :class="t.type">
                {{ t.type === 'income' ? '+' : '-' }}
                {{ Number(t.amount).toLocaleString() }}원
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
const props = defineProps({
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
}

.middle {
    font-size: 20px;
    font-weight: bold;
}

.amount.income {
    color: #1b5e20;
}

.amount.expense {
    color: #b71c1c;
}

.bottom {
    font-size: 13px;
    color: #555;
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