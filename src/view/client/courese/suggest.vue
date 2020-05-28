<template>
  <div>
    <banner></banner>

    <el-form style="margin-top: 60px;" label-width="80px" ref="editForm">
      <h3 style="text-align: center;margin-bottom: 20px;">Suggestion box </h3>

      <el-form-item label="Capture:">
        <el-upload
          class="avatar-uploader" name="fileName"
          :action="uploadCoureseImageUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">

          <img v-if="imageUrl" :src="'http://de.bnuz.edu.cn/stuInfoSystem/courese/suggest/'+imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-input class="el-textarea"
        type="textarea"
        :rows="4"
        placeholder="Please write down your problems"
        v-model="suggest">
      </el-input>
      <div class="text-center">
        <el-button type="success" @click="upload">Upload</el-button>
      </div>
    </el-form>

    <courseFooters class="footer"></courseFooters>
  </div>

</template>

<script>
  import banner from '../../../components/course/course_banner';
  import footer from '../../../components/course/footer';
  import { uploadSuggest,uploadCoureseImageUrl } from '../../../api/api';

  export default {
    name: 'suggest',
    components: {
      banner:banner,
      courseFooters:footer
    },
    data(){
      return{
        uploadCoureseImageUrl:uploadCoureseImageUrl,
        suggest:'',imageUrl:'',
      }
    },
    methods:{
      upload(){
        uploadSuggest({
          content:this.suggest,
          image:this.imageUrl
        }).then(res=>{
          this.loading = this.$message({
            showClose: true,
            duration:'3000',
            type:'success',
            message: 'We have received your comments'
          });
          let self = this;
          setTimeout(function () {
            self.$router.push('/courese/')
          },1000)
        })
      },
      handleAvatarSuccess(res) {
        console.log(res)
        let image = res.data.fileName;
        this.imageUrl = image;
        this.loading.close();
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 8;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 8MB!');
        }
        this.loading = this.$message({
          showClose: true,
          duration:'30000',
          message: '上传中...'
        });
        return isJPG && isLt2M;
      },
    },
    mounted () {

    }

  }
</script>

<style scoped>
.footer{width: 100%;position: fixed;left: 0;bottom: 0;}
  .el-textarea{margin: 15px;width: calc(100% - 30px);}
  .text-center{text-align: center;}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
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
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
  .el-icon-plus.avatar-uploader-icon{border: #ccc solid 1px;}
</style>
