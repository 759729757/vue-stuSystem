<template>
  <section>

    <el-table
      :data="coureseData"
      class="table">
      <el-table-column
        prop="name"
        label="视频名称"
        width="350">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="teacher"-->
<!--        label="主讲老师" align="center"-->
<!--        width="180">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="rank" sortable
        label="排序" align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="readNum" sortable
        label="阅读量" align="center"
        width="180">
      </el-table-column>
      <el-table-column
        label="发布" align="center"
        width="180">
        <template slot-scope="scope">
          {{ scope.row.putAway ? '发布' : '不发布' }}
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-link type="primary"  v-on:click="edit(scope.row)" >编辑</el-link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-link type="danger"  v-on:click="del(scope.row)" >删除</el-link>
        </template>
      </el-table-column>

    </el-table>
    <!--翻页工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
      </el-pagination>

    </el-col>
  </section>
</template>

<script>
  import { editCourese,getCourese,delCourese } from '../../../api/adminApi';

  export default {
    name: 'activity',
    data(){
      return{
        total: 0,
        page: 1,
        videoUrl:'',
        uploadHeader:{},
        coureseData:[]
      }
    },
    methods:{

      handleCurrentChange(val) {
        this.page = val;
        this.fetch();
      },

      fetch(){
        let data ={page:this.page};

        getCourese(data).then(res =>{
          console.log('getCourese',res)
          this.total = res.data.allCount;
          this.coureseData = res.data.coureseVideo
        })
      },

       edit(data){
         this.$router.push({path: '/@admin/courese/edit',query:{ data:data}});
       },

      del(data){
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          var id = data._id;
          delCourese({_id:id }).then((res) => {
            console.log('delCourese',res)
            if(res.data.status ===1){
              this.$message.success('删除成功!');
              this.fetch();
            }
          })
        }).catch((e) => {
          console.log(e);
        });
      },

    },
    mounted () {
      this.uploadHeader.Authorization = sessionStorage.getItem('admin');
      this.fetch();
    }
  }
</script>

<style>
  .table{width: 100%;height: 80vh;overflow-y: scroll;}
  .avatar{width: auto!important;}
  .avatar-uploader .el-upload {
    border: 1px dashed #333;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #333;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
