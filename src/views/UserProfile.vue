<script setup>
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const isEditing = ref(false);
const fileInputRef = ref(null);

const formData = ref({ ...userStore.userInfo });

watch(
  () => userStore.userInfo,
  (newVal) => {
    formData.value = { ...newVal };
  },
  { deep: true },
);

onMounted(async () => {
  await userStore.fetchUserInfo();
});

// --- 로직 (Functions) ---

const triggerImageUpload = () => {
  fileInputRef.value.click();
};

// 이미지 파일 선택 완료 시 호출되는 함수
const onImageSelected = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => userStore.updateProfileImage(e.target.result);
    reader.readAsDataURL(file);
  }
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
      </form>
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
</style>
