<script setup>
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const isEditing = ref(false);
const fileInputRef = ref(null);
const formData = ref({ ...userStore.userInfo });

const isLoading = ref(true);

const showPasswordModal = ref(false);
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});
const passwordError = ref('');

watch(
  () => userStore.userInfo,
  (newVal) => {
    formData.value = { ...newVal };
  },
  { deep: true },
);

onMounted(async () => {
  isLoading.value = true;
  await userStore.fetchUserInfo();
  isLoading.value = false;
});

// --- 로직 (Functions) ---

const triggerImageUpload = () => {
  fileInputRef.value.click();
};

// 이미지 파일 선택 완료 시 호출되는 함수
const onImageSelected = (event) => {
  const file = event.target.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_SIZE = 100;
      canvas.width = MAX_SIZE;
      canvas.height = MAX_SIZE;

      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0, MAX_SIZE, MAX_SIZE);

      const resizedBase64 = canvas.toDataURL('image/jpeg', 0.7);

      userStore.updateProfileImage(resizedBase64);
    };
  };
};

// 편집 모드 전환 & 취소 함수
const toggleEditMode = () => {
  if (isEditing.value) {
    formData.value = { ...userStore.userInfo }; // 취소 시 DB 원본 복구
  }
  isEditing.value = !isEditing.value;
};

// '저장' 버튼 클릭 시 호출되는 함수
const saveProfile = async () => {
  const payload = {
    name: formData.value.name,
    nickname: formData.value.nickname,
    gender: formData.value.gender,
    email: formData.value.email,
    timezone: formData.value.timezone,
  };

  const isSuccess = await userStore.saveProfileToDB(payload);

  if (isSuccess) {
    isEditing.value = false;
    alert('프로필 정보가 성공적으로 저장되었습니다.');
  } else {
    alert('정보 저장에 실패했습니다. 다시 시도해 주세요.');
  }
};

const openPasswordModal = () => {
  passwordError.value = '';
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  showPasswordModal.value = true;
};

const closePasswordModal = () => {
  showPasswordModal.value = false;
};

// 비밀번호 변경 요청
const updatePassword = async () => {
  passwordError.value = '';

  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
    passwordError.value = '모든 필드를 입력해주세요.';
    return;
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = '새 비밀번호가 일치하지 않습니다.';
    return;
  }
  if (passwordForm.value.currentPassword === passwordForm.value.newPassword) {
    passwordError.value =
      '새 비밀번호는 현재 비밀번호와 다르게 설정해야 합니다.';
    return;
  }
  const result = await userStore.changePassword(
    passwordForm.value.currentPassword,
    passwordForm.value.newPassword,
  );

  if (result.success) {
    alert('비밀번호가 성공적으로 변경되었습니다.');
    closePasswordModal();
  } else {
    passwordError.value = result.message;
  }
};
</script>

<template>
  <div class="user-profile">
    <div class="profile-banner"></div>

    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>프로필 정보를 불러오는 중</p>
    </div>

    <div v-else class="profile-content">
      <div class="profile-header">
        <div class="profile-info">
          <div class="profile-pic-container" @click="triggerImageUpload">
            <img
              :src="userStore.profileImage"
              alt="프로필 사진"
              class="profile-pic"
            />
            <div class="upload-overlay">사진 업로드</div>
          </div>

          <input
            type="file"
            ref="fileInputRef"
            style="display: none"
            accept="image/*"
            @change="onImageSelected"
          />

          <div class="user-details">
            <h2 class="name">
              {{ formData.nickname || userStore.userInfo.name || '유저' }}
            </h2>
            <p class="email">
              {{ formData.email || userStore.userInfo.email }}
            </p>
          </div>
        </div>
        <button v-if="!isEditing" class="edit-btn" @click="toggleEditMode">
          편집
        </button>
        <button v-else class="edit-btn" @click="saveProfile">저장</button>
      </div>

      <form class="profile-form" @submit.prevent>
        <div class="form-group">
          <label>이름</label>
          <input
            type="text"
            v-model="formData.name"
            :disabled="!isEditing"
            placeholder="이름을 입력해주세요."
          />
        </div>

        <div class="form-group">
          <label>닉네임</label>
          <input
            type="text"
            v-model="formData.nickname"
            :disabled="!isEditing"
            placeholder="닉네임을 입력해주세요."
          />
        </div>

        <div class="form-group">
          <label>성별</label>
          <div class="select-wrapper">
            <select v-model="formData.gender" :disabled="!isEditing">
              <option>남성</option>
              <option>여성</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>이메일</label>
          <input
            type="email"
            v-model="formData.email"
            disabled
            placeholder="example@gmail.com"
          />
        </div>

        <div class="form-group">
          <label>Time Zone</label>
          <div class="select-wrapper">
            <select v-model="formData.timezone" :disabled="!isEditing">
              <option>KST / UTC+09:00</option>
              <option>PST / UTC-08:00</option>
              <option>GST / UTC+04:00</option>
            </select>
          </div>
        </div>
        <br />
        <div class="form-group">
          <label>비밀번호</label>
          <button
            type="button"
            class="btn-change-password"
            @click="openPasswordModal"
          >
            비밀번호 변경하기
          </button>
        </div>
      </form>
      <div
        v-if="showPasswordModal"
        class="modal-overlay"
        @click.self="closePasswordModal"
      >
        <div class="modal-content">
          <h3>비밀번호 변경</h3>

          <div class="modal-form-group">
            <label>현재 비밀번호</label>
            <input
              type="password"
              v-model="passwordForm.currentPassword"
              placeholder="현재 비밀번호 입력"
            />
          </div>

          <div class="modal-form-group">
            <label>새 비밀번호</label>
            <input
              type="password"
              v-model="passwordForm.newPassword"
              placeholder="새 비밀번호 입력"
            />
          </div>

          <div class="modal-form-group">
            <label>새 비밀번호 확인</label>
            <input
              type="password"
              v-model="passwordForm.confirmPassword"
              placeholder="새 비밀번호 다시 입력"
            />
          </div>

          <p v-if="passwordError" class="error-msg">{{ passwordError }}</p>

          <div class="modal-actions">
            <button class="btn-cancel" @click="closePasswordModal">취소</button>
            <button class="btn-save" @click="updatePassword">변경하기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 전체 카드 컨테이너 */
.user-profile {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
}

/* 상단 그라데이션 배너 */
.profile-banner {
  width: 100%;
  height: 100px;
  background: linear-gradient(90deg, #d2e4f6 0%, #fef3d5 100%);
  flex-shrink: 0;
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: var(--text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--color-info);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 프로필 본문 영역 */
.profile-content {
  padding: 0 40px 40px 40px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

/* 프로필 헤더 (가로 정렬) */
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -50px;
  margin-bottom: 40px;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-pic-container {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  margin-right: 20px;
  background-color: #f0f0f0;
}

.profile-pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.user-details {
  margin-top: 50px;
}

.user-details .name {
  font-size: 20px;
  font-weight: 600;
  color: #1e1e1e;
  margin: 0 0 4px 0;
}

.user-details .email {
  font-size: 14px;
  color: #888888;
  margin: 0;
}

/* 편집 버튼 */
.edit-btn {
  margin-top: 50px;
  background: #4182f9;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 28px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.edit-btn:hover {
  background: #2b6ce6;
}

/* 폼 그리드 레이아웃 */
.profile-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px 40px;
  width: 100%;
}

/* 개별 폼 요소 */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group label {
  font-size: 14px;
  color: #3e435d;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  height: 52px;
  padding: 0 20px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
  color: #333333;
  outline: none;
  transition: background 0.2s ease;
}

.form-group input:disabled,
.form-group select:disabled {
  background: #fafafa;
  color: #999999;
  cursor: not-allowed;
}

.form-group input::placeholder {
  color: #ada7a7;
}

.form-group input:focus,
.form-group select:focus {
  background: #ebebeb;
}

/* Select 화살표 커스텀 */
.select-wrapper {
  position: relative;
  width: 100%;
}

.select-wrapper select {
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.select-wrapper::after {
  content: '∨';
  font-size: 14px;
  color: #888888;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

/* 모바일 반응형 처리 (화면이 768px보다 좁아질 때) */
@media (max-width: 768px) {
  .profile-content {
    padding: 0 20px 32px 20px;
  }

  .profile-header {
    flex-direction: column;
    align-items: center;
    margin-top: -50px;
    margin-bottom: 32px;
  }

  .user-details {
    margin-top: 16px;
    text-align: center;
  }

  .edit-btn {
    margin-top: 16px;
    width: 100%;
  }

  .profile-form {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

.btn-change-password {
  height: 52px;
  background: #f0f4f8;
  color: #3e435d;
  border: 1px solid #d2e4f6;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  padding: 0 20px;
}
.btn-change-password:hover {
  background: #e2e8f0;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 400px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #1e1e1e;
  font-size: 18px;
}

.modal-form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.modal-form-group label {
  font-size: 13px;
  color: #666;
}

.modal-form-group input {
  height: 44px;
  padding: 0 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.error-msg {
  color: #e53e3e;
  font-size: 13px;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel {
  padding: 10px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-save {
  padding: 10px 16px;
  background: #4182f9;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
