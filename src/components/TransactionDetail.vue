<template>
    <div class="card" :class="t.type">

        <!-- 상단 -->
        <div class="top">
            <div class="left">
                <span class="icon">{{ getIcon(t.categoryName) }}</span>
                <span class="category"
                    :style="{ background: getCategoryColor(t.categoryName).bg, color: getCategoryColor(t.categoryName).color }">
                    {{ t.categoryName }}
                </span>
            </div>
            <span class="date">{{ t.date }}</span>
        </div>

        <!-- 금액 -->
        <div class="middle">
            <span class="amount" :class="t.type">
                {{ t.type === 'income' ? '+' : '-' }}
                {{ Number(t.amount).toLocaleString() }}원
            </span>
        </div>

        <!-- 메모 -->
        <div class="bottom">
            {{ t.memo }}
        </div>

    </div>
</template>

<script setup>
const props = defineProps({
    t: Object
});

// 🔥 카테고리별 아이콘
const getIcon = (category) => {
    const icons = {
        식사: "🍔",
        교통: "🚌",
        쇼핑: "🛍️",
        수입: "💰",
        고정비: "🏠",
        용돈: "💵"
    };
    return icons[category] || "📌";
};

// 🔥 카테고리별 색상
const getCategoryColor = (category) => {
    const colors = {
        식사: { bg: "#fdecea", color: "#c62828" },
        교통: { bg: "#e3f2fd", color: "#1565c0" },
        쇼핑: { bg: "#fff3e0", color: "#ef6c00" },
        수입: { bg: "#e0f7ec", color: "#2e7d32" },
        고정비: { bg: "#ede7f6", color: "#5e35b1" },
        용돈: { bg: "#e8f5e9", color: "#2e7d32" }
    };
    return colors[category] || { bg: "#eee", color: "#333" };
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
    gap: 10px;
    transition: all 0.2s ease;
}

.card:hover {
    transform: translateY(-4px);
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

/* 아이콘 */
.icon {
    font-size: 18px;
}

/* 카테고리 */
.category {
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: bold;
}

/* 날짜 */
.date {
    font-size: 12px;
    opacity: 0.6;
}

/* 금액 */
.middle {
    font-size: 20px;
    font-weight: bold;
}

/* 🔥 수입 (강조) */
.amount.income {
    color: #1b5e20;
}

/* 🔥 지출 (강조) */
.amount.expense {
    color: #b71c1c;
}

/* 메모 */
.bottom {
    font-size: 13px;
    color: #555;
}

/* 카드 배경 */
.card.income {
    background: linear-gradient(135deg, #e8f5e9, #f1fff5);
}

.card.expense {
    background: linear-gradient(135deg, #fdecea, #fff5f5);
}
</style>