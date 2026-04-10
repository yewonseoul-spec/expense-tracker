<template>
  <div class="login-page">
    <div class="login-card">
      <!-- ── 상단 로고 영역 ── -->
      <div class="login-header">
        <div class="logo-icon">
          <span>W</span>
        </div>
        <h1 class="logo-title">가계부</h1>
        <p class="logo-desc">
          효율적인 지출 관리를 위한<br />
          우리의 가계부에 오신 걸 환영해요
        </p>
      </div>

      <div class="divider" />

      <!-- ── 폼 영역 ── -->
      <div class="login-body">
        <!-- 이메일 -->
        <div class="field-group">
          <label class="field-label">이메일</label>
          <input
            v-model="email"
            type="email"
            class="field-input"
            :class="{ 'field-input--error': errors.email }"
            placeholder="example@email.com"
            @input="errors.email = ''"
          />
          <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
        </div>

        <!-- 비밀번호 -->
        <div class="field-group">
          <label class="field-label">비밀번호</label>
          <div class="password-wrapper">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="field-input"
              :class="{ 'field-input--error': errors.password }"
              placeholder="비밀번호를 입력하세요"
              @input="errors.password = ''"
            />
            <button
              class="eye-btn"
              type="button"
              @click="showPassword = !showPassword"
            >
              <svg
                v-if="!showPassword"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                  fill="currentColor"
                />
              </svg>
              <svg
                v-else
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="field-error">
            {{ errors.password }}
          </p>
        </div>

        <!-- 이메일 저장 / 비밀번호 찾기 -->
        <div class="login-options">
          <label class="remember-label">
            <input
              v-model="rememberEmail"
              type="checkbox"
              class="remember-checkbox"
            />
            <span>이메일 저장</span>
          </label>
        </div>

        <!-- 공통 에러 -->
        <p v-if="errors.general" class="field-error general-error">
          {{ errors.general }}
        </p>

        <!-- 로그인 버튼 -->
        <button class="login-btn" @click="handleLogin">로그인</button>
      </div>

      <div class="divider" />

      <!-- ── 하단 회원가입 ── -->
      <div class="login-footer">
        <span class="signup-text">아직 계정이 없으신가요?</span>
        <RouterLink to="/register" class="signup-link">회원가입</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const email = ref(route.query.email || '');
const password = ref('');
const rememberEmail = ref(false);
const showPassword = ref(false);
const errors = reactive({ email: '', password: '', general: '' });

const handleLogin = async () => {
  errors.email = '';
  errors.password = '';
  errors.general = '';

  if (!email.value.trim()) {
    errors.email = '이메일을 입력해주세요.';
    return;
  }
  if (!password.value) {
    errors.password = '비밀번호를 입력해주세요.';
    return;
  }

  try {
    const res = await axios.get('/api/users', {
      params: { email: email.value, password: password.value },
    });
    if (res.data.length === 0) {
      errors.general = '이메일 또는 비밀번호가 올바르지 않습니다.';
      return;
    }
    const user = res.data[0];
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem(
      'auth',
      JSON.stringify({ id: user.id, name: user.name, email: user.email }),
    );
    userStore.userInfo.id = user.id;
    userStore.userInfo.name = user.name;
    userStore.userInfo.email = user.email;
    router.push('/Home');
  } catch {
    errors.general = '서버 연결에 실패했습니다.';
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f5f6fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.login-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 440px;
  overflow: hidden;
}

/* ── 헤더 ── */
.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 32px 30px;
  gap: 12px;
}

.logo-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.35);
}

.logo-icon span {
  font-size: 24px;
  font-weight: 800;
  color: #ffffff;
}

.logo-title {
  font-size: 22px;
  font-weight: 800;
  color: #111827;
  margin: 0;
  letter-spacing: -0.3px;
}

.logo-desc {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  line-height: 1.6;
  margin: 0;
}

/* ── 구분선 ── */
.divider {
  height: 1px;
  background: #f3f4f6;
}

/* ── 폼 본문 ── */
.login-body {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.field-input {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #111827;
  background: #ffffff;
  outline: none;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  box-sizing: border-box;
}

.field-input:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
}

.field-input::placeholder {
  color: #9ca3af;
}

.field-input--error {
  border-color: #ef4444;
}

.field-error {
  font-size: 12px;
  color: #ef4444;
  margin: 0;
}

.general-error {
  text-align: center;
  padding: 8px 12px;
  background: #fef2f2;
  border-radius: 8px;
  font-size: 13px;
}

/* 비밀번호 래퍼 */
.password-wrapper {
  position: relative;
}

.password-wrapper .field-input {
  padding-right: 44px;
}

.eye-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: color 0.15s;
}

.eye-btn:hover {
  color: #6b7280;
}

/* ── 이메일 저장 / 비밀번호 찾기 ── */
.login-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  user-select: none;
}

.remember-checkbox {
  width: 15px;
  height: 15px;
  accent-color: #16a34a;
  cursor: pointer;
}

.find-password {
  font-size: 13px;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.15s;
}

.find-password:hover {
  color: #16a34a;
}

/* ── 로그인 버튼 ── */
.login-btn {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.35);
  transition:
    opacity 0.15s,
    transform 0.1s;
  margin-top: 4px;
}

.login-btn:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.login-btn:active {
  transform: translateY(0);
}

/* ── 하단 ── */
.login-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 18px 32px 28px;
}

.signup-text {
  font-size: 13.5px;
  color: #6b7280;
}

.signup-link {
  font-size: 13.5px;
  font-weight: 700;
  color: #16a34a;
  text-decoration: none;
  transition: opacity 0.15s;
}

.signup-link:hover {
  opacity: 0.8;
}
</style>
