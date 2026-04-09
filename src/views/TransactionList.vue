<!-- (거래 내역 상세페이지) -->
<template>


    <div class="modal">
        <div class="box">
            <div class="heading">
                <br>
                <br>
                <br>
                <br>
                <br>
                나는 제목
            </div>
            <!-- <div v-for="t in transactionStore.userData" :key="t.id" class="heading2"> -->
            <TransactionDetail v-for="t in transactionStore.userData" :key="t.id" :t="t"></TransactionDetail>
        </div>
    </div>

</template>

<script setup>
import TransactionDetail from '@/components/TransactionDetail.vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { onMounted } from 'vue';
const transactionStore = useTransactionStore();
import { useRoute } from 'vue-router';

// import { watch } from 'vue';
// import { useRoute } from 'vue-router';

// const route = useRoute();
// watch(
//     () => route.params.date,
//     (newDate) => {
//         transactionStore.getDate(newDate, "1");
//     }
// );

const route = useRoute(); //파라메터 받을 때 사용
const date = route.params.date;

onMounted(() => {
    transactionStore.getDate(date, "1");
});
</script>

<style scoped>
/* (29) 모달 배경 */
.modal {
    display: block;
    position: fixed;
    z-index: 1;
    right: 0;
    top: 10px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
}

/* (30) 박스 */
.box {
    background-color: white;
    position: absolute;
    right: 0;
    /* 👈 오른쪽 고정 */
    top: 80px;
    width: 500px;
    min-height: 900px;
    padding: 10px;
}

/* (31) 헤더 */
.box .heading {
    background: #33a17f;
    color: white;
    padding: 10px;
}

.box .heading2 {
    background: white;
    color: black;
    padding: 10px;
}

/* (32) 클릭 커서 */
.pointer {
    cursor: pointer;
}
</style>