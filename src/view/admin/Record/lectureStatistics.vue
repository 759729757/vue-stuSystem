<template>
  <el-container>
    <!--工具条-->
    <el-header :span="24" class="toolbar" style="padding-bottom: 0px;">
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
        <el-form-item v-if="users.length">
          <download-excel
            class = "export-excel-wrapper"
            :data = "users"
            :fields = "json_fields"
            :name = "excelName">
            <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
            <el-button type="primary" size="small">导出EXCEL</el-button>
          </download-excel>
        </el-form-item>
      </el-form>
    </el-header>

    <!--列表-->
    <el-main>
      <el-tag type="info" v-if="count">共找到 {{count}} 人</el-tag>
      <el-table :data="users" highlight-current-row v-loading="loading" height="80vh" stripe>
        <el-table-column type="index" width="60">				</el-table-column>

        <el-table-column prop="name" label="姓名" width="100" sortable>			</el-table-column>

        <el-table-column prop="stuNum" label="学号" width="150"  sortable>				</el-table-column>

        <el-table-column prop="grade" label="年级" width="100" sortable>				</el-table-column>

        <el-table-column prop="major" label="专业" width="250" sortable>        </el-table-column>

        <el-table-column prop="guojiTimes" label="国际设计与创新趋势" width="150" sortable>        </el-table-column>

        <el-table-column prop="alltimes" label="就业指导" width="150" sortable>        </el-table-column>


      </el-table>
    </el-main>




  </el-container>

</template>

<script>
  import { getAllStuInfo } from '../../../../src/api/adminApi.js';
  import { oldLecture,lecture } from '../../../../src/api/api.js';
  export default {
    name: 'lectureStatistics',
    data(){
      return{
        filter: {
          name: '',page:0,grade:''
        },
        loading:false,
        count:0,
        users:[],
        restaurantsMajor:[{value:'中德合作办学项目'}],//专业内容提示
        restaurantsGrade:[{value:'2016'},{value:'2017'},{value:'2018'},{value:'2019'}],//专业内容提示
        excelName:'设计学院讲座记录统计（'+new Date().toDateString()+'）.xls',

        json_fields: {
          "姓名": "name",    //常规字段
          "学号": "stuNum", //支持嵌套属性
          "年级": "grade", //支持嵌套属性
          "专业": "major", //支持嵌套属性
          "国际设计与创新趋势（中德）": "guojiTimes", //支持嵌套属性
          "就业指导（其他）": "alltimes", //支持嵌套属性
          // "头部-损坏区域代码": {
          //   field: "phone.landline",
          //   //自定义回调函数
          //   callback: value => {
          //     return `损坏区域代码 - ${value}`;
          //   }
          // }
        },
        json_meta: [
          [
            {
              " key ": " charset ",
              " value ": " utf- 8 "
            }
          ]
        ]


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
        this.users=[];
        getAllStuInfo(this.filter).then((res)=>{
          console.log('getAllStuInfo',res)
          this.count = res.data.data.length;
          // this.users = res.data.users;
          let users = res.data.data;

          let page=0;const limit = 20;

          if(!users.length){
            this.$message({
              type:'warning',
              message:'找不到数据'
            })
            this.loading = false;
          }
          for(var i=0;i<users.length;i++){
            this.acount(users[i]);
          }
        })
      },
      acount:function (stu) {
        stu.stuNum = stu.stuNum.replace(/a$/,'');
        let alltimes = 0,jiuyeTimes = 0,guojiTimes =0;

          oldLecture({stuNum:stu.stuNum}).then(res =>{
            console.log('oldLecture',res)
            alltimes = res.data.times || 0;
            jiuyeTimes = jiuyeTimes + res.data.times || 0;
            lecture({stuNum:stu.stuNum}).then(res=>{
              console.log('lecture',res)
              let { lecture } = res.data
              if(lecture.length){
                for(var j=0;j<lecture.length;j++){
                  if(lecture[j].lecture.indexOf('【就业指导】') != -1){
                    jiuyeTimes++;
                  }else {
                    guojiTimes++;
                  }
                }
              }

              alltimes = alltimes+lecture.length;//总次数
              stu.alltimes = alltimes;
              stu.guojiTimes = guojiTimes;//就业指导次数
              this.users.push(stu);
              if(this.users.length === this.count ){
                this.loading = false;
              }
            },err=>{
              console.log('lecture err',err);
              stu.alltimes = '查询失败';
              stu.guojiTimes = '查询失败';//就业指导次数
              this.users.push(stu);
              if(this.users.length === this.count ){
                this.loading = false;
              }
            })
          },err=>{
            console.log('oldLecture err',err);
          })



      },

    },
    mounted () {

    }
  }
</script>

<style scoped>

</style>
