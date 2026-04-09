<template>
  <div class="app-settings">
    <div class="settings-banner"></div>

    <div class="settings-content">
      <section class="settings-category">
        <h3 class="category-title">환경 설정</h3>

        <div class="setting-item">
          <span class="setting-name">다크 모드</span>
          <label class="switch">
            <input type="checkbox" />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <span class="setting-name">통화 단위</span>
          <div class="select-wrapper">
            <select class="custom-select">
              <option value="KRW">원화 (₩)</option>
              <option value="USD">달러 ($)</option>
            </select>
          </div>
        </div>
      </section>

      <section class="settings-category">
        <h3 class="category-title">가계부 관리</h3>

        <div class="setting-item">
          <span class="setting-name">월 시작일 기준</span>
          <div class="select-wrapper">
            <select class="custom-select">
              <option value="1">매월 1일</option>
              <option value="10">매월 10일</option>
              <option value="25">매월 25일</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* 전체 카드 컨테이너 */
.app-settings {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  height: 100%;
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
}

/* 상단 그라데이션 배너 */
.settings-banner {
  width: 100%;
  height: 100px;
  background: linear-gradient(90deg, #d2e4f6 0%, #fef3d5 100%);
  flex-shrink: 0;
}

/* 설정 리스트 본문 영역 */
.settings-content {
  padding: 40px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

/* 섹션 타이틀 */
.category-title {
  font-size: 20px;
  font-weight: 600;
  color: #64ffda;
  margin: 0 0 16px 0;
}

/* 개별 설정 항목 박스 */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 16px 24px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.setting-name {
  font-size: 18px;
  font-weight: 500;
  color: #333333;
}

/* 4. 커스텀 드롭다운 */
.select-wrapper {
  position: relative;
  width: 160px;
}

.custom-select {
  width: 100%;
  padding: 8px 32px 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background-color: #ffffff;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  outline: none;
}

.custom-select:focus {
  border-color: #64ffda;
}

/* 드롭다운 화살표 아이콘 커스텀 */
.select-wrapper::after {
  content: '∨';
  font-size: 12px;
  color: #888888;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

/* 5. 토글 스위치 */
.switch {
  position: relative;
  display: inline-block;
  width: 54px;
  height: 30px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #efefef;
  box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: 0.3s;
  border-radius: 30px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 24px;
  width: 24px;
  left: 3px;
  bottom: 3px;
  background: linear-gradient(180deg, white 0%, #e8eaea 100%);
  box-shadow: 2px 1px 4px rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #64ffda;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

/* 모바일 반응형 처리 */
@media (max-width: 768px) {
  .settings-content {
    padding: 20px;
    gap: 32px;
  }

  .setting-item {
    padding: 12px 16px;
  }
}
</style>
