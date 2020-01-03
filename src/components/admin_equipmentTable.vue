<template>
  <el-form :model="form" label-width="80px">
    <el-form-item label="姓名">
      <el-input v-model="form.name"></el-input>
    </el-form-item>

    <el-form-item label="专业">
      <el-input v-model="form.major"></el-input>
    </el-form-item>

    <el-form-item label="年级">
      <el-input v-model="form.grade"></el-input>
    </el-form-item>

    <el-form-item label="手机">
      <el-input v-model="form.phone"></el-input>
    </el-form-item>

    <el-form-item label="申请设备">
      <el-input v-model="form.equipName"></el-input>
    </el-form-item>

    <el-form-item label="申请时间">
      <el-link :underline="false"> &nbsp;&nbsp;&nbsp;&nbsp;{{ form.applyTime }}</el-link>
    </el-form-item>

    <el-form-item label="开始时间">
      <el-input v-model="form.startTime"></el-input>
    </el-form-item>

    <el-form-item label="结束时间" v-if="form.endTime">
      <el-input v-model="form.endTime"></el-input>
    </el-form-item>

    <el-form-item label="期限">
      <el-input v-model="form.needTime"></el-input>
    </el-form-item>

    <el-form-item label="借用原因">
      <el-input v-model="form.cause"></el-input>
    </el-form-item>

    <el-form-item label="详细原因">
      <el-input v-model="form.causeDetail"></el-input>
    </el-form-item>


    <el-form-item label="意见">
      <el-input v-model="form.advise"></el-input>
    </el-form-item>

    <el-form-item label="备注">
      <el-input v-model="form.note"></el-input>
    </el-form-item>

    <el-form-item label="当前状态">
      <el-link :underline="false">{{ form.status == 0 ? '待审批' : options[form.status].label }}</el-link>
    </el-form-item>

    <el-form-item label="操作">
      <el-select v-model="form.setStatus" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">{{item.label}}
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="意见">
      <el-button type="primary" @click="send">提交</el-button>
    </el-form-item>

  </el-form>
</template>
<script>
  import { approval } from '../api/adminApi.js';
  export default {
    name: 'equipmentTable',
    props:['form'],
    data(){
      return{
        options: [{
          value: '',
          label: '默认'
        }, {
          value: '1',
          label: '通过'
        }, {
          value: '2',
          label: '不通过'
        }, {
          value: '3',
          label: '在借'
        }, {
          value: '4',
          label: '归还'
        }, {
          value: '5',
          label: '逾期归还'
        }],
        value: ''
      }
    },
    methods:{
      send:function () {
        console.log(this.form);
        approval(this.form).then(res=>{
          if(res.data.status === 1){
            this.$message.success('提交成功');
            this.$emit('closeDialog');
            this.$emit('reload');
          }
        })
      }
    },
    mounted () {

    }
  }
</script>

<style scoped>

</style>
