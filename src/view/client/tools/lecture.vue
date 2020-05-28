<template>
  <section class="cover">
    <div class="toptitle">
      <img class="logoimg" src="http://de.bnuz.edu.cn/stuInfoSystem/image/balogo.png">
      <p class="title">讲座考勤查询</p>
    </div>

    <!--<h5 style="color: white">本学期更新至03.03号讲座</h5>-->
    <div class="toggle">
      <input placeholder="学号" type="number" v-model="stuNum" id="schoolNum">
      <!--<input placeholder="身份证号" id="ID">-->
      <transition name="fade">
          <div v-if="!lectureRecords.name">
            <button type="button" @click="getinfo">查 询</button>
            <h6 style="text-align: center;color: #fff;">每场讲座考勤将在7个工作日内更新</h6>
          </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="info toggle" v-if="lectureRecords.name">
        <p class="icon" @click="lectureRecords={};invalidRecord=false;nearRecord=false">
          <img src="http://de.bnuz.edu.cn/stuInfoSystem/image/icon_up.png" class="back">
        </p>
        <ul >
          <li>
            <span><strong>姓名：</strong></span><span >{{lectureRecords.name}}</span>
          </li><li>
          <span><strong>学号：</strong></span><span >{{stuNum}}</span>
        </li><li>
          <span><strong>专业：</strong></span><span >{{lectureRecords.major}}</span>
        </li>
          <li id="timesWarp">
            <span><strong>{{ recordType }}：</strong></span><span id="times">{{ times }}</span>
          </li>

          <li v-if="old"><span><strong>就业指导次数(非打卡形式录入的)：</strong></span><span >{{old}}</span></li>

          <li>
            <span id="lecture"><strong>有效听讲记录：</strong></span>

            <p class='times' v-for="(item,index) in lectureRecords.lecture"><strong>{{index+1}}:&nbsp;&nbsp;</strong>{{item.lecture}}</p>

            <span id="detail"></span>
            <p class="text-underline text-center" @click="getNearTimes" id="readDetail">近期打卡情况</p>
            <div id="nearDetails" v-if="invalidRecord">
              <div id="invalidDetail">
                <p style="font-weight: bold;">无效记录:</p>
                <p class="invalids recordlist"  v-for="(item,index) in invalidRecord"><strong>{{index+1}}:&nbsp;&nbsp;</strong>{{item.lecture}}</p>
                <p class="invalids recordlist" v-if="!invalidRecord.length">暂无记录</p>

                <p style="color: lemonchiffon;font-size: smaller;" class="recordlist">若与上方 听讲记录 重复，则以所查 听讲记录 结果为准</p>
              </div>
              <hr>
              <table v-if="nearRecord">
                <tr><td colspan="3" style="font-weight: bold;">近期打卡记录（最近8条）:</td></tr>
                <tr class="record" id="records">
                  <td>日期</td>
                  <td>签到时间</td>
                  <td>签退时间</td>
                </tr>
                <tr class="invalids recordlist" v-if="!nearRecord.length"><td colspan="3">暂无记录</td></tr>
                <tr class="recordlist" v-for="item in nearRecord">
                  <td>{{ item.lecture }}</td>
                  <td>{{ item.signstartTime | formatTime }}</td>
                  <td>{{ item.signendTime | formatTime}}</td>
                </tr>

                <tr>
                  <td colspan="3">
                    <p style="color: lemonchiffon;font-size: smaller;">
                      未在讲座时间内签到/签退的记录可能会被按迟到早退（该场打卡无效）处理，实际结果按上方 听讲记录 为准
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          </li>
          <li>
            <!--<strong>-->
              <!--统计:<br>-->
              <!--总就业指导次数：<span id="jiuye"></span><br>-->
              <!--总国际设计与创新趋势次数：<span id="chuangxin"></span><br>-->
            <!--</strong>-->
            <p style="color: lemonchiffon;font-size: smaller;">
              计算方式：<br>
              就业指导次数:总次数<br>
              国际设计与创新趋势次数:（总次数 - 就业指导次数 - 含有【就业指导】讲座 的次数 或 有<strong>效听讲记录中</strong>不含【就业指导】讲座 的次数）
            </p>
          </li>
        </ul>
      </div>
    </transition>

    <link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/libs/weui/1.1.2/weui.css" >
    <!--BEGIN dialog2-->
    <div class="js_dialog" v-if="errMsg" >
      <div class="weui-mask"></div>
      <div class="weui-dialog">
        <div class="weui-dialog__bd">查不到学生信息 <br>请输入正确学号</div>
        <div class="weui-dialog__ft">
          <a href="javascript:void(0);" @click="errMsg=false" class="weui-dialog__btn weui-dialog__btn_primary">再试一次</a>
        </div>
      </div>
    </div>
    <!--END dialog2-->

  </section>
</template>

<script>
  import { oldLecture,lecture,InvalidLecture,lectureRecord,getUser } from '../../../api/api';

  export default {
    name: 'lecture',
    data () {
      return {
        stuNum:'',times:0,old:0,recordType:"总听讲次数",errMsg:false ,
        lectureRecords:{name:false},invalidRecord:'',nearRecord:'',
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
    filters:{
      formatTime(date){
        if(!date)return false;
        return date.substr(date.length-8,8)
      }
    },
    methods:{
      getNearTimes(){
        var stuNum = Number(this.stuNum);
        var params = {
          stuNum:stuNum
        }
        InvalidLecture(params)
          .then(res =>{
            console.log(res,'InvalidLecture');
            this.invalidRecord = res.data
          })
        lectureRecord(params)
          .then(res =>{
            console.log(res,'lectureRecord');
            this.nearRecord = res.data
          })
      },
      getinfo(){
        this.lectureRecords={};this.invalidRecord=false;this.nearRecord=false;//初始化数据

        var stuNum = Number(this.stuNum);
        console.log(stuNum,'stuNum')
        var params = {
          stuNum:stuNum
        }

          oldLecture(params)
          .then(res =>{
            console.log("old",res);
            var times =res.data.times;
            this.times = times;

            if(times)this.old=times;

            lecture(params)
              .then(res => {
                console.log(res);
                var data = res.data;
                if (!data){
                  this.errMsg=true; return false;
                }
                var times = this.times;
                this.lectureRecords = data;
                this.lectureRecords.lecture.reverse();

                if(data.major.indexOf('中德') != -1){
                  //  中德项目的学生，计算的是 国际设计与创新趋势次数
                  this.recordType = '国际设计与创新趋势次数';
                  this.old = false;
                  var time =0;
                  data.lecture.map(lec => {
                    console.log(lec.lecture,'lec');
                    if (lec.lecture.indexOf('就业指导') == -1){
                      time++;
                    }
                    this.times = time;
                  })
                }else{
                  this.recordType = '总就业指导次数'
                  console.log('就业指导')
                  times = times + data.lecture.length;
                  this.times = times;
                }

              })
          })
      }

    },
  }
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  ::-webkit-input-placeholder{color: #64af28;}
  :-moz-placeholder{color: #64af28;}
  :-ms-input-placeholder{color: #64af28;}
  .cover{
    height: 100%;overflow-y: scroll;
    width: 100%;
    background: url("http://de.bnuz.edu.cn/stuInfoSystem/image/babg.jpg")no-repeat;padding-top: 1px;
    background-size: cover;font-family: "Microsoft YaHei";}
  /*body{background: #64af28;}*/
  body{padding-bottom: 50px;}
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
    background: url("http://de.bnuz.edu.cn/stuInfoSystem/image/icon_up.png");
    display: inline-block;
    background-size: cover;
  }
  ul{padding: 0;}
  .title{width: 50%;position:absolute;right: 0;bottom: 0;margin: 0;font-size:1.1em;font-weight: bold;
    text-align: right;color: white;}
  .times{color: #3fa037;}
  .toggle{margin-top: 25%;}
  .info{width: 70%;margin: auto;padding: 0;color: white;font-size: 14px;margin-bottom: 60px;margin-top: 10px;}
  .text-underline{text-decoration: underline;color: white;}
  .text-center{text-align: center;}
  .record{color: #fff;font-weight: bold;}
  .invalids{color: orange;}
  @media (max-width: 320px) {
    .title{font-size: 1em;}
  }
</style>
