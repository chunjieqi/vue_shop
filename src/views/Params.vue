<template>
    <div class="Params">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">后台管理系统</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- card -->
        <el-card>
            <!-- 警告 -->
            <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false" />
            <div class="plese">请选择商品分类：</div>
            <!-- 级联选择框 -->
            <el-cascader :clearable="true" v-model="catvalue" :options="catlist" :props="Catprops"
                @change="handleChange" />
            <!-- tags标签页 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button @click="addparams" :disabled="isadd" class="nihao" type="primary" size="mini">添加参数
                    </el-button>
                    <!-- 动态参数表格 -->
                    <el-table stripe border :data="activedata" row-key="attr_id" style="width: 100%">
                        <el-table-column type="expand">
                            <template #default="scope">
                                <el-tag closable @close="closeEltag(index, scope.row)" class="tagger"
                                    v-for="(item, index) in scope.row.attr_vals" :key="index">{{ item }}</el-tag>
                                <el-input class="tagger" style="width: 120px;" v-if="scope.row.inputVisible"
                                    ref="InputRef" v-model="scope.row.inputValue" size="small"
                                    @keyup.enter="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)" />
                                <el-button class="tagger" v-else size="small" @click="showInput(scope.row)">
                                    + New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" type="index" width="180" />
                        <el-table-column prop="attr_name" label="参数名称" width="180" />
                        <el-table-column label="操作">
                            <template #default="scope">
                                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
                                    删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button @click="addparams" :disabled="isadd" class="nihao" type="primary" size="mini">添加属性
                    </el-button>
                    <!-- 静态属性表格 -->
                    <el-table row-key="attr_id" stripe border :data="jingtaidata" style="width: 100%">
                        <el-table-column type="expand">
                            <template #default="scope">
                                <el-tag closable v-for="(item, index) in scope.row.attr_vals" :key="index"
                                    @close="closeEltag(index, scope.row)">{{ item }}
                                </el-tag>
                                <el-input class="tagger" style="width: 120px;" v-if="scope.row.inputVisible"
                                    ref="InputRef" v-model="scope.row.inputValue" size="small"
                                    @keyup.enter="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)" />
                                <el-button class="tagger" v-else size="small" @click="showInput(scope.row)">
                                    + New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" type="index" width="180" />
                        <el-table-column prop="attr_name" label="属性名称" width="180" />
                        <el-table-column label="操作">
                            <template #default="scope">
                                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
                                    删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加操作对话框 -->
        <el-dialog @close="closeDialogparams" v-model="diaAddVisible" :title="'添加' + dialogmessage" width="30%"
            :before-close="handleClose">
            <!-- form表单 -->
            <el-form ref="ParmRef" :model="parmasForm" :rules="rules" label-width="120px">
                <el-form-item prop="attr_name" :label="dialogmessage">
                    <el-input v-model="parmasForm.attr_name" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="diaAddVisible = false">取消</el-button>
                    <el-button type="primary" @click="rightDiaaddVis">确定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 编辑操作对话框 -->
        <el-dialog @close="closeeditDialogparams" v-model="diaEditVisible" :title="'修改' + dialogmessage" width="30%">
            <!-- form表单 -->
            <el-form ref="ParmeditRef" :model="parmaseditForm" :rules="rules" label-width="120px">
                <el-form-item prop="attr_name" :label="dialogmessage">
                    <el-input v-model="parmaseditForm.attr_name" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="diaEditVisible = false">取消</el-button>
                    <el-button type="primary" @click="righteditDiaaddVis">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { nextTick, defineComponent, reactive, toRefs, ref, computed } from 'vue'
import { apideadddms, apideleteeditparams, apigeteditparams, apiAddparams, apiGetparamsaddlist, apiGetparams } from '@/apis/params'
import { ElInput, ElMessage, ElMessageBox } from 'element-plus'
//储存商品数据列表
let catlist = ref([])
//级联选择器配置对象
const Catprops = reactive({
    expandTrigger: 'hover',
    value: 'cat_id',
    label: 'cat_name',
    children: 'children'
})
//储存级联选择器的选中数据
let catvalue = ref([])
//tags
let activeName = ref('many')
//定义变量储存动静数据
let activedata = ref([])
let jingtaidata = ref([])
// 级联选择器出发函数 获取选中数据
function handleChange() {
    if (catvalue.value !== null) {
        if (catvalue.value.length != 3) {
            catvalue.value = []
            activedata.value = []
            jingtaidata.value = []
            return
        }
        else {
            //发送请求
            apiGetparamsaddlist(catvalue.value[2], 'many').then(res => {
                // console.log(res.data[0].attr_vals);
                //将字符转转火为数组

                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                });
                // console.log(res.data[0].attr_vals);
                activedata.value = res.data
                // console.log('activedata.value: ', activedata.value);

            })
            apiGetparamsaddlist(catvalue.value[2], 'only').then(res => {
                // console.log(res);
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                });
                jingtaidata.value = res.data
            })
        }
    }
    else {
        catvalue.value = []
        return
    }


}

function handleClick() {
}
//计算属性
const isadd = computed({
    get() {
        if (catvalue.value !== null) {
            if (catvalue.value.length != 3) {

                return true
            }
            else {
                return false
            }
        }
        else {
            return false
        }
    },
})
//获取数据列表
function getlistpar() {
    apiGetparams().then(res => {

        catlist.value = res.data
        // console.log(catlist.value);
    })
}
getlistpar()

//添加操作
let diaAddVisible = ref(false)
//表单数据
let parmasForm = reactive({
    id: '',
    attr_name: '',
    attr_sel: '',
})
//定义规则
const rules = reactive({
    attr_name: [{ required: true, message: '请输入动态参数', trigger: 'blur' }]
})
//拿到form表单对象
let ParmRef = ref(null)
//关闭时重置
function closeDialogparams() {
    ParmRef.value.resetFields()
}
//点击按钮时回调
function addparams() {
    diaAddVisible.value = true
}
//确定添加时回调
function rightDiaaddVis() {
    //更改数据
    parmasForm.attr_sel = activeName.value
    //进行表单校验
    ParmRef.value.validate((valid) => {
        if (valid) {
            //向服务器发送请求
            // console.log(parmasForm.attr_sel);
            apiAddparams(catvalue.value[2], parmasForm).then((res) => {
                // console.log(res);

                // 提示信息
                ElMessage({
                    message: ' 添加成功',
                    duration: 1000,
                    type: 'success',
                })
                // 使框消失
                diaAddVisible.value = false
                // 重新获取用户列表
                handleChange()
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
//添加计算属性用于对话框
let dialogmessage = computed({
    get() {
        if (activeName.value === 'many') {
            return '动态参数'
        }
        else {
            return '静态属性'
        }


    },
})
// 完成添加操作
// 编辑操作
let diaEditVisible = ref(false)
//编辑表单数据
let parmaseditForm = reactive({
    attr_name: '',
    attr_sel: '',
})
//点击按钮弹出对话框
let editidd = ref(0)
let editattidd = ref(0)
function handleEdit(index, val) {
    //并给name赋值
    editidd.value = val.attr_id
    editattidd.value = val.cat_id
    parmaseditForm.attr_name = val.attr_name
    // console.log(val);
    diaEditVisible.value = true
}
//点击确定按钮   //未完
function righteditDiaaddVis() {
    //更改数据
    parmaseditForm.attr_sel = activeName.value
    //进行表单校验
    ParmeditRef.value.validate((valid) => {
        if (valid) {
            //向服务器发送请求
            // console.log(parmasForm.attr_sel);
            apigeteditparams(editattidd.value, editidd.value, parmaseditForm).then((res) => {
                // console.log(res);

                // 提示信息
                ElMessage({
                    message: ' 更新成功',
                    duration: 1000,
                    type: 'success',
                })
                // 使框消失
                diaEditVisible.value = false
                // 重新获取用户列表
                handleChange()
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
//获取表单
let ParmeditRef = ref(null)
//关闭时重置
function closeeditDialogparams() {
    ParmeditRef.value.resetFields()
}
//编辑操作完成
//删除操作
//点击按钮时打开消息提示框
function handleDelete(index, val) {
    // console.log(val);
    ElMessageBox.confirm(
        '此操作将永久删除，是否继续',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            apideleteeditparams(val.cat_id, val.attr_id).then(res => {
                // console.log(res);
                // 重新获取用户列表
                handleChange()
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

        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '删除已取消',
            })
        })
}
//删除操作已完成
// 添加标签操作
let inputVisible = ref(false)
let inputValue = ref('')
let InputRef = ref(null)
// 确定enter或失去焦点
function handleInputConfirm(val) {
    // inputVisible.value=true
    if (val.inputValue.trim().length === 0) {
        val.inputValue = ''
        val.inputVisible = false
        return
    }
    val.attr_vals.push(val.inputValue.trim())
    val.inputValue = ''
    val.inputVisible = false
    //发起请求，
    apideadddms(val.cat_id, val.attr_id, {
        attr_name: val.attr_name,
        attr_sel: val.attr_sel,
        attr_vals: val.attr_vals.join(' ')
    }).then(res => {
        // console.log(res);
        ElMessage({
            type: 'success',
            message: '添加成功'
        })
    }).catch(err => {
        ElMessage({
            type: 'error',
            message: '添加失败'
        })
    })
}
function showInput(val) {
    val.inputVisible = true
    //自动获得焦点
    nextTick(() => {
        InputRef.value.input.focus()
    })
}
//删除操作
function closeEltag(i, row) {
    console.log();
    row.attr_vals.splice(i, 1)
    //发起请求，

    apideadddms(row.cat_id, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
    }).then(res => {
        // console.log(res);
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
    }).catch(err => {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    })
}
</script>
<style scoped>
.plese {
    margin-top: 20px;
    margin-bottom: 20px;
}

.nihao {
    margin-top: 10px;
}

.tagger {
    margin-left: 20px;
}
</style>