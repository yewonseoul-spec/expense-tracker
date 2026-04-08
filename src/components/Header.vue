<template>
    <header class="app-header">
        <div class="header-inner">
            <!-- ── 앱 타이틀 ── -->
            <RouterLink to="/Home" class="brand">
                <div class="brand-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect width="24" height="24" rx="6" fill="transparent" />
                        <text x="12" y="17" text-anchor="middle" font-size="14" fill="white" font-weight="800">
                            ₩
                        </text>
                    </svg>
                </div>
                <span class="brand-name">가계부</span>
            </RouterLink>

            <!-- ──날짜 선택기 ── -->
            <div class="date-selector">
                <button class="arrow-btn" @click="store.prevMonth()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor" />
                    </svg>
                </button>

                <button class="date-label" @click="store.goToday()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"
                            fill="currentColor" />
                    </svg>
                    <span>{{ store.currentYear }}년 {{ store.currentMonth }}월</span>
                </button>

                <button class="arrow-btn" @click="store.nextMonth()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor" />
                    </svg>
                </button>
            </div>

            <!-- ── 우측: 설정 + 프로필 ── -->
            <div class="header-actions">
                <RouterLink to="/settings" class="icon-btn" title="설정">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
                            fill="currentColor" />
                    </svg>
                </RouterLink>

                <RouterLink to="/settings" class="avatar-btn" title="프로필">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                            fill="currentColor" />
                    </svg>
                </RouterLink>
            </div>
        </div>

        <!-- ── 네비게이션 탭 ── -->
        <nav class="header-nav">
            <div class="nav-inner">
                <RouterLink to="/Home" class="nav-tab" :class="{ 'nav-tab--active': route.path === '/Home' }">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
                    </svg>
                    홈
                </RouterLink>

                <RouterLink to="/dashboard" class="nav-tab" :class="{ 'nav-tab--active': route.path === '/dashboard' }">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor" />
                    </svg>
                    대시보드
                </RouterLink>

                <RouterLink to="/transaction" class="nav-tab"
                    :class="{ 'nav-tab--active': route.path.startsWith('/transaction') }">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"
                            fill="currentColor" />
                    </svg>
                    거래내역
                </RouterLink>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTransactionStore } from '@/stores/transactionStore';

const route = useRoute();
const store = useTransactionStore();

const now = new Date();
const isCurrentMonth = computed(
    () =>
        store.currentYear === now.getFullYear() &&
        store.currentMonth === now.getMonth() + 1,
);
</script>

<style scoped>
/* ── 헤더 기본 ── */
.app-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #ffffff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
}

/* ── 2행: 탭 네비 ── */
.header-nav {
    border-top: 1px solid #f0f2f5;
}

.nav-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
}

.nav-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 18px;
    font-size: 13.5px;
    font-weight: 500;
    color: #9ca3af;
    text-decoration: none;
    border-bottom: 2px solid transparent;
    transition:
        color 0.15s,
        border-color 0.15s;
    white-space: nowrap;
}

.nav-tab:hover {
    color: #374151;
}

.nav-tab--active {
    color: #16a34a;
    font-weight: 600;
    border-bottom-color: #22c55e;
}

.header-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

/* ── 브랜드 ── */
.brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;
}

.brand-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 2px 8px rgba(34, 197, 94, 0.35);
}

.brand-name {
    font-size: 17px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.3px;
}

/* ── 날짜 선택기 ── */
.date-selector {
    display: flex;
    align-items: center;
    gap: 4px;
    background: #f8fafb;
    border: 1px solid #e8ecf0;
    border-radius: 12px;
    padding: 4px;
}

.arrow-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
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

.arrow-btn:hover {
    background: #e9f7ef;
    color: #16a34a;
}

.date-label {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 6px 14px;
    border: none;
    background: #ffffff;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 700;
    color: #111827;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    transition: background 0.15s;
    letter-spacing: -0.2px;
    white-space: nowrap;
}

.date-label svg {
    color: #16a34a;
    flex-shrink: 0;
}

.date-label:hover {
    background: #f0fdf4;
}

.today-badge {
    font-size: 10px;
    font-weight: 600;
    color: #16a34a;
    background: #dcfce7;
    padding: 2px 7px;
    border-radius: 20px;
    letter-spacing: 0;
}

/* ── 우측 액션 ── */
.header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.icon-btn {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    text-decoration: none;
    transition:
        background 0.15s,
        border-color 0.15s,
        color 0.15s;
}

.icon-btn:hover {
    background: #f0fdf4;
    border-color: #86efac;
    color: #16a34a;
}

.avatar-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-decoration: none;
    box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
    transition:
        opacity 0.15s,
        transform 0.1s;
}

.avatar-btn:hover {
    opacity: 0.9;
    transform: scale(1.05);
}

@media (max-width: 640px) {
    .header-inner {
        padding: 0 16px;
    }

    .brand-name {
        display: none;
    }

    .date-label span:first-of-type {
        font-size: 14px;
    }

    .nav-inner {
        padding: 0 8px;
    }

    .nav-tab {
        padding: 10px 12px;
        font-size: 13px;
        gap: 4px;
    }
}

@media (max-width: 400px) {
    .today-badge {
        display: none;
    }
}
</style>
