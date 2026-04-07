<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <p>메인 콘텐츠 영역</p>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  margin: 0;
}

.main-content {
  flex: 1;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>