<template>
    <div class="Add">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">后台管理系统</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 面包屑完 -->
        <el-card>
            <!-- 提示信息 -->
            <el-alert title="添加商品信息" type="info" center show-icon />
            <!-- 步骤条 -->
            <el-steps :space="200" :active="Tagsactive - 0" finish-status="success" align-center class="strpp">
                <el-step title="基本信息" />
                <el-step title="商品参数" />
                <el-step title="商品属性" />
                <el-step title="商品图片" />
                <el-step title="商品内容" />
                <el-step title="完成" />
            </el-steps>
            <!-- tags -->
            <el-form :model="Tabsform" :rules="rules" label-position="top" label-width="120px">
                <el-tabs :before-leave="beforeleave" tab-position=left v-model="Tagsactive" class="demo-tabs">
                    <el-tab-pane name="0" label="基本信息">
                        <el-form-item prop="goods_name" label="商品名称">
                            <el-input v-model="Tabsform.goods_name" />
                        </el-form-item>
                        <el-form-item prop="goods_price" label="商品价格">
                            <el-input v-model.number="Tabsform.goods_price" />
                        </el-form-item>
                        <el-form-item prop="goods_weight" label="商品重量">
                            <el-input v-model.number="Tabsform.goods_weight" />
                        </el-form-item>
                        <el-form-item prop="goods_number" label="商品数量">
                            <el-input v-model.number="Tabsform.goods_number" />
                        </el-form-item>
                        <!-- 级联选择器 -->
                        <el-form-item prop="goods_cat" label="商品分类">
                            <el-cascader clearable v-model="Tabsform.goods_cat" :options="catoptions" :props="catprops"
                                @change="handleChange" />
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane name="1" label="商品参数"></el-tab-pane>
                    <el-tab-pane name="2" label="商品属性"></el-tab-pane>
                    <el-tab-pane name="3" label="商品图片">
                        <el-upload 
                        :headers="headersobj"
                        :on-success="handlesuccess"
                            :action="httprul"
                            :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture">
                            <el-button type="primary">上传图片</el-button>
                            <template #tip>
                                <div class="el-upload__tip">
                                    图片大小应小于500kb
                                </div>
                            </template>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane name="4" label="商品内容"></el-tab-pane>
                    <el-tab-pane name="5" label="完成">
                        <el-button type="primary" @click="addnow">点击上传</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { apiGetparams } from '@/apis/params'
import { apiAddegoodslist } from '@/apis/goods'
import { ElInput, ElMessage, ElMessageBox } from 'element-plus'
import _ from 'lodash'
import router from '@/router'
let Tagsactive = ref('0')        //储存步骤条的切换
let httprul=ref('https://lianghj.top:8888/api/private/v1/upload')
let Tabsform = reactive({          //储存form表单的数据
    goods_name: '',
    goods_price: '',
    goods_weight: '',
    goods_number: '',
    goods_cat:[],            //储存级联选择器返回的值
    pics:[]
})
//图片上传组件的请求头
let headersobj=reactive({
    Authorization:
    window.sessionStorage.getItem('token')
})

           
let catoptions = ref([])            //储存级联选择器的数据
//预览图片函数
function handlePreview(){}
//保存图片的临时路径
function handlesuccess(res){
    // console.log(res.data.tmp_path);
    const picInfo={pic:res.data.tmp_path
    }
    Tabsform.pics.push(picInfo)
    // console.log(Tabsform.pics);
}
//移除图片函数
function handleRemove(file){
    const filepath=file.response.data.tmp_path
    const i= Tabsform.pics.findIndex(x=>
        x.pic===filepath
    )
    // console.log(i);
    Tabsform.pics.splice(i,1)
    console.log(Tabsform.pics);
}
//级联选择器配置
const catprops = reactive({
    expandTrigger: 'hover',
    value: 'cat_id',
    label: 'cat_name',
    children: 'children'
})
//获取参数列表
function getlist() {
    apiGetparams().then(res => {

        catoptions.value = res.data
        // console.log(catlist.value);
    })
}
getlist()
//tabs的钩子函数
function beforeleave(activeName, oldActiveName) {
    if (activeName != 0 && Tabsform.goods_cat.length === 0) {
        ElMessage({
            type: 'error',
            message: '请选择商品分类'
        })
        return false
    }
    else {
        return true
    }
}
//级联选择器改变时触发该函数
function handleChange() {
    if (Tabsform.goods_cat !== null) {
        if (Tabsform.goods_cat.length != 3) {
            Tabsform.goods_cat = []
            return
        }
        else {
        }
    }
    else {
        Tabsform.goods_cat = []
        return
    }
}
// 表单规则
const rules = reactive({
    goods_name: [
        { required: true, message: '请输入商品名称', trigger: 'blur' },
    ],
    goods_price: [
        { required: true, message: '请输入商品价格', trigger: 'blur' },
        { type: 'number', message: '价格必须是数字', trigger: 'blur' },
    ],
    goods_weight: [
        { required: true, message: '请输入商品重量', trigger: 'blur' },
        { type: 'number', message: '重量必须是数字', trigger: 'blur' },
    ],
    goods_number: [
        { required: true, message: '请输入商品数量', trigger: 'blur' },
        { type: 'number', message: '数量必须是数字', trigger: 'blur' },
    ],
    goods_cat: [
        { required: true, message: '请选择商品分类', trigger: 'blur' },
    ],
})
//上传
function addnow(){
  //深拷贝
  const form=_.cloneDeep(Tabsform)
  form.goods_cat=form.goods_cat.join(',')
//   console.log(form);
  apiAddegoodslist(form).then(res=>{
    console.log(res);
    router.push('/home/goods')
  })
}
</script>
<style  scoped>
.strpp {
    margin-left: 30px;
    margin-top: 20px;
    margin-bottom: 40px;
}

.el-form-item {
    margin-bottom: 40px;
}
</style>