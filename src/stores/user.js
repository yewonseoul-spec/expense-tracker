import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import axios from 'axios';

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

  // DB에서 최신 데이터를 가져오는 액션
  const fetchUserInfo = async () => {
    if (!userInfo.value.id) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/users/${userInfo.value.id}`,
      );
      userInfo.value = res.data;
    } catch (error) {
      console.error('유저 정보 가져오기 실패:', error);
    }
  };

  // DB에 데이터를 저장하는 액션
  const saveProfileToDB = async (payload) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/users/${userInfo.value.id}`,
        payload,
      );
      userInfo.value = res.data; // 스토어 상태 최신화

      localStorage.setItem(
        'auth',
        JSON.stringify({
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
        }),
      );
      return true;
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      return false;
    }
  };

  // 프로필 이미지 변경 액션
  const updateProfileImage = (base64String) => {
    profileImage.value = base64String;
    localStorage.setItem('userProfileImage', base64String);
  };

  let userId = computed( () => userInfo.value.id)
  return {
    userId,
    userInfo,
    profileImage,
    fetchUserInfo,
    saveProfileToDB,
    updateProfileImage,
  };
});
