<template>
   <div class="Home">
    <el-button type="danger" @click="exitlo">退出登录</el-button>
   </div>
</template>

<script setup>
import router from '@/router'
import { defineComponent, reactive, toRefs } from 'vue'
function exitlo(){
    window.sessionStorage.clear('token')
    router.push('/login')
}
</script>
<style lang='scss' scoped>
</style>