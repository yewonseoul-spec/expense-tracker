<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const isEditing = ref(false);
const fileInputRef = ref(null);
const formData = ref({ ...userStore.userInfo });

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

    <div class="profile-content">
      <div class="profile-header">
        <div class="profile-info">
          <div class="profile-pic-container" @click="triggerImageUpload">
            <img
              :src="userStore.profileImage"
              alt="프로필 사진"
              class="profile-pic"
            />
            <div class="edit-badge">
              <svg viewBox="0 0 1024 1024">
                <path
                  d="M327.3 261.6h-99.7c-35.8 0-65.1-29.3-65.1-65.1s29.3-65.1 65.1-65.1h99.7c35.8 0 65.1 29.3 65.1 65.1s-29.3 65.1-65.1 65.1z"
                  fill="#FAFCFB"
                />
                <path
                  d="M327.3 274.6h-99.7c-43.1 0-78.1-35-78.1-78.1s35-78.1 78.1-78.1h99.7c43.1 0 78.1 35 78.1 78.1s-35 78.1-78.1 78.1z m-99.7-130.2c-28.7 0-52.1 23.4-52.1 52.1s23.4 52.1 52.1 52.1h99.7c28.7 0 52.1-23.4 52.1-52.1s-23.4-52.1-52.1-52.1h-99.7z"
                  fill="#0F0F0F"
                />
                <path
                  d="M908.8 900.8H117.2c-46.9 0-84.8-38-84.8-84.8V279.4c0-46.9 38-84.8 84.8-84.8h791.6c46.9 0 84.8 38 84.8 84.8V816c0 46.8-37.9 84.8-84.8 84.8z"
                  fill="#FAFCFB"
                />
                <path
                  d="M908.8 913.8H117.2c-53.9 0-97.8-43.9-97.8-97.8V279.4c0-53.9 43.9-97.8 97.8-97.8h791.6c53.9 0 97.8 43.9 97.8 97.8V816c0 53.9-43.9 97.8-97.8 97.8zM117.2 207.5c-39.6 0-71.8 32.2-71.8 71.8V816c0 39.6 32.2 71.8 71.8 71.8h791.6c39.6 0 71.8-32.2 71.8-71.8V279.4c0-39.6-32.2-71.8-71.8-71.8H117.2z"
                  fill="#0F0F0F"
                />
                <path d="M30.7 468.4H992v277.5H30.7z" fill="#9DC6AF" />
                <path
                  d="M1005 759H17.7V455.4H1005V759zM43.7 733H979V481.4H43.7V733z"
                  fill="#191919"
                />
                <path
                  d="M511.3 604m-212.3 0a212.3 212.3 0 1 0 424.6 0 212.3 212.3 0 1 0-424.6 0Z"
                  fill="#FAFCFB"
                />
                <path
                  d="M511.3 829.3c-60.2 0-116.8-23.4-159.3-66-42.6-42.6-66-99.1-66-159.3s23.4-116.8 66-159.3c42.6-42.6 99.1-66 159.3-66 60.2 0 116.8 23.4 159.3 66 42.6 42.6 66 99.1 66 159.3s-23.4 116.8-66 159.3c-42.5 42.6-99.1 66-159.3 66z m0-424.6C401.4 404.7 312 494.1 312 604s89.4 199.3 199.3 199.3S710.6 713.9 710.6 604s-89.4-199.3-199.3-199.3z"
                  fill="#0F0F0F"
                />
                <path
                  d="M511.3 604m-141.9 0a141.9 141.9 0 1 0 283.8 0 141.9 141.9 0 1 0-283.8 0Z"
                  fill="#D39E33"
                />
                <path
                  d="M511.3 759c-85.4 0-154.9-69.5-154.9-154.9s69.5-154.9 154.9-154.9 155 69.4 155 154.8-69.5 155-155 155z m0-283.9c-71.1 0-128.9 57.8-128.9 128.9s57.8 129 128.9 129c71.1 0 128.9-57.8 128.9-128.9s-57.8-129-128.9-129z"
                  fill="#0C0C0C"
                />
                <path
                  d="M874.6 317.4h-79c-15.3 0-27.9-12.6-27.9-27.9 0-15.3 12.6-27.9 27.9-27.9h79c15.3 0 27.9 12.6 27.9 27.9 0 15.3-12.5 27.9-27.9 27.9z"
                  fill="#9DC6AF"
                />
                <path
                  d="M874.6 330.4h-79c-22.5 0-40.9-18.3-40.9-40.9s18.3-40.9 40.9-40.9h79c22.5 0 40.9 18.3 40.9 40.9s-18.3 40.9-40.9 40.9z m-79-55.8c-8.2 0-14.9 6.7-14.9 14.9s6.7 14.9 14.9 14.9h79c8.2 0 14.9-6.7 14.9-14.9s-6.7-14.9-14.9-14.9h-79z"
                  fill="#191919"
                />
              </svg>
            </div>
            <input
              type="file"
              ref="fileInputRef"
              style="display: none"
              accept="image/*"
              @change="onImageSelected"
            />
          </div>

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
  cursor: pointer;
  margin-right: 20px;
  background-color: #f0f0f0;
}

.profile-pic {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.edit-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #429690;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  border: 2px solid white;
  cursor: pointer;
}

.edit-badge svg {
  width: 30px;
  height: 20px;
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
