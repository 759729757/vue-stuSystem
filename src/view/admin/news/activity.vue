<template>
  <el-form ref="form" :model="form" label-width="100px" style="width: 500px;">
    <el-form-item label="活动名称">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="封面海报" prop="read">
      <el-upload
        class="avatar-uploader" name="image"
        :action="uploadImageUrl"
        :data="form"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="'http://stusystem.dfi.ac.cn/stuInfoSystem/images/news/'+imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>

    <el-form-item label="活动时间">
      <el-col :span="15">
        <el-date-picker type="datetime" placeholder="选择日期" v-model="form.date" style="width: 100%;"></el-date-picker>
      </el-col>
    </el-form-item>

    <el-form-item label="点赞数">
      <el-input v-model="form.like" type="number"></el-input>
    </el-form-item>


    <el-form-item label="阅读量">
      <el-input v-model="form.read" type="number"></el-input>
      <label class="info"><small>不建议修改~</small></label>
    </el-form-item>

    <el-form-item label="刷新后台图片">
      <el-button type="warning" plain @click="updateAlbum()">刷 新</el-button>
      <br>
      <label class="info"><small>用于删除图片后手动刷新数据</small></label>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="send()">立即更新</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
  import { editInfo,uploadImageUrl,updateAlbum } from '../../../../src/api/adminApi.js';
  import { fetchPhoto } from '../../../../src/api/api.js';
  export default {
    name: 'activity',
    data(){
      return{
        uploadImageUrl:uploadImageUrl,
        imageUrl:'',
        form: {
          title: '',
          read: 0,
          like: 0,
          date: '',
          banner: '',
          allDownloads: [],
        }
      }
    },
    methods:{
      updateAlbum(){
        updateAlbum().then(res=>{
          let {status} = res.data;
          if(status ===1){
            this.$message.success('修改成功！');
          }
        })
      },
      fetch(){
        let data ={_ : new Date().valueOf()}
        fetchPhoto(data).then(res =>{
          console.log(res)
          let { active } = res.data.data;
          this.form = active;
          this.imageUrl = active.banner;
        })
      },
      handleAvatarSuccess(res) {
        let image = res.image;
        this.imageUrl = image;
        this.form.banner = image;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      send(){
        console.log('this.form',this.form)
        editInfo(this.form).then(res=>{
          if(res.data.status ===1){
            this.$message.success('修改成功!');
            this.fetch();
          }else {
            this.$message.error('修改失败,请重试!');
          }
        })
      },

    },
    mounted () {
      this.fetch();
    }
  }
</script>

<style>
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
