<template>
  <el-form ref="form" :model="form" label-width="80px" style="width: 500px;">
    <el-form-item label="管理员">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="联系方式">
      <el-input type="tel" v-model="form.phone"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="update()">设置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import { updateEquManager,equManager } from '../../../api/adminApi';
  export default {
    name: 'manager',
    data(){
      return{
        form:{}
      }
    },
    methods:{
      update:function(){
        updateEquManager(this.form).then(res=>{
          if(res.data.status === 1){
            this.$message.success('修改成功');
            this.fetch();
          }else {
            this.$message.error('请重试');
          }
        })
      },
      fetch:function () {
        equManager().then( res =>{
          this.form = res.data.data;
        })
      }
    },
    mounted () {
      this.fetch();
    }
  }
</script>

<style scoped>

</style>
