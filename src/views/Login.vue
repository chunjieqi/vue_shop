<template>
    <div class="Login">
        <div class="box">
            <!-- 顶部图片 -->
            <div class="imgbox">
                <img src="../assets/lu.jpeg" alt="" style="width: 100%;height: 100%;border-radius: 50%;">
            </div>
            <!-- 整个form -->
            <el-form label-width="auto" :model="form" :rules="rules" ref="formOb">
                <!-- 输入框 -->

                <el-form-item label="用户名" prop="name">
                    <el-input v-model="form.name" prefix-icon="Avatar" />
                </el-form-item>
                <el-form-item label="密码" show-password="true" prop="password">
                    <el-input v-model="form.password" show-password />
                </el-form-item>
                <!-- 按钮 -->
                <div class="btn">
                    <el-button type="primary" @click="onlogin">登录</el-button>
                    <el-button type="primary" @click="resetlogin">重置</el-button>
                </div>
            </el-form>
        </div>

    </div>
</template>

<script setup>
import { defineComponent, reactive, toRefs, ref } from 'vue'
import router from '@/router'
//拦截器的接口api
import { apiGetUserInfo } from '@/apis/user.ts'
const form = reactive({
    name: 'admin',
    password: '123456',
})
const rules = reactive({
    name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 1, max: 10, message: '长度为1-10', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 1, max: 10, message: '长度为1-10', trigger: 'blur' },
    ]
})
//拿到整个 form表单
const formOb = ref(null)
//重置按钮处理函数
function resetlogin() {
    formOb.value.resetFields()
}
//确定按钮验证
function onlogin() {
    formOb.value.validate(valid => {
        //如果为true,则代表通过验证
        if (valid) {
            // axios.post('https://lianghj.top:8888/api/private/v1/login', {
            //     username: form.name,        // 参数 firstName
            //     password: form.password    // 参数 lastName
            // })
            //     .then(function (response) {
            //         // alert('登陆成功')
            //         //把token保存到window.sessionSorage,代表此用户现在是登陆状态
            //         window.sessionStorage.setItem('token',response.data.data.token)
            //         //利用route.push('')改变路由地址，进行跳转
            //         router.push('/home')
            //         console.log(response);
            //     })
            //     .catch(function (error) {
            //         alert("登陆失败,请重新登录")
            //     });
            apiGetUserInfo(form.name,form.password).then((response) => {
                
                // alert('登陆成功')
                // console.log(response);
                    //把token保存到window.sessionSorage,代表此用户现在是登陆状态
                    window.sessionStorage.setItem('token',response.data.token)
                    //利用route.push('')改变路由地址，进行跳转
                    router.push('/home')
            })
        }

        if (!valid) {
            alert('你输入的信息不合规范，请检查你的信息')
            return
        }
    }
    )
}
</script>

<style scoped>
.Login {
    background-color: rgba(13, 93, 204, 0.451);
    height: 100%;
}

.box {
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 350px;
    border-radius: 29px;
    background: #e0e0e0;
    box-shadow: 5px 5px 18px #a4a4a4,
        -5px -5px 18px #ffffff;
}

.imgbox {
    width: 120px;
    height: 120px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: #893f3f;
    box-shadow: 12px 12px 24px #a4a4a4,
        -12px -12px 24px #ffffff;
}

/* 输入表单的样式 */
/* 按钮样式 */
.btn {
    position: absolute;
    right: 20%;
}
</style>