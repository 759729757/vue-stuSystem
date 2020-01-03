<template>
  <el-container>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filter">
        <el-form-item>
          <el-input v-model="filter.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filter.stuNum" placeholder="学号"></el-input>
        </el-form-item>
        <el-form-item>
          <!--<el-input v-model="filter.grade" placeholder="年级"></el-input>-->
          <el-autocomplete
            class="inline-input"
            v-model="filter.grade"
            :fetch-suggestions="queryGrade"
            placeholder="年级"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-autocomplete
            class="inline-input"
            v-model="filter.major"
            :fetch-suggestions="queryMajor"
            placeholder="专业"
          ></el-autocomplete>
          <!--<el-input v-model="filter.major" placeholder="专业"></el-input>-->
        </el-form-item>

        <el-form-item>
          <el-button type="primary" v-on:click="fetch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>



  </el-container>

</template>

<script>
  import { getOneUser } from '../../../../src/api/adminApi.js';
  import { oldLecture,lecture } from '../../../../src/api/api.js';
  export default {
    name: 'lectureStatistics',
    data(){
      return{
        filter: {
          name: '',page:0,
        },
        count:0,
        users:[],
        restaurantsMajor:[{value:'中德合作办学项目'}],//专业内容提示
        restaurantsGrade:[{value:'2016'},{value:'2017'},{value:'2018'},{value:'2019'}],//专业内容提示

      }
    },
    methods:{
      queryMajor(queryString, cb) {
        // 调用 callback 返回建议列表的数据
        cb(this.restaurantsMajor);
      },
      queryGrade(queryString, cb) {
        // 调用 callback 返回建议列表的数据
        cb(this.restaurantsGrade);
      },
//获取列表
      fetch: function () {
        this.loading = true;
        getOneUser(this.filter).then((res)=>{
          console.log(res)
          this.loading = false;
          this.count = res.data.count;
          this.users = res.data.users;

        })
      },

    },
    mounted () {

    }
  }
</script>

<style scoped>

</style>
