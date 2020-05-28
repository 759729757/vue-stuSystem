<template>
  <section class="cover">
      <div class="toptitle">
        <!--<img class="logoimg" src="http://de.bnuz.edu.cn/image/balogo.png">-->
        <h2 class="title">志愿时查询</h2>
      </div>

      <!--<h5 style="color: white">本学期更新至03.03号讲座</h5>-->
      <div class="toggle sendApply">
        <input placeholder="学号" type="" v-model="stuNum" id="schoolNum">
        <!--<input placeholder="身份证号" id="ID">-->
        <button type="button" onclick="getinfo()">查 询</button>
        <p class="text-center"><a href="javascript:void(0);"  onclick="$('.sendApply').toggle('fast');">提交志愿时</a></p>
      </div>

      <div class="info toggle" hidden>
        <p class="icon" onclick="$('.toggle').toggle('fast');">
          <img src="http://de.bnuz.edu.cn/image/icon_up.png" class="back">
        </p>
        <ul >
          <li>
            <span><strong>姓名：</strong></span><span id="name">{{name}}</span>
          </li><li>
          <span><strong>学号：</strong></span><span id="schoolNum1">{{stuNum}}</span>
        </li><li>
          <span><strong>专业：</strong></span><span id="major">{{major}}</span>

        </li>
          <li id="timesWarp">
            <span><strong>总志愿时数：</strong></span><span id="times">{{times}}</span>

          </li><li>
          <span id="lecture"><strong>志愿者项目记录：</strong></span><span id="detail"></span>
        </li>
        </ul>
      </div>

      <div class="sendApply" hidden>
        <p class="icon" onclick="$('.sendApply').toggle('fast');">
          <img src="http://de.bnuz.edu.cn/image/icon_up.png" class="back">
        </p>
        <form method="post"  action="http://de.bnuz.edu.cn/stuInfoSystem/volunteerTime/sendApply" enctype="application/x-www-form-urlencoded">
          <input type="text" name="stuName" placeholder="请输入姓名(必填)">
          <input type="text" name="stuNum" placeholder="请输入学号(必填)">
          <input type="text" name="phone" placeholder="联系方式(必填)">
          <input type="number" name="score" placeholder="志愿时数(必填)">
          <input type="text" name="name" placeholder="志愿时项目名(必填)">
          <input type="text" name="detail" placeholder="补充说明(必填)">
          <p class="text-center">
            <a href="javascript:void(0);" onclick="document.getElementById('sendPhoto').click();">相关证明(一张)</a>
          </p>
          <img class="showPhoto" src="" id="showPhoto" hidden>
          <input type="file" placeholder="相关证明（一张）" onchange="setImg(this)" id="sendPhoto" hidden>
          <input type="text" name="photo" id="photo" hidden>
          <button type="submit">提交</button>
        </form>
      </div>
      <div class="fixed-bottom">
        <p>仅对 视觉传达设计（中德合作办学项目）专业学生使用</p>
        <p style="color: red;">所有申请将在<strong> 每学期末 </strong>由负责老师统一审批</p>
      </div>
      <div class="cover" style="display: none;">
        <div class="loading"></div>
        <span>上传中...</span>

      </div>
  </section>
</template>

<script>
  import { oldLecture,lecture,InvalidLecture,lectureRecord,getUser } from '../../../api/api';

  export default {
    name: 'volunteer',
    data(){
      return {
        stuNum:'',
      }
    },
    mounted () {
      getUser()
        .then(res => {
          console.log(res)
          let { status,mess,user } = res.data;
          this.stuNum = user.stuNum.replace(/a$/,'');

          console.log('status',user.stuNum)
        })
    },
    methods:{
      getinfo:function(){
          var alltimes = 0,sixiuScore='';
          if($('#schoolNum').val()){
            $.ajax({
              url:'http://de.bnuz.edu.cn/stuInfoSystem/volunteerTime/checkOne',
              type:'GET',
              data:{stuNum:Number($('#schoolNum').val())},
              cache:false,
              success: function (da) {
                if(da!=null){
                  $('.toggle').toggle('fast');
                  $('.times').remove();
                  for(var i=0;i<da.times.length;i++){
                    da.times[i].score = da.times[i].score||0;
                    alltimes += parseInt(da.times[i].score);
                    da.times[i].score = da.times[i].score ? "+"+da.times[i].score : "";
                    var p = "<p class='times'>"+da.times[i].name+da.times[i].score  +"</p>";
                    if(da.times[i].sixiuScore && da.times[i].sixiuScore!=0){
                      sixiuScore = '/'+da.times[i].sixiuScore;
                    }
                    $('#lecture').after(p);
                  }
                  $('#name').html(da.name);
                  $('#schoolNum1').html(da.schoolNum);
                  $('#major').html(da.major);
                  $('#times').html(alltimes+sixiuScore);
                  //查询申请志愿时的记录
                  getApply(Number($('#schoolNum').val()));
                }else{
                  alert('查无该学号'+ $('#schoolNum').val() +'志愿时信息！');
                }
              },
              error: function (da) {
                alert('err:'+JSON.stringify(da));
              }
            })
          }else{
            alert('学号不能为空');
          }
        }
    }
  }
</script>

<style scoped>
  ::-webkit-input-placeholder{color: #64af28;}
  :-moz-placeholder{color: #64af28;}
  :-ms-input-placeholder{color: #64af28;}
  .cover{
    height: 100%;
    overflow-y: scroll;
    width: 100%;
    background: url("http://de.bnuz.edu.cn/stuInfoSystem/image/babg.jpg")no-repeat;padding-top: 1px;
    background-size: cover;font-family: "Microsoft YaHei";}
  /*body{background: #64af28;}*/
  input{
    width: 70%;height: 2.5em;line-height: 2.5em;margin: 10px 15%;border-radius: 0;border: #3fa037;color: white;
    text-indent: 1em;background: #3fa037;transition: all .8s;font-size: 14px;
  }
  input:focus{
    width: 80%;margin: 12px 10%;border-radius: 5px;background: rgba(100,175,40,.65);
  }
  button{
    width: 70%;height: 40px;line-height: 18px;background:#fff ;border-radius: 0;text-shadow: 1px;
    margin: 10px 15%;border: solid 1px white;color: #3fa037;font-weight: bold;font-size: 18px;
  }
  ::-webkit-input-placeholder{
    color: white;
  }
  :-moz-placeholder{color: white;}
  :-ms-input-placeholder{color: white;}
  h5{text-align: center;}
  li{
    display: block;
  }
  .toptitle{
    margin: 15% auto 0 auto;position: relative;
    zoom: 1;overflow: hidden;width: 70%;
  }
  .logoimg{
    width: 50%;float: left;
  }
  .icon{text-align: center;}
  .back{
    width: 2.2em;
    height: 1em;
    background: url("http://de.bnuz.edu.cn/image/icon_up.png");
    display: inline-block;
    background-size: cover;
  }
  ul{padding: 0;}
  .title{width: 100%;font-weight: bold;
    text-align: center;color: white;}
  .info{width: 70%;margin: auto;padding: 0;color: white;font-size: 14px;}
  .times{color: #3fa037;}
  .toggle{margin-top: 5%;}
  .text-center{text-align: center;}
  .text-center a{color: white;}
  @media (max-width: 320px) {
    .title{font-size: 1em;}
  }
  .showPhoto{width: 100px;
    text-align: center;
    margin: 0 auto;
  }
  /*.cover{background-color: rgba(0,0,0,.45);position: fixed;width: 100%;height: 100%;top: 0;left: 0;z-index: 99;display: flex;*/
    /*justify-content: center;align-items: center;flex-direction: column;color: white;font-weight: bold;}*/
  /*.loading{width: 50px;height: 50px;border-radius: 50px;background-color: white;margin: 10px;animation: loading 1s infinite}*/
  @keyframes loading {
    0%{background-color: white;transform: Scale(1.2);}
    70%{background-color: #1aad19;transform: Scale(1);}
    100%{background-color: #fff;transform: Scale(1.2);}
  }
  form{margin-bottom: 100px;}
  .fixed-bottom{position: fixed;left: 0;bottom: 10px;width: 100%;text-align: center;color: #1aad19;font-size: smaller;}
</style>
