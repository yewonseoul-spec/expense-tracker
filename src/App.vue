<template>
  <div id="app">
    <Header v-if="route.name !== 'Login' && route.name !== 'Register'" />
    <!-- 이전 페이지 배경: 새 거래 추가 오버레이 시 -->
    <div v-if="bgComponent" class="cal-background">
      <component :is="bgComponent" />
    </div>

    <main
      class="main-content"
      :class="{ 'main-content--full': route.name === 'Login' }"
    >
      <RouterView />
    </main>

    <!-- ── 하단 고정: 거래 추가 버튼 ── -->
    <RouterLink
      v-if="
        route.name !== 'TransactionAdd' &&
        route.name !== 'Login' &&
        route.name !== 'Register' &&
        !route.path.startsWith('/settings')
      "
      to="/transaction/add"
      class="fab"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
      </svg>
      <span>새 거래 추가</span>
    </RouterLink>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/Header.vue';
import TransactionCal from './views/TransactionCal.vue';
import Home from './views/Home.vue';
import { useSettingsStore } from '@/stores/settings';

const route = useRoute();

const settingsStore = useSettingsStore();

watch(
  () => settingsStore.isDarkMode,
  () => {
    updateTheme();
  },
);

watch(
  () => route.path,
  () => {
    updateTheme();
  },
);

const backgroundRouteMap = {
  TransactionCal,
  Home,
};

const prevRouteName = ref(null);
watch(
  () => route.name,
  (newName, oldName) => {
    if (newName === 'TransactionAdd') {
      prevRouteName.value = oldName;
    }
  },
);

const bgComponent = computed(() =>
  route.name === 'TransactionAdd'
    ? (backgroundRouteMap[prevRouteName.value] ?? null)
    : null,
);

// 다크모드 클래스를 <html>에 적용
const updateTheme = () => {
  const isSettingsPage = route.path.startsWith('/settings');

  if (isSettingsPage) {
    document.documentElement.classList.remove('dark');
    return;
  }

  if (settingsStore.isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

onMounted(() => {
  updateTheme(settingsStore.isDarkMode);
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-color);
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-bottom: 96px;
}

.main-content--full {
  padding-bottom: 0;
}

/* ── 캘린더 배경 (새 거래 추가 오버레이 시) ── */
.cal-background {
  pointer-events: none;
  user-select: none;
  overflow: hidden;
}

/* ── 하단 고정 버튼 (FAB) ── */
.fab {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 900;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  border-radius: 50px;
  text-decoration: none;
  box-shadow:
    0 4px 20px rgba(34, 197, 94, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    opacity 0.15s;
  white-space: nowrap;
  letter-spacing: -0.2px;
}

.fab:hover {
  transform: translateX(-50%) translateY(-2px);
  box-shadow:
    0 8px 28px rgba(34, 197, 94, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.12);
  color: #ffffff;
}

html.dark .fab {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);

  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.4);
}

html.dark .fab:hover {
  background: linear-gradient(135deg, #15803d 0%, #14532d 100%);
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.6),
    0 4px 12px rgba(0, 0, 0, 0.5);
}

.fab:active {
  transform: translateX(-50%) translateY(0);
}

@media (max-width: 480px) {
  .fab {
    bottom: 20px;
    padding: 13px 22px;
    font-size: 14px;
  }
}
</style>
