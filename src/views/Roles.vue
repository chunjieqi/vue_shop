<template>
   <div class="Rolus">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
         <el-breadcrumb-item :to="{ path: '/home' }">后台管理系统</el-breadcrumb-item>
         <el-breadcrumb-item>权限管理</el-breadcrumb-item>
         <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 面包屑完  -->
      <!-- 卡片视图 -->
      <el-card>
         <!-- 按钮 -->
         <el-button type="primary" @click="addroledia = true">添加角色</el-button>
         <!-- table表格 -->
         <el-table :data="rolusData" row-key="id" stripe border style="width: 100%">
            <el-table-column type="expand">
               <template #default="scope" class="tem">
                  <el-row v-for="(item, index) in scope.row.children" :key="item.id">
                     <!-- 一级权限 -->
                     <el-col :span="5">
                        <el-tag closable @close="deleteTag(scope.row, item.id)">
                           {{ item.authName }}
                           <el-icon color="black">
                              <CaretRight />
                           </el-icon>
                        </el-tag>

                     </el-col>
                     <!-- 二三级权限 -->
                     <el-col :span="19">
                        <!-- 渲染二级全选 -->
                        <el-row v-for="(item2, index2) in item.children" :key="item2.id">
                           <el-col :span="6">
                              <el-tag type="success" closable @close="deleteTag(scope.row, item2.id)">
                                 {{ item2.authName }}
                                 <el-icon color="black">
                                    <CaretRight />
                                 </el-icon>
                              </el-tag>
                           </el-col>
                           <el-col :span="18">
                              <el-row v-for="(item3, index3) in item2.children" :key="item3.id" class="wukuang">
                                 <el-col>
                                    <el-tag type="warning" closable @close="deleteTag(scope.row, item3.id)">
                                       {{ item3.authName }}
                                    </el-tag>
                                 </el-col>
                              </el-row>
                           </el-col>
                        </el-row>
                     </el-col>
                  </el-row>
               </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="roleName" label="角色名称" />
            <el-table-column prop="roleDesc" label="角色描述" />
            <el-table-column prop="level" label="操作">
               <template #default="scope">
                  <el-button size="small" type="primary" @click="editroles(scope.row)">编辑</el-button>
                  <el-button size="small" @click="openclick(scope.row)" type="danger">删除</el-button>
                  <el-button size="small" type="warning" @click="fenpei(scope.row)">
                     <el-icon style="margin-right: 5px;">
                        <Help />
                     </el-icon>
                     分配权限
                  </el-button>
               </template>
            </el-table-column>
         </el-table>
      </el-card>
      <!-- 添加角色弹出框 -->
      <el-dialog @close="caceladd" v-model="addroledia" title="添加角色" width="30%">
         <!-- 表单 -->
         <el-form ref="addforms" :model="rolesmessage" :rules="rules" label-width="120px">
            <el-form-item prop="roleName" label="角色名称">
               <el-input v-model="rolesmessage.roleName" />
            </el-form-item>
            <el-form-item prop="roleDesc" label="角色描述">
               <el-input v-model="rolesmessage.roleDesc" />
            </el-form-item>
         </el-form>
         <template #footer>
            <span class="dialog-footer">
               <el-button @click="addroledia = false">取消</el-button>
               <el-button type="primary" @click="rightadd">确定</el-button>
            </span>
         </template>
      </el-dialog>
      <!-- 编辑用户对话框  -->
      <!-- 添加角色弹出框 -->
      <el-dialog @close="caceledit" v-model="editroledia" title="编辑角色" width="30%">
         <!-- 表单 -->
         <el-form ref="editforms" :model="editmessage" :rules="rules" label-width="120px">
            <el-form-item prop="roleName" label="角色名称">
               <el-input v-model="editmessage.roleName" />
            </el-form-item>
            <el-form-item prop="roleDesc" label="角色描述">
               <el-input v-model="editmessage.roleDesc" />
            </el-form-item>
         </el-form>
         <template #footer>
            <span class="dialog-footer">
               <el-button @click="editroledia = false">取消</el-button>
               <el-button type="primary" @click="rightedit">确定</el-button>
            </span>
         </template>
      </el-dialog>
      <!-- 分配权限弹出框 -->
      <el-dialog v-model="rolefenpei" title="分配权限" width="30%">
         <el-tree ref="gettree" :data="rolusAlldata" show-checkbox node-key="id" :default-checked-keys="dearry"
            default-expand-all :props="defaultProps" />
         <template #footer>
            <span class="dialog-footer">
               <el-button @click="rolefenpei = false">取消</el-button>
               <el-button type="primary" @click="shouyu">确定</el-button>
            </span>
         </template>
      </el-dialog>
   </div>
</template>

<script setup>
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apifenpeirolus, apigetrolusall, apiDeleterolustag, apiGetroluslist, apiAddrolus, apiEditrolus, apiGetrolusid, apiDeleterolus } from '@/apis/rolus'
let rolusData = ref([])
function getRolusData() {
   apiGetroluslist().then(res => {
      rolusData.value = res.data
      // console.log(res);
   }).catch(err => {
      ElMessage({
         type: 'error',
         message: '网络异常，请稍后再试'
      })
   })
}
//发送请求，获取数据
getRolusData()
// 关闭时重置
const addforms = ref(null)
function caceladd() {
   addforms.value.resetFields()
}
//是否开启对话框
let addroledia = ref(false)
let rolesmessage = reactive({
   roleName: '',
   roleDesc: ''
})
//定义规则
const rules = reactive({
   roleName: [
      { required: true, message: '角色名不能为空', trigger: 'blur' },
      { min: 1, max: 10, message: 'cha', trigger: 'blur' },
   ],
   roleDesc: [
      { required: true, message: '描述不能为空', trigger: 'blur' },
      { min: 1, max: 10, message: 'cha', trigger: 'blur' },
   ],
})
//确定时验证表单
function rightadd() {
   addforms.value.validate((valid) => {
      if (valid) {
         //向服务器发送请求
         apiAddrolus(rolesmessage).then((res) => {
            // 提示信息
            ElMessage({
               message: ' 添加成功',
               duration: 1000,
               type: 'success',
            })
            // 使框消失
            addroledia.value = false
            // 重新获取用户列表
            getRolusData()
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
//编辑操作
// 关闭时重置
const editforms = ref(null)
let editmessage = reactive({
   roleId: '',
   roleName: '',
   roleDesc: ''
})
function caceledit() {
   editforms.value.resetFields()
}
//是否开启对话框
let editroledia = ref(false)
function editroles(val) {
   // console.log(val.id);
   editroledia.value = true
   // apiEditrolus(val.id,)
   apiGetrolusid(val.id).then(res => {
      // console.log(res.data.roleId);
      editmessage.roleId = res.data.roleId
      editmessage.roleName = res.data.roleName
      editmessage.roleDesc = res.data.roleDesc
   })
}
//确定时验证表单
function rightedit() {
   editforms.value.validate((valid) => {
      if (valid) {
         //向服务器发送请求
         apiEditrolus(editmessage.roleId, editmessage).then((res) => {
            // 提示信息
            ElMessage({
               message: ' 添加成功',
               duration: 1000,
               type: 'success',
            })
            // 使框消失
            editroledia.value = false
            // 重新获取用户列表
            getRolusData()
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
//打开删除操作框
function openclick(val) {
   ElMessageBox.confirm(
      '此操作将删除用户，是否继续删除？',
      '警告',
      {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning',
      }
   )
      .then(() => {
         // console.log(val.id);
         apiDeleterolus(val.id).then(res => {
            getRolusData()
            ElMessage({
               type: 'success',
               message: '删除成功',
            })
         }).catch(err => {
            ElMessage({
               type: 'error',
               message: '网络异常，请稍后再试',
            })
         })
      }).catch(() => {
         ElMessage({
            type: 'info',
            message: '操作已取消',
         })
      })
}
//表格伸缩框中删除标签即权限
function deleteTag(role, rightId) {
   ElMessageBox.confirm(
      '此操作将删除用户权限，是否继续删除？',
      '警告',
      {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning',
      }
   )
      .then(() => {
         apiDeleterolustag(role.id, rightId).then(res => {
            ElMessage({
               type: 'success',
               message: '权限删除成功',
            })
            role.children = res.data
         }).catch(err => {
            ElMessage({
               type: 'error',
               message: '网络异常，请稍后再试',
            })
         })
      }).catch((err) => {
         ElMessage({
            type: 'info',
            message: '操作已取消',
         })
      })
}
//实现分配权限功能
//储存拿回来的数据
let rolusAlldata = ref([])
let rolefenpei = ref(false)
//默认选中id的数组
let dearry = ref([])
let roleid = ref(0)
//递归函数，获取所有三级节点的id
function getchid(node, arr) {
   if (!node.children) {
      return arr.push(node.id)
   }
   node.children.forEach(item => {
      getchid(item, arr)
   });
}
function fenpei(val) {
   roleid.value = val.id
   dearry.value = []
   getchid(val, dearry.value)
   rolefenpei.value = true
   apigetrolusall().then(res => {
      console.log(res.data);
      console.log(val);
      rolusAlldata.value = res.data
   })
}
//定义树形控件能看到并读取哪些名称
const defaultProps = reactive({
   children: 'children',
   label: 'authName',
})
//确定授予权限
const gettree = ref(null)
function shouyu() {
   rolefenpei.value = false
   let CheckedKeys = gettree.value.getCheckedKeys()
   let HalfCheckedKeys = gettree.value.getHalfCheckedKeys()
   let finarr = [...CheckedKeys, ...HalfCheckedKeys]
   const rids = finarr.join(',')
   console.log({ rids });
   //分配权限
   apifenpeirolus(roleid.value, { rids }).then(res => {
      // console.log(res);
      getRolusData()
      ElMessage({
         type: 'success',
         message: '分配权限成功',
      })
   }).catch(err => {
      ElMessage({
         type: 'error',
         message: '网络异常，请稍后再试',
      })
   })

}

</script>

<style scoped>
.el-table {
   margin-top: 20px;
}

.el-tag {
   position: relative;
   margin: 20px;
}

.el-tag .el-icon {
   position: absolute;
   right: -20px;
}

/* .el-row:nth-child(1) .el-col .el-tag{
   margin-top: 30px;
} */
.el-row {
   border-bottom: solid 1px #eee;
}

.el-row .wukuang {
   border-bottom-style: none;
}
</style>