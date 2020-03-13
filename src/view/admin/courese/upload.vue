<template>
  <el-form ref="form" :model="form" label-width="100px" style="width: 500px;">
    <el-form-item label="视频名称">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
<!--    <el-form-item label="主讲老师">-->
<!--      <el-input v-model="form.teacher"></el-input>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="视频介绍">-->
<!--      <el-input v-model="form.introduce"></el-input>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="课程名称">-->
<!--      <el-input v-model="form.className"></el-input>-->
<!--    </el-form-item>-->
    <el-form-item label="课程名称" prop="type">
      <el-select v-model="coureseChooseTyppe" placeholder="选择课程">
        <el-option
          v-for="(item,index) in typeArr"
          :key="item.teacher"
          :label="item.className"
          :value="item._id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="视频文件" prop="read">
      <el-upload
        class="avatar-uploader" name="fileName"
        :action="uploadCoureseVideoUrl"
        :data="form" :headers="uploadHeader"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :on-progress="uploadVideoProcess"
        :before-upload="beforeAvatarUpload"
      >
        <video width="148" class="avatar" controls="controls"
               v-if="videoUrl"
               :src="'http://stusystem.dfi.ac.cn/stuInfoSystem/courese/video/'+videoUrl"
               >
          您的浏览器不支持视频播放
        </video>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <el-progress v-if="videoFlag" type="circle" :percentage="videoUploadPercent" class="progress" style="margin-top:30px;"></el-progress>
      </el-upload>
    </el-form-item>

<!--    <el-form-item label="上传时间">-->
<!--      <el-col :span="15">-->
<!--        <el-date-picker type="datetime" placeholder="选择日期" v-model="form.uploadDate" style="width: 100%;"></el-date-picker>-->
<!--      </el-col>-->
<!--    </el-form-item>-->

    <el-form-item label="排序" >
      <el-input v-model="form.rank" type="number"></el-input>
    </el-form-item>

    <el-form-item label="阅读量">
      <el-input v-model="form.readNum" type="number"></el-input>
      <label class="info"><small>不建议修改~</small></label>
    </el-form-item>

    <el-form-item label="发布">
      <el-switch on-text="" off-text="" v-model="form.putAway"></el-switch>
    </el-form-item>

    <el-form-item>
      <el-button :disabled="videoFlag" type="primary" @click="send()">立即更新</el-button>
    </el-form-item>
  </el-form>

<!--&lt;!&ndash;  测试视频截图&ndash;&gt;-->
<!--  <el-form-item ref="videocontentvideo" style="display:none;">-->
<!--    <img :src="imgurl">-->
<!--    <video width="320" height="240" controls id="upvideo">-->
<!--    </video>-->
<!--    <img :src="modlevidel" />-->
<!--  </el-form-item>-->
<!--  <el-form-item class="upload-demo-content" v-show="formLabelAlign.type==2">-->
<!--    <el-upload class="upload-demo" :limit="1" :on-exceed="exceedhandle" drag :file-list="filsListArray" :action="configuploadurl" :on-success="successuploadhandle" accept="video" name="fileList" :before-upload="beforeUploadVideo">-->
<!--      <i class="el-icon-upload"></i>-->
<!--      <div class="el-upload__text">将视频文件拖到此处，或-->
<!--        <em>点击上传</em>-->
<!--      </div>-->
<!--      <div class="el-upload__tip" slot="tip"></div>-->
<!--    </el-upload>-->
<!--  </el-form-item>-->


</template>

<script>
  import { uploadCourese,uploadCoureseVideoUrl,editCourese,getCourese,getCoureseType,delCourese } from '../../../api/adminApi';

  export default {
    name: 'activity',
    data(){
      return{
        uploadCoureseVideoUrl:uploadCoureseVideoUrl,
        videoUrl:'',
        uploadHeader:{},typeArr:[],coureseChooseTyppe:'',videoFlag:false,videoUploadPercent:0,
        form: {
          putAway:true,
          title: '',
          readNum: 1,
          like: 0,
          date: '',
          banner: '',
          type:{},
          allDownloads: [],
        }
      }
    },
    watch:{
      coureseChooseTyppe:function (item) {
        console.log('coureseChooseTyppe',item);
      }
    },
    methods:{
      uploadVideoProcess(event, file, fileList){
        this.videoFlag = true;
        this.videoUploadPercent = Number(file.percentage).toFixed(0);
      },
      fetchCoureseType(){
        getCoureseType().then((res) => {
          var types = res.data.data;

          this.typeArr = types;
          console.log('getCoureseType',this.typeArr )
        });
      },
      fetch(){
        let data ={};
        let query = this.$route.query.data ;
        if(query){
          data._id = query._id;
          console.log('data',data);
          this.videoUrl = query.url;
          getCourese(data).then(res =>{
            console.log('getCourese',res)

              this.form = res.data.coureseVideo[0];
            this.coureseChooseTyppe = this.form.type._id

          })
        }

      },
      handleAvatarSuccess(res) {
        this.videoFlag = false;
        this.videoUploadPercent = 0;
        console.log(res)
        let video = res.data.fileName;
        this.videoUrl = video;
        this.form.url = video;
      },
      beforeAvatarUpload(file) {
        this.form.name = file.name.replace(/.mp4$/,'');
      },
      send(){
        this.form.type = getItemFormArr(this.typeArr,this.coureseChooseTyppe,'_id');
        console.log('this.form',this.form)
        if(!this.form._id){
          uploadCourese(this.form).then(res=>{
            console.log(res)
            if(res.status ===1){
              this.$message.success('上传成功!');
              this.$router.push({path: '/@admin/courese/'});
            }else {
              this.$message.error('上传失败,请重试!');
            }
          })
        }else{
          editCourese(this.form).then(res=>{
            console.log(res)
            if(res.status ===1){
              this.$message.success('修改成功!');
              this.$router.push({path: '/@admin/courese/'});
            }else {
              this.$message.error('修改失败,请重试!');
            }
          })
        }

      },

    },
    mounted () {
      this.uploadHeader.Authorization = sessionStorage.getItem('admin');
      this.fetchCoureseType();
      this.fetch();
    }
  }

  function getItemFormArr(data,value,name) {
      for(let item in data){
        console.log('item',item)
        if(data[item][name] == value){
          return data[item];
        }
      }
  }
  function getKeyFormArr (data,value,name) {
    for(let item in data){
      console.log('item',item)
      if(data[item][name] == value){
        return data[item][name];
      }
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
  .progress{
    margin-top: 30px;
    position: absolute;
    z-index: 99;
    left: 25px;
    top: 0;
    background: white;
  }
</style>
