<template>
 <section>
   <div class="container">
     <div class="cells">
       <div class="head-img">
         <img v-if="avatarUrl" :src="avatarUrl">
         <p style="text-align: center;">
           <a style="font-size: xx-small;"
              href="javascript:window.parent.window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx278a74864dbbeadd&redirect_uri=http://de.bnuz.edu.cn/interchangeSpace/recordinfo&response_type=code&scope=snsapi_userinfo#wechat_redirect'">
             更新头像信息
           </a>
         </p>
       </div>
       <div class="cells-text">
         <p><strong>姓名：</strong>{{ name }}</p>
         <p><strong>学号：</strong>{{ stuNum|stuNum }}</p>
         <p><strong>年级：</strong>{{ grade }}</p>
         <p><strong>专业：</strong>{{ major }}</p>
       </div>
     </div>
     <div class="cells cells-bd">
       <div class="cells-icon">
         <img src="http://de.bnuz.edu.cn/stuInfoSystem/images/shebei.png" alt="">
       </div>
       <div class="cells-text normal">
         <a href="javascript:void(0)" @click="toEquRecord">设备借用记录</a>
       </div>
     </div>
     <div class="cells cells-bd">
       <div class="cells-icon">
         <img src="http://de.bnuz.edu.cn/stuInfoSystem/images/touxiang.png" alt="">
       </div>
       <div class="cells-text normal">
         <a href="javascript:void(0)" @click="toFaceReco">面部识别</a>
       </div>
     </div>
     <div class="cells cells-bd">
       <div class="cells-icon">
         <img src="http://de.bnuz.edu.cn/stuInfoSystem/images/kaoqing.png" alt="">
       </div>
       <div class="cells-text normal">
         <a href="javascript:void(0);" @click="toLecture" >讲座考勤</a>
       </div>
     </div>
     <div class="cells cells-bd">
       <div class="cells-icon">
         <img src="http://de.bnuz.edu.cn/stuInfoSystem/images/video.png" alt="">
       </div>
       <div class="cells-text normal">
         <a href="javascript:void(0);" @click="toCourese" >MOOC of Brand University</a>
       </div>
     </div>
     <!--<div class="cells cells-bd">-->
       <!--<div class="cells-icon">-->
         <!--<img src="http://de.bnuz.edu.cn/stuInfoSystem/images/zhiyuanshi.png" alt="">-->
       <!--</div>-->
       <!--<div class="cells-text normal">-->
         <!--<a href="javascript:void(0);" @click="toVolunteer" >志愿时查询</a>-->
       <!--</div>-->
     <!--</div>-->
     <!--<div class="cells">-->
       <!--<div class="cells-icon">-->
         <!--<img src="http://de.bnuz.edu.cn/stuInfoSystem/images/yijian.png" alt="">-->
       <!--</div>-->
       <!--<div class="cells-text normal">-->
         <!--<a href="javascript:void(0);" @click="toOptions" >意见反馈</a>-->
       <!--</div>-->
     <!--</div>-->

   </div>
 </section>
</template>

<script>
  import { getUser } from '../../../api/api';
  export default {
    name: 'index',
    data(){
      return{
        openId:'',grade:'',stuNum:'',name:'',major:'',phone:'',avatarUrl:''
      }
    },
    filters:{
      stuNum:function (val) {
        return val.replace(/a$/,'');
      }
    },
    mounted(){
      getUser()
        .then(res => {
          console.log(res)
          let { status,mess,user } = res.data;
          this.openId = user.creativeOpenid;
          this.grade = user.grade;
          this.stuNum = user.stuNum;
          this.name = user.name;
          this.major = user.major;
          this.phone = user.phone;
          this.avatarUrl = user.avatarUrl;

          console.log(status)
        })
    },
    methods:{
      toCourese:function(){
        this.$router.push({ path: '/courese/' });
      },
      toEquRecord:function () {
        this.$router.push({ path: '/equipment/equRecordList' });
      },
      toFaceReco:function () {
        this.$router.push({ path: 'faceId' });
      },
      toLecture:function () {
        this.$router.push({ path: '/tools/' });
      },
      toVolunteer:function () {
        this.$router.push({ path: '/tools/volunteer' });
      },
      toOptions:function () {
        this.$router.push({ path: '/equRecordList' });
      }
    }
  }
</script>

<style scoped>

</style>
