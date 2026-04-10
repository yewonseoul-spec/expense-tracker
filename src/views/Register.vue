<template>
  <div class="register-page">
    <div class="register-card">
      <!-- ── 상단 로고 영역 ── -->
      <div class="register-header">
        <div class="logo-row">
          <div class="logo-icon"><span>W</span></div>
          <h1 class="logo-title">가계부</h1>
        </div>
        <p class="register-subtitle">회원가입</p>
        <p class="register-desc">계정을 만들고 가계부를 시작해보세요</p>
      </div>

      <div class="divider" />

      <!-- ── 폼 영역 ── -->
      <div class="register-body">
        <!-- 이름 -->
        <div class="field-group">
          <label class="field-label">이름</label>
          <input
            v-model="name"
            type="text"
            class="field-input"
            :class="{ 'field-input--error': errors.name }"
            placeholder="이름을 입력해주세요"
            @input="errors.name = ''"
          />
          <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
        </div>

        <!-- 닉네임 -->
        <div class="field-group">
          <label class="field-label">닉네임</label>
          <input
            v-model="nickname"
            type="text"
            class="field-input"
            :class="{ 'field-input--error': errors.nickname }"
            placeholder="닉네임을 입력해주세요"
            @input="errors.nickname = ''"
          />
          <p v-if="errors.nickname" class="field-error">
            {{ errors.nickname }}
          </p>
        </div>

        <!-- 성별 -->
        <div class="field-group">
          <label class="field-label">성별</label>
          <div class="gender-group">
            <button
              type="button"
              class="gender-btn"
              :class="{ 'gender-btn--active': gender === '남성' }"
              @click="
                gender = '남성';
                errors.gender = '';
              "
            >
              남성
            </button>
            <button
              type="button"
              class="gender-btn"
              :class="{ 'gender-btn--active': gender === '여성' }"
              @click="
                gender = '여성';
                errors.gender = '';
              "
            >
              여성
            </button>
          </div>
          <p v-if="errors.gender" class="field-error">{{ errors.gender }}</p>
        </div>

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
              placeholder="8자 이상, 영문+숫자 조합"
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

        <!-- 비밀번호 확인 -->
        <div class="field-group">
          <label class="field-label">비밀번호 확인</label>
          <div class="password-wrapper">
            <input
              v-model="passwordConfirm"
              :type="showPasswordConfirm ? 'text' : 'password'"
              class="field-input"
              :class="{ 'field-input--error': errors.passwordConfirm }"
              placeholder="비밀번호를 다시 입력하세요"
              @input="errors.passwordConfirm = ''"
            />
            <button
              class="eye-btn"
              type="button"
              @click="showPasswordConfirm = !showPasswordConfirm"
            >
              <svg
                v-if="!showPasswordConfirm"
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
          <p v-if="errors.passwordConfirm" class="field-error">
            {{ errors.passwordConfirm }}
          </p>
        </div>

        <!-- 가입하기 버튼 -->
        <button class="register-btn" @click="handleRegister">가입하기</button>
      </div>

      <div class="divider" />

      <!-- ── 하단 로그인 링크 ── -->
      <div class="register-footer">
        <span class="login-text">이미 계정이 있으신가요?</span>
        <RouterLink to="/login" class="login-link">로그인</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const name = ref('');
const nickname = ref('');
const gender = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const errors = reactive({
  name: '',
  nickname: '',
  gender: '',
  email: '',
  password: '',
  passwordConfirm: '',
});

const validate = () => {
  let valid = true;
  if (!name.value.trim()) {
    errors.name = '이름을 입력해주세요.';
    valid = false;
  }
  if (!nickname.value.trim()) {
    errors.nickname = '닉네임을 입력해주세요.';
    valid = false;
  }
  if (!gender.value) {
    errors.gender = '성별을 선택해주세요.';
    valid = false;
  }
  if (!email.value.trim()) {
    errors.email = '이메일을 입력해주세요.';
    valid = false;
  }
  if (
    password.value.length < 8 ||
    !/[a-zA-Z]/.test(password.value) ||
    !/[0-9]/.test(password.value)
  ) {
    errors.password = '8자 이상, 영문+숫자를 포함해야 합니다.';
    valid = false;
  }
  if (password.value !== passwordConfirm.value) {
    errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    valid = false;
  }
  return valid;
};

const handleRegister = async () => {
  if (!validate()) return;
  try {
    const existing = await axios.get('/api/users', {
      params: { email: email.value },
    });
    if (existing.data.length > 0) {
      errors.email = '이미 사용 중인 이메일입니다.';
      return;
    }
    await axios.post('/api/users', {
      name: name.value,
      nickname: nickname.value,
      gender: gender.value,
      email: email.value,
      password: password.value,
    });
    router.push({ name: 'Login', query: { email: email.value } });
  } catch {
    errors.email = '서버 연결에 실패했습니다.';
  }
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: #f5f6fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.register-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 440px;
  overflow: hidden;
}

.register-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 32px 24px;
  gap: 8px;
}

.logo-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.logo-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.35);
}

.logo-icon span {
  font-size: 18px;
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

.register-subtitle {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.register-desc {
  font-size: 13.5px;
  color: #6b7280;
  margin: 0;
}

.divider {
  height: 1px;
  background: #f3f4f6;
}

.register-body {
  padding: 22px 32px 26px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
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

.gender-group {
  display: flex;
  gap: 8px;
}

.gender-btn {
  flex: 1;
  padding: 10px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s,
    color 0.15s;
}

.gender-btn--active {
  border-color: #22c55e;
  background: #f0fdf4;
  color: #16a34a;
  font-weight: 700;
}

.register-btn {
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

.register-btn:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.register-btn:active {
  transform: translateY(0);
}

.register-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 18px 32px 28px;
}

.login-text {
  font-size: 13.5px;
  color: #6b7280;
}

.login-link {
  font-size: 13.5px;
  font-weight: 700;
  color: #16a34a;
  text-decoration: none;
  transition: opacity 0.15s;
}

.login-link:hover {
  opacity: 0.8;
}
</style>
