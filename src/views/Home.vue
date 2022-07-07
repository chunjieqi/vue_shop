<template>
    <div class="Home">
        <div class="common-layout">
            <el-container class="home-contain">
                <el-header>
                    <div class="tit">
                        <img src="../assets/heima.png" alt="电商管理系统">
                        <span class="animate__animated animate__rubberBand">电商管理系统</span>
                    </div>
                    <el-button type="danger" @click="exitlo">退出登录</el-button>
                </el-header>
                <el-container>
                    <el-aside :width="isco ? '50px' : '200px'">
                        <div class="toggle-button" @click="togglebtn">|||</div>
                        <el-menu :default-active="nowhref" router="true" active-text-color="rgba(245, 7, 7, 0.547)" 
                            class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                            background-color="rgba(132, 128, 128, 0.547)" style="width: 100%;">
                            <el-sub-menu v-for="item in menuList" :key="item.id" :index="item.id + ''">
                                <template #title>
                                    <el-icon>
                                        <location />
                                    </el-icon>
                                    <span>{{ item.authName }}</span>
                                </template>
                                <el-menu-item v-for="subitem in item.children" :key="subitem.id"
                                    :index="'/home/' + subitem.path">
                                    {{ subitem.authName }}</el-menu-item>

                            </el-sub-menu>
                        </el-menu>
                    </el-aside>
                    <el-container>
                        <el-main>
                            <router-view></router-view>
                        </el-main>
                        <el-footer>Footer</el-footer>
                    </el-container>
                </el-container>
            </el-container>
        </div>

    </div>
</template>

<script setup>
import 'animate.css';
import router from '@/router'
import { defineComponent, onMounted, reactive, toRefs, ref } from 'vue'
import { apiGetmenu } from '@/apis/getmenu.ts'
let isco = ref(false)
//实现推出按钮
function exitlo() {
    window.sessionStorage.clear('token')
    router.push('/login')
}

//实现获取菜单
let menuList = ref(0)
apiGetmenu().then(res => {
    // console.log(res);
    menuList.value = res.data
    // console.log('res.data: ', res.data);
})
//点击按钮切换菜单的折叠

function togglebtn() {
    // console.log(asidel);
    if (isco.value) {
        isco.value = false
        // console.log('jfjag');
        // document.querySelector('.el-aside').style.width="64px"
    } else {
        isco.value = true
        // console.log("fff");
        // document.querySelector('.el-aside').style.width="200px"
    }

}
//获取哈希地址
const nowhref=ref(router.currentRoute._rawValue.path)



</script>
<style scoped>
.el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(132, 128, 128, 0.547);
}

.el-aside {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: center;
    background-color: rgba(132, 128, 128, 0.547);
}

.el-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(132, 128, 128, 0.547);
}

.home-contain {
    height: 100%;
}

.common-layout,
.Home {
    height: 100%;
}

.tit {
    display: flex;
    align-items: center;
    margin-left: 30px;
}

.tit span {
    display: flex;

    margin-left: 20px;
    font-size: larger;
}

.toggle-button {
    width: 100%;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.168);
    letter-spacing: 0.2em;
    cursor: pointer;
}

.toggle-button:hover {
    background-color: rgba(50, 31, 34, 0.168);
}
</style>