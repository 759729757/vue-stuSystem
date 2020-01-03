<template>
  <section>
    <div v-if="!showList">
      <h2 class="title text-center">场地和设备借用申请表</h2>
      <div >
        <div class="weui-cells weui-cells_form ">
          <input class="weui-input" name="openId" v-model="form.openId" readonly hidden>
          <input class="weui-input" name="grade" v-model="form.grade" readonly hidden>
          <input class="weui-input" name="stuNum" v-model="form.stuNum" readonly hidden>

          <div class="weui-cell weui-cells_radio">
            <div class="weui-cell__hd"><label class="weui-label">类型</label></div>
            <div class="weui-cell__hd">
              <label class="weui-cell weui-check__label f_left">
                <div class="weui-cell__bd">
                  <p @click="status=true">设备借用</p>
                </div>
                <div class="weui-cell__ft">
                  <input type="radio" class="weui-check" name="equType" v-model="form.equType" value="equipment" id="_x11" checked="checked">
                  <span class="weui-icon-checked"></span>
                </div>
              </label>
              <span>
                <label class="weui-cell weui-check__label f_left">
                    <div class="weui-cell__bd">
                        <p @click="status=false">场地借用</p>
                    </div>
                    <div class="weui-cell__ft">
                        <input type="radio" name="equType" value="site" v-model="form.equType" class="weui-check" id="_x12">
                        <span class="weui-icon-checked"></span>
                    </div>
                </label>
              </span>
            </div>
          </div>

          <div v-bind:style="{height:height}" >
            <transition name="slide-fade" >
              <equipmentPart v-if="status" class="abs " v-on:set-equip-name="setEquipName" :form="form" v-on:setHeight="setHeight"></equipmentPart>
              <sitePart v-else class="abs " :form="form" v-on:set-form-item="setFormItem" v-on:setHeight="setHeight"></sitePart>
            </transition>
          </div>

          <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">姓名</label></div>
            <div class="weui-cell__hd">
              <input class="weui-input need" name="name" v-model="form.name" >
            </div>
          </div>
          <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">专业</label></div>
            <div class="weui-cell__hd">
              <input class="weui-input need" name="major" v-model="form.major" >
            </div>
          </div>
          <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">联系方式</label></div>
            <div class="weui-cell__bd">
              <input class="weui-input need" v-model="form.phone"
                     type="tel" name="phone" pattern="[0-9]*" placeholder="请输入联系方式"/>
            </div>
          </div>

          <div>
            <ul class="updown10"  v-if="status">
              <li> · 逾期归还将影响以后借用时长</li>
              <li> · 设备借用目前仅面向中德合作办学项目师生开放</li>
            </ul>
            <ul class="updown10" v-else>
              <li>· 请勿在墙面粘贴任何物品</li>
              <li>· 请在结束后将场地清理干净、桌椅复原</li>
              <li>· 建议在活动 前2-7天 提交申请，将于所申请日期前2天回复结果</li>
            </ul>
          </div>

          <button @click="send" v-if="!recode" class=" weui-btn weui-btn_primary"  >提交申请</button>
          <div v-else class=" weui-btn_warn weui-btn">设备归还后才可再次申请</div>
        </div>
      </div>
    </div>
    <div v-if="showList">
      <Result></Result>
      <EquipmentRecordList ></EquipmentRecordList>
    </div>


    <!-- loading toast -->
    <div id="loadingToast" v-if="isLoading">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">数据加载中</p>
      </div>
    </div>
  </section>
</template>

<script>
  import $ from 'jquery';
  import EquipmentPart from '../../../components/equipmentPart';
  import SitePart from '../../../components/sitePart';
  import EquipmentRecordList from '../../../components/equRecordList';
  import Result from '../../../components/result';
  import { applyForEquipment,applyList,getUser } from '../../../api/api';

  require('../../../assets/js/date.js');
  export default {
    name: 'equipment',
    components:{
      'equipmentPart':EquipmentPart,
      'sitePart':SitePart,
      'EquipmentRecordList':EquipmentRecordList,
      'Result':Result,
    },
    data () {
      return {
        status:true,//是借用设备或是场地
        height:'',//表格高度
        recode:false,
        showList:false,isLoading:false,
      //  表单内容
        form:{
          openId:'',
          grade:'',
          stuNum:'',
          name:'',
          major:"",
          phone:'',
          equType:'equipment',
          equipName:[],
          cause:'',
          causeDetail:'',
          startTime:this.getFormatDate(),endTime:this.getFormatDate(1),
        }
      }
    },
    mounted () {
      getUser()
        .then(res => {
          console.log(res)
          let { status,mess,user } = res.data;
          this.form.openId = user.creativeOpenid;
          this.form.grade = user.grade;
          this.form.stuNum = user.stuNum;
          this.form.name = user.name;
          this.form.major = user.major;
          this.form.phone = user.phone;

          console.log(status)
        })

    },
    methods:{
      send:function(){
        for (let key in this.form){
          if( key!= 'openId' && key!= 'stuNum' && key!= 'grade' && !this.form[key]){
            alert('请填写所需资料！')
            return;
          }
        }
        this.isLoading =true;
        this.showList = true;
        applyForEquipment(this.form)
          .then( res => {
            console.log('提交成功',res);
            this.showList = true;
            this.isLoading =false;
          })
      },
      setHeight:function (height) {
        this.height = height;
      },
      setFormItem:function(item){
        //修改form表单中元素，item是数组 第一个参数是要修改的建名，第二个是建值
        this.form[item[0]] = item[1]
      },
      setEquipName:function (arr) {
        this.form.equipName = arr;
      },
      getFormatDate:function (days) {
        var b=new Date();
        if(days) b = new Date(b.getTime()+24*36*1000*days);
        var ye=b.getFullYear();
        var mo=b.getMonth()+1;
        mo = mo<10?"0"+mo:mo;
        var da=b.getDate();
        da = da<10?"0"+da:da;
        return (ye+'-'+mo+'-'+da);
      }
    },
  }
</script>

<style scoped>
  .weui-btn{margin-bottom: 50px;}
  .abs{position: absolute;width: 100%;}
  .slide-fade-enter-active {
    animation: slideIn .5s;
  }
  .slide-fade-leave-active {
    animation: slideOut .5s ;
  }
  .slide-fade-enter{
    transform: translateX(50%);
  }
  .slide-fade-leave{
    transform: translateX(-50%);
  }
  @keyframes slideIn {
    0% {
      transform: translateX(100%);
      opacity: .5;
    }
    100% {
      transform: translateX(0px);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    0% {
      transform: translateX(0px);
      opacity: 1;
    }
    100% {
      transform: translateX(-100%);
      opacity: .5;
    }
  }

  .weui-label{font-weight: 600;color: #393939;font-size: 17px;}
  .title{margin-top: 30px;font-weight: 500;}
  #_causeDetail1 {
    width: calc(100% - 5em);
    border-width: 0 0 1px 0;
    padding-left: 1em;
    border-bottom: 1px #000 solid;
    height: 1.8em;
    font-size: 14px;
  }
  .text-center {
    text-align: center;
  }

  .f_left {
    float: left;
  }

  .flextop {
    align-items: baseline;
    -webkit-align-items: baseline;
  }

  .siteType {
    display: none;
  }

  .updown10 {
    margin: 10px 0;
  }

  .Date_lr {
    width: 50%;
    text-align: center;
  }

  .span21 {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    font-size: 14px;
    color: #666;
    /*border: 1px solid #e5e5e5;*/
    /*padding:2px 8px;*/
    line-height: 20px;
    border-radius: .2rem;
    background-color: #fff;
  }

  #checkinout, #checkinout1 {
    height: 50px;
    line-height: 50px;
    position: relative;
    display: -webkit-box;
    display: flex;
  }

  #firstSelect p, #firstSelect1 p {
    line-height: 25px;
    color: #999;
    font-size: 12px;
  }

  #startDate, #startDate1 {
    border: 0;
    position: absolute;
    left: 0;
    margin: 0 auto;
    width: 50%;
    font-size: 16px;
    color: #09BB07;
    text-align: left;
  }

  #endDate, #endDate1 {
    border: 0;
    position: absolute;
    right: 0;
    margin: auto 0;
    width: 50%;
    font-size: 16px;
    color: #09BB07;
    text-align: right;
  }

  .mask_calendar {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .4);
    display: none;
    z-index: 9999;
  }

  .calendar {
    height: 400px;
    position: fixed;
    bottom: 0;
    left: 0;
  }

  .animated {
    animation-duration: 1s;
    animation-fill-mode: both;
  }

  @keyframes slideInDown {
    from {
      transform: translate3d(0, -100%, 0);
      visibility: visible;
    }

    to {
      transform: translate3d(0, 0, 0);
    }
  }

  .slideInDown {
    animation-name: slideInDown;
  }

  /*提示*/
  .mask_calendar {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .4);
    display: none;
    z-index: 9999;
  }

  .calendar {
    height: 400px;
    position: fixed;
    bottom: 0;
    left: 0;
  }

  .calendar_tishi {
    width: 150px;
    height: 30px;
    padding: 12px;
    background: rgba(0, 0, 0, .6);
    position: fixed;
    top: 0;
    bottom: 120px;
    left: 0;
    right: 0;
    margin: auto;
    color: #fff;
    font-size: 16px;
    text-align: center;
    border-radius: 4px;
    display: none;
  }

  @media (max-width: 320px) {
    .span21 {
      top: 23%;
      font-size: 12px;
    }
  }
</style>
