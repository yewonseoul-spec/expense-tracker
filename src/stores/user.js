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

  const isLoading = ref(false);

  const profileImage = ref(
    localStorage.getItem('userProfileImage') || 'https://placehold.co/100x100',
  );

  // DB에서 최신 데이터를 가져오는 액션
  const fetchUserInfo = async () => {
    if (isLoading.value) return;

    isLoading.value = true;

    try {
      if (!userInfo.value.id) {
        const auth = JSON.parse(localStorage.getItem('auth'));
        if (auth && auth.id) {
          userInfo.value.id = auth.id;
        } else {
          return;
        }
      }

      const res = await axios.get(
        `http://localhost:3000/users/${userInfo.value.id}`,
      );
      userInfo.value = res.data;
      profileImage.value =
        res.data.profileImage || 'https://placehold.co/100x100';
    } catch (error) {
      console.error('유저 정보 가져오기 실패:', error);
    } finally {
      isLoading.value = false;
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
  const updateProfileImage = async (base64String) => {
    if (!userInfo.value.id) return;

    try {
      profileImage.value = base64String;

      await axios.patch(`http://localhost:3000/users/${userInfo.value.id}`, {
        profileImage: base64String,
      });
    } catch (error) {
      console.error('프로필 이미지 저장 실패:', error);
      alert('이미지 저장에 실패했습니다.');
    }
  };

  let userId = computed(() => userInfo.value.id);

  const reset = () => {
    userInfo.value = {
      id: '',
      name: '',
      email: '',
      nickname: '',
      gender: '남성',
      timezone: 'KST / UTC+09:00',
    };
    profileImage.value = 'https://placehold.co/100x100';
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/users/${userInfo.value.id}`,
      );
      const user = res.data;

      if (user.password !== currentPassword) {
        return { success: false, message: '현재 비밀번호가 틀렸습니다.' };
      }

      await axios.patch(`http://localhost:3000/users/${userInfo.value.id}`, {
        password: newPassword,
      });

      return { success: true };
    } catch (error) {
      console.error('비밀번호 변경 API 실패:', error);
      return { success: false, message: '서버 오류가 발생했습니다.' };
    }
  };

  return {
    userId,
    userInfo,
    isLoading,
    profileImage,
    fetchUserInfo,
    saveProfileToDB,
    updateProfileImage,
    reset,
    changePassword,
  };
});
