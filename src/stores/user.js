import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  // localStorage에 저장한 'auth' 데이터 꺼내기 -> 현재 사용자의 정보
  const savedAuth = JSON.parse(localStorage.getItem('auth')) || null;

  // 상태 (State) 세팅
  const userInfo = ref({
    id: savedAuth?.id || '',
    name: savedAuth?.name || '',
    email: savedAuth?.email || '',
    nickname: '',
    gender: '남성',
    timezone: 'KST / UTC+09:00',
  });

  const profileImage = ref(
    localStorage.getItem('userProfileImage') || 'https://placehold.co/100x100',
  );

  // 프로필 이미지 변경 액션
  const updateProfileImage = (base64String) => {
    profileImage.value = base64String;
    localStorage.setItem('userProfileImage', base64String);
  };

  return {
    userInfo,
    profileImage,
    updateProfileImage,
  };
});
