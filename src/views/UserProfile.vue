<template>
  <div class="user-profile">
    <div class="profile-banner"></div>

    <div class="profile-content">
      <div class="profile-header">
        <div class="profile-info">
          <div class="avatar">
            <span>100 × 100</span>
          </div>
          <div class="user-details">
            <h2 class="name">Lee</h2>
            <p class="email">이메일@gmail.com</p>
          </div>
        </div>
        <button class="edit-btn">편집</button>
      </div>

      <form class="profile-form">
        <div class="form-group">
          <label>이름</label>
          <input type="text" placeholder="홍길동" />
        </div>

        <div class="form-group">
          <label>닉네임</label>
          <input type="text" placeholder="닌자" />
        </div>

        <div class="form-group">
          <label>성별</label>
          <div class="select-wrapper">
            <select>
              <option>남성</option>
              <option>여성</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>이메일</label>
          <input type="email" placeholder="hong@email.com" />
        </div>

        <div class="form-group">
          <label>Time Zone</label>
          <div class="select-wrapper">
            <select>
              <option>KST / UTC+09:00</option>
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
  width: 100%; /* ⭐️ 가로 공간 100% 차지 */
  height: 100%; /* ⭐️ 세로 공간도 부모에 맞춰 꽉 채움 */
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
  /* 이미지에 있던 그라데이션과 유사한 색상 적용 */
  background: linear-gradient(90deg, #d2e4f6 0%, #fef3d5 100%);
  flex-shrink: 0;
}

/* 프로필 본문 영역 */
.profile-content {
  padding: 0 40px 40px 40px;
  flex-grow: 1; /* 남은 세로 공간 모두 차지 */
  display: flex;
  flex-direction: column;
}

/* 프로필 헤더 (가로 정렬) */
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 수직 중앙 정렬 */
  margin-top: -50px; /* 배너 위로 50px 끌어올림 */
  margin-bottom: 40px;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 프로필 아바타 */
.avatar {
  width: 100px;
  height: 100px;
  background: #000000;
  border-radius: 50%;
  border: 4px solid #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
}

.user-details {
  margin-top: 50px; /* 사진 옆 텍스트가 사진 중간이 아닌 하단에 맞도록 내림 */
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
  margin-top: 50px; /* 텍스트와 높이를 맞추기 위해 똑같이 밀어냄 */
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

/* 폼 그리드 레이아웃 (PC 기본: 2열) */
.profile-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px 40px; /* 세로, 가로 간격 조금 더 넓게 */
  width: 100%; /* ⭐️ 폼 자체가 가로 영역을 다 쓰도록 명시 */
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
  height: 52px; /* ⭐️ 피그마 원본과 동일하게 52px 고정 높이 부여 */
  padding: 0 20px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
  color: #333333;
  outline: none;
  transition: background 0.2s ease;
}

.form-group input::placeholder {
  color: #ada7a7;
}

.form-group input:focus,
.form-group select:focus {
  background: #ebebeb; /* 포커스 시 살짝 진해짐 */
}

/* Select 화살표 커스텀 (CSS 트릭) */
.select-wrapper {
  position: relative;
  width: 100%;
}

.select-wrapper select {
  appearance: none; /* 브라우저 기본 화살표 제거 */
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
  pointer-events: none; /* 클릭 방해 금지 */
}

/* 📱 모바일 반응형 처리 (화면이 768px보다 좁아질 때) */
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
