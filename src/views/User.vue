<template>
    <div class="User">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">后台管理系统</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 面包屑完 -->
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="7">
                    <div class="mt-4">
                        <el-input @clear="reclear" clearable v-model="params.query" placeholder="请输入内容">
                            <template #append>
                                <el-button @click="search">
                                    <el-icon>
                                        <ZoomIn />
                                    </el-icon>
                                </el-button>
                            </template>
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="4">
                    <el-button @click="adduse" type="primary">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 渲染用户列表 -->
            <el-table stripe border :data="userslist" style="width: 100%">
                <el-table-column type="index" label="#" />
                <el-table-column prop="username" label="姓名" />
                <el-table-column prop="email" label="邮箱" />
                <el-table-column prop="mobile" label="电话" />
                <el-table-column prop="role_name" label="角色" />
                <!-- <el-table-column prop="mg_state" label="状态" /> -->
                <el-table-column prop="mg_state" label="状态">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row.mg_state" @change="changesta(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <!-- 修改 -->
                        <el-tooltip class="box-item" effect="dark" content="编辑" enterable="false" placement="top-start">
                            <el-button @click="bianji(scope.row.id)" type="warning" icon="Edit" size="small" />
                        </el-tooltip>
                        <el-tooltip class="box-item" effect="dark" content="分配角色" enterable="false"
                            placement="top-start">
                            <!-- 分配角色 -->
                            <el-button @click="setrole(scope.row)" type="primary" icon="Share" size="small" />
                        </el-tooltip>

                        <!-- 删除 -->
                        <el-tooltip class="box-item" effect="dark" content="删除" enterable="false" placement="top-start">
                            <el-button @click="opendelete(scope.row.id)" type="danger" icon="Delete" size="small" />
                        </el-tooltip>

                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination v-model:currentPage="params.pagenum" v-model:page-size="params.pagesize"
                :page-sizes="[1, 2, 5, 10]" :small="small" :disabled="disabled" :background="background"
                layout="total, sizes, prev, pager, next, jumper" :total="listtotal" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </el-card>
        <!-- 添加用户弹出对话框 -->
        <el-dialog @close="caceladd" v-model="dialogVisible" title="添加用户" width="30%">
            <!-- 表单 -->
            <el-form ref="addforms" :model="usermessage" :rules="rules" label-width="120px">
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="usermessage.username" />
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input v-model="usermessage.password" />
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="usermessage.email" />
                </el-form-item>
                <el-form-item prop="mobile" label="电话">
                    <el-input v-model="usermessage.mobile" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = !dialogVisible">取消</el-button>
                    <el-button type="primary" @click="rightadd">确定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 编辑用户对话框 -->
        <el-dialog @close="editclose" v-model="bianjidia" title="修改用户信息" width="30%">
            <el-form ref="editforms" :model="bianjiform" :rules="rules" label-width="120px">
                <el-form-item prop="username" label="用户名">
                    <el-input disabled v-model="bianjiform.username" />
                </el-form-item>
                <el-form-item prop="mobile" label="电话">
                    <el-input v-model="bianjiform.mobile" />
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="bianjiform.email" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="bianjidia = false">Cancel</el-button>
                    <el-button type="primary" @click="rightEditform">Confirm</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog v-model="dialogVisiblefenpei" title="分配角色" width="50%">
            <p>当前的用户：{{ userinforole.username }}</p>
            <p>当前的角色：{{ userinforole.role_name }}</p>
            <p>分配角色：
                <!-- 下拉选择框 -->
                <el-select v-model="selectedRoleid" placeholder="Select">
                    <el-option v-for="item in allrolwlist" :key="item.id" :label="item.roleName" :value="item.id" />
                </el-select>
            </p>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisiblefenpei = false">取消</el-button>
                    <el-button type="primary" @click="setroleright">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue'
import { apifenpeirolus, apiGetroluslist, apiGetUserlistdata, apiDeleteuser, apiEdituserInfo, apiAdduserInfo, apiGetbianji } from '@/apis/userdatalist'
import { apiPutUserState } from '@/apis/putchangestat'
import { ElMessage, ElMessageBox } from 'element-plus'
//获取用户列表数据
const params = reactive({
    query: null,
    pagenum: 1,
    pagesize: 2,
})
//储存用户列表
let userslist = ref([])
//储存数据总数
let listtotal = ref(0)
//当前页码
let nowpagenum = ref(0)
function getlist() {
    apiGetUserlistdata(params).then((res) => {
        // console.log(res.data);
        userslist.value = res.data.users
        // console.log('userslist: ', userslist);

        listtotal.value = res.data.total
        nowpagenum.value = res.data.pagenum
    })
}
getlist()
//监听 页码size改变
function handleSizeChange(newSize) {
    params.pagesize = newSize
    getlist()
}
//监听页码发生改变
function handleCurrentChange(newhandle) {
    params.pagenum = newhandle
    getlist()
}
//修改状态调用此函数
function changesta(val) {
    console.log(val.id, val.mg_state);
    apiPutUserState(val.id, val.mg_state).then((res) => {
        ElMessage({
            message: ' 修改数据成功.',
            duration: 1000,
            type: 'success',
        })
    }).catch((err) => {
        if (err.tate !== 200) {
            val.mg_state = !val.mg_state
            return ElMessage({
                message: ' 修改数据失败.',
                duration: 1000,
                type: 'error',
            })
        }
    })

}
//搜索
function search() {
    getlist()
}
//清空时返回全部数据
function reclear() {
    getlist()
}
//储存对话框是否显示
let dialogVisible = ref(false)
function adduse() {
    dialogVisible.value = true
}
//用户列表完成
//实现添加用户信息
let usermessage = reactive({
    username: '',
    password: '',
    email: '',
    mobile: '',
})
//自定义邮箱的验证规则
let checkEmail = (rule, value, cb) => {
    //验证邮箱的正则表达式    安装any-rule插件后可以按f1或鼠标右键快速生成选择的正则
    const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    //
    if (regEmail.test(value)) {
        //验证通过
        return cb()
    }
    //否则，不通过
    cb(new Error('请输入合法的邮箱'))
}
//自定义手机号验证
let checkMobile = (rule, value, cb) => {
    //验证邮箱的正则表达式    安装any-rule插件后可以按f1或鼠标右键快速生成选择的正则
    const regEmail = /^(?:(?:\+|00)86)?1\d{10}$/
    //
    if (regEmail.test(value)) {
        //验证通过
        return cb()
    }
    //否则，不通过
    cb(new Error('请输入合法的手机号'))
}
//定义表单规则
const rules = reactive({
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { min: 1, max: 10, message: 'cha', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
    ],
    email: [

        { required: true, message: '邮箱不能为空', trigger: 'blur' },
        //分别是自定义规则，触发时机  注意，代码时从上往下执行的，触发一个错误就不会执行此规则中下面的验证了，可以放心使用
        { validator: checkEmail, trigger: 'blur' }
    ],
    mobile: [
        { required: true, message: '电话不能为空', trigger: 'blur' },
        { validator: checkMobile, trigger: 'blur' }
    ],

})
// 关闭时重置
const addforms = ref(null)
function caceladd() {
    addforms.value.resetFields()
}
//确认添加
function rightadd() {
    addforms.value.validate((valid) => {
        if (valid) {
            //向服务器发送请求
            apiAdduserInfo(usermessage).then((res) => {
                // 提示信息
                ElMessage({
                    message: ' 添加成功',
                    duration: 1000,
                    type: 'success',
                })
                // 使框消失
                dialogVisible.value = false
                // 重新获取用户列表
                getlist()
            }).catch(err => {
                ElMessage({
                    message: ' 网络异常，请稍后再试',
                    duration: 2000,
                    type: 'error',
                })
            })

        } else {
            // console.log(valid);
            ElMessage({

                message: ' 输入信息有误，请检查您的信息.',
                duration: 1000,
                type: 'error',
            })
        }
    })
}
//修改用户信息部分
let bianjidia = ref(false)
let bianjiform = reactive({
    username: '',
    mobile: '',
    email: '',
    id: ''
})
// 关闭时重置
const editforms = ref(null)
function editclose() {
    // console.log(editforms.value);
    editforms.value.resetFields()
}
//编辑：请求用户信息
function bianji(id) {
    // console.log(id);
    apiGetbianji(id).then(res => {
        console.log(res);
        bianjidia.value = true
        bianjiform.username = res.data.username
        bianjiform.mobile = res.data.mobile
        bianjiform.email = res.data.email
        bianjiform.id = res.data.id
    }).catch(err => {
        ElMessage({
            message: ' 网络异常，请稍后再试.',
            duration: 1000,
            type: 'error',
        })
    })

}

//编辑表单提交前的预验证
function rightEditform() {
    editforms.value.validate((valid) => {
        if (valid) {
            apiEdituserInfo(bianjiform.id, bianjiform).then(res => {
                // console.log(res);
                ElMessage({
                    message: ' 修改成功',
                    duration: 1000,
                    type: 'success',
                })
                // 使框消失
                bianjidia.value = false
                // 重新获取用户列表
                getlist()
            }).catch(err => {
                // console.log(err);
                ElMessage({
                    message: ' 网络异常，请稍后再试.',
                    duration: 1000,
                    type: 'error',
                })
            })
        }
        else {
            ElMessage({
                message: ' 输入信息有误，请检查您的信息.',
                duration: 1000,
                type: 'error',
            })
        }
    })
}
//编辑部份已完成
//删除部分
//1.删除弹出消息提示框
const opendelete = (id) => {
    ElMessageBox.confirm(
        '操作将永久删除此用户，是否继续操作',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )    //若同意删除
        .then(() => {
            apiDeleteuser(id).then((res) => {

                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
            }).catch(err => {
                ElMessage({
                    message: ' 网络异常，请稍后再试',
                    duration: 2000,
                    type: 'error',
                })
            })
        })
        //若取消删除
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消操作',
            })
        })
}
//删除部分已完成
//展示分配角色的对话框
let dialogVisiblefenpei = ref(false)
let userinforole = reactive({
    username: '',
    role_name: ''
})
//角色id
let roleId = ref(0)
//所有角色的数据列表
let allrolwlist = ref([])
let selectedRoleid = ref('')
function setrole(val) {
    selectedRoleid.value = ''
    roleId.value = val.id
    userinforole.username = val.username
    userinforole.role_name = val.role_name
    dialogVisiblefenpei.value = true
    //在展示所有对话框之前，获取所有角色的列表
    apiGetroluslist().then(res => {
        console.log(res);
        allrolwlist.value = res.data


    }).catch(err => {
        ElMessage({
            type: 'error',
            message: '网络异常，请稍后再试'
        })
    })

}
//分配角色确定按钮
function setroleright() {
    if (selectedRoleid.value === '') {
        ElMessage({
            message: '请选择要分配的角色',
            duration: 1000,
            type: 'error',
        })
    }
    else {
        apifenpeirolus(roleId.value, selectedRoleid.value).then(res => {
            console.log(res);

            if (res.meta.status === 200) {
                ElMessage({
                    message: '分配成功',
                    duration: 1000,
                    type: 'success',
                })
                dialogVisiblefenpei.value = false
                getlist()
            }
        }).catch(err => {
            ElMessage({
                type: 'error',
                message: '网络异常，请稍后再试'
            })
        })
    }
}
//分配角色完
</script>





<style scoped>
.el-card {
    height: auto;
    width: auto;
}

.el-table {
    margin-top: 20px;
    font-size: 12px;
}

.el-pagination {
    margin-top: 20px;
}
</style>