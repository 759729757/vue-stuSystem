<template>
  <el-form :model="form" label-width="80px">

    <el-form-item label="照片" v-if="form.face_photo.length">
        <div class="block" v-for="item in form.face_photo" :key="item">
          <el-avatar shape="square" :size="100" fit="fill" :src="headImg+item"></el-avatar>
        </div>
    </el-form-item>

    <el-form-item label="姓名">
      <el-input v-model="form.name"></el-input>
    </el-form-item>

    <el-form-item label="学号">
      <el-input v-model="form.stuNum"></el-input>
    </el-form-item>

    <el-form-item label="年级">
      <el-input v-model="form.grade"></el-input>
    </el-form-item>

    <el-form-item label="专业">
      <el-input v-model="form.major"></el-input>
    </el-form-item>

    <el-form-item label="班级">
      <el-input v-model="form.classNum"></el-input>
    </el-form-item>

    <el-form-item label="手机">
      <el-input v-model="form.phone"></el-input>
    </el-form-item>

    <el-form-item label="绑定微信">
      <el-link :underline="false" :type="form.creativeOpenid ? 'success' : 'info'"> {{ form.creativeOpenid ? '已绑定':'未绑定' }} </el-link>
    </el-form-item>

    <el-form-item label="微信昵称" v-if="form.wxnickname">
      <el-link type="warning" :underline="false">{{ form.wxnickname }}</el-link>
    </el-form-item>

    <el-form-item label="微信头像" v-if="form.avatarUrl">
      <el-avatar shape="square" :size="100" fit="fill" :src="form.avatarUrl"></el-avatar>
    </el-form-item>

    <el-form-item label="修改信息">
      <el-button type="primary" plain @click="update">更新</el-button>
      <el-button type="danger" icon="el-icon-delete" circle @click="deleteOne(form._id)"></el-button>
    </el-form-item>

  </el-form>
</template>
<script>
  import { headImg,delOneUser,updateUser } from '../api/adminApi.js';
  export default {
    name: 'stuInfo',
    props:['form'],
    data(){
      return{
        value: '',headImg:'',
       url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      }
    },
    methods:{
      update:function(){
        console.log(this.form);
        updateUser(this.form).then(res=>{
          if(res.data.status === 1){
            this.$message.success('更新成功！')
            this.$emit('closeDialog');
            this.$emit('reload');
          }
        })
      },
      deleteOne:function (id) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delOneUser({ _id:id }).then( res=>{
            if(res.data.status === 1){
              this.$message.success('删除成功！')
              this.$emit('closeDialog');
              this.$emit('reload');
            }
          } )

        });
      }
    },
    mounted () {
      this.headImg = headImg;
    }
  }
</script>

<style scoped>
  .block{flex: 1; display: flex; flex-direction: column; flex-grow: 0;float: left;margin: 0 10px;}
  .flex{display: flex;flex-direction: row;}

</style>
