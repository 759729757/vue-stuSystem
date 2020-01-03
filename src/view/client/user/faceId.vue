<template>
  <section>
    <div class="cells cells-bd">
      <div class="cells-left-btn" @click="$router.go(-1)">
        <i class="back-icon" ></i>
      </div>
      <div class="cells-title ">
        面部识别
      </div>
    </div>
    <div v-if="!record">
      <div v-if="!face_photo.length">
        <div class="cells cells-bd header">
          <div class="cells-text normal ">
            <a href="">你还没有录入面部信息</a>
          </div>
        </div>
        <div class="container">
          <div class="cells cells-bd">
            <div class="cells-icon">
              <img src="http://stusystem.dfi.ac.cn/stuInfoSystem/images/touxiang.png" alt="">
            </div>
            <div class="cells-text normal ">
              <a href="javascript:void(0);">点此添加</a>
            </div>
          </div>
        </div>
      </div>

      <div v-else>

        <div class="container">
          <div class="cells cells-list">
            <div class="cells ">
              <div class="cells-icon">
                <img src="http://stusystem.dfi.ac.cn/stuInfoSystem/images/touxiang.png" alt="">
              </div>
              <div class="cells-text normal ">
                <strong>已录入本人面部照片：</strong>
              </div>
            </div>
            <div class="cells-grid" v-for="item in face_photo"
                 :style="'background-image: url(http://stusystem.dfi.ac.cn/stuInfoSystem/images/userFacePic/'+ item + ')'"></div>
          </div>


          <div class="cells" v-if="face_photo.length < 3" @click="record=true">
            <div class="cells-icon">
              <img src="http://stusystem.dfi.ac.cn/stuInfoSystem/images/add.png" alt="">
            </div>
            <div class="cells-text normal ">
              <a href="javascript:void(0);">继续添加</a>
            </div>
            <div class="weui-footer moveInaminate">
              <p class="weui-footer__text">请认真录入，添加后不可修改</p>
            </div>
          </div>

        </div>

        <div class="weui-btn-area moveInaminate">
          <a class="weui-btn weui-btn_primary" type="button"  target="_blank" href="javascript:void (0)">
            已完成录入操作</a>
        </div>
        <div class="weui-footer moveInaminate">
          <p class="weui-footer__text">照片信息将用于“耦合空间”门禁设备及其他教学辅助系统</p>
        </div>
      </div>
    </div>
    <div v-else>
      <form style="padding-top: 20px;">
        <h4>个人信息</h4>
        <table>
          <tr>
            <td>姓名</td>
            <td>
              <input class="info" type="text" name="photoNo" id="photoNo" v-model="face_photo.length"  hidden>
              <input class="info" type="text" v-model="name">
            </td>
          </tr>
          <tr>
            <td>学号</td>
            <td>
              <input class="info" type="text" id="stuNum" name="stuNum"  v-model="stuNum" >
            </td>
          </tr>
          <tr>
            <td>专业</td>
            <td>
              <input class="info" type="text" name="major" v-model="major" >
            </td>
          </tr>
        </table>
        <p>为保证识别准确率,<br>请选择 <strong>五官清晰，不包含他人头像的图片。</strong></p>
        <p>点击以下图标拍照或选择图片（若选择图片失败可尝试使用相机自拍）</p>

        <label class="headImgWarp" for="headPic">
          <hr class="scanline scan">
          <div class="scanhini scan">
            <span class="loading" id="loadHini">
                正在上传中....
            </span>
          </div>
          <span class="before"></span>
          <img id="showPic" src="http://stusystem.dfi.ac.cn/stuInfoSystem/images/headIcon.svg" />
          <span class="after"></span>
        </label>

        <input type="file" name="headPic" accept="image/*" id="headPic" v-on:change="setFile" hidden>
        <button type="button" class="btn" @click="sendData" > 上 传</button>
        <button type="button" class="btn btn-prev" @click="record = false"> 取 消</button>

      </form>
    </div>


  </section>
</template>

<script>
  import { getUserDetail , register } from '../../../api/api';
  import '../../../../static/js/LocalResizeIMG.js';
  export default {
    name: 'faceId',
    data(){
      return{
        openId:'',grade:'',stuNum:'',name:'',major:'',phone:'',avatarUrl:'',
        face_photo:[],
        record:false,

        file:'',fileData:''

      }
    },
    methods:{
       sendData:function(){
         let file = this.file;
          if(!file){alert('请添加图片');return false;}
          var data = new FormData();
          //         data.append('headPic',headPic);
          data.append('headPic',file);
          data.append('stuNum',$('#stuNum').val());
          data.append('photoNo',Number(this.face_photo.length)+1);

         register(data).then(res=>{
           console.log(res);
           if(res.status == 1){
//                    成功
             getUserDetail().then(res=>{
               let { user } = res.data;
               this.face_photo = user.face_photo;
                this.record = false;
               alert("添加成功！");
             })
           }else if(res.status == -1){
//              学号不匹配
             alert("添加失败，学号不匹配！");
           }else{
//                    其他错误(找不到头像)，建议重试
             alert("添加失败，请重新尝试！");
           }
         })

        },

      setFile:function(img){
        console.log(img)
        // $('#loadHini').text('正在读取中....');
        // $( ".scan" ).show();
        // var imgurl = getObjectURL(img.files[0]);
        // $('#showPic').attr('src',imgurl);
      }
    },
    // watch:{
    //   fileData (val) {
    //     console.log(val)
    //   }
    // },
    mounted () {
      //压缩图片
      var self = this;
      $('input:file').localResizeIMG({
        width: 600,
        quality: 1,
        success: function (result) {
          console.log('result',result);
          $('#showPic').attr('src',result.base64);
          var blob = dataURLtoBlob(result.base64);
          self.file = blobToFile(blob, 'headImg');
          console.log('file',self.file);

        }
      });
      getUserDetail().then(res=>{
        let { status,mess,user } = res.data;
        console.log('detail',user);
        this.openId = user.creativeOpenid;
        this.grade = user.grade;
        this.stuNum = user.stuNum.replace(/a$/,'');
        this.name = user.name;
        this.major = user.major;
        this.phone = user.phone;
        this.avatarUrl = user.avatarUrl;
        this.face_photo = user.face_photo;


      })
    },

  }


  //将base64转换为blob
  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
  //将blob转换为file
  function blobToFile(theBlob, fileName){
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

</script>

<style scoped>
  *{font-family: "微软雅黑";}
  form{display: flex;flex-direction: column;align-items: center;justify-content: center;}
  img{width: 100%;}
  .headImgWarp{width: 50%;padding:1em 4em;position: relative;margin: 10px 0;}
  .headImgWarp:after,.headImgWarp:before,.headImgWarp .before,.headImgWarp .after
  { content: " ";display: block;width: 10%;
    height: 10%;position: absolute;border-color: #64af28;border-style: solid;}
  .headImgWarp:before{left: 0;top:0;border-width: 5px 0 0 5px;}
  .headImgWarp:after{right: 0;bottom: 0;border-width: 0 5px 5px 0;}
  .headImgWarp .after{right: 0;top: 0;border-width:  5px 5px 0 0;}
  .headImgWarp .before{left: 0;bottom: 0;border-width: 0 0 5px 5px;}
  .scanline{width: 90%;;position: absolute;left: 4%;border-color: #64af28;
    border-width:0 0 3px 0;top: 5%;
    animation: scan 2s ease infinite;
    -o-animation: scan 2s ease infinite;
    -webkit-animation: scan 2s ease infinite;
  }
  @keyframes scan {
    0%{top: 5%;}
    50%{top: 90%;}
    100%{top:5%;}
  }
  @-webkit-keyframes scan {
    0%{top: 5%;}
    50%{top: 90%;}
    100%{top:5%;}
  }
  @-o-keyframes scan {
    0%{top: 5%;}
    50%{top: 90%;}
    100%{top:5%;}
  }
  .scanhini{text-align: center;
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: 0;
    font-size: 20px;
    margin: 0;
    vertical-align: middle;
    background-color: rgba(0,0,0,.1);
  }
  .scanhini span{width: 100%;text-align: center;position: absolute;left: 0;
    background-color: rgba(0,0,0,.2)}
  .scan{display: none;}
  .btn{
    width: 90%;margin: 20px 5%;
    border-radius: 5px;
    background-color: #64af28;
    height: 3em;line-height: 3em;
    color: white;font-weight: bold;font-family: "微软雅黑";
    font-size:16px;text-align: center;
    border: none;
  }
  input{outline: none;border: none;background: none;}
  .info{
    width: 90%;text-align: left;padding-left:10px;box-sizing: border-box;
    font-size: 16px;height: 2.5em;line-height: 3em;
  }
  table{    border-collapse: collapse;margin: 50px auto;margin-top: 0;}
  td{
    border-width: 0 0 2px 0;border-color: #0bb20c;border-style:solid;
  }
  td:first-child{border-right: dashed #ccc 1px ;padding: 5px 1em;text-align: right;}
  p{margin: 5px 5%;text-align: left;width: 90%;}
  .btn-prev{background-color: darkorange;color: white;margin-top: 0;}
</style>
