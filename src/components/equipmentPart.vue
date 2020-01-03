<template>
  <section ref="formPart">
    <div class="weui-cell weui-cells_radio flextop">
      <div class="weui-cell" style="padding: 0;"></div>
      <div class="weui-cell__hd"><label class="weui-label">设备名称</label></div>
      <div class="weui-cell__hd">
        <label class="weui-cell weui-check__label " for="x12">
          <div class="weui-cell__bd">
            <p>佳能760D相机</p>
          </div>
          <div class="weui-cell__ft">
            <input type="checkbox" class="weui-check" value="佳能760D相机" v-model="form.equipName" name="equipName" checked="checked" id="x12">
            <span class="weui-icon-checked"></span>
          </div>
        </label>
        <label class="weui-cell weui-check__label " for="__x12">
          <div class="weui-cell__bd">
            <p>佳能800D相机</p>
          </div>
          <div class="weui-cell__ft">
            <input type="checkbox" class="weui-check" value="佳能800D相机" v-model="form.equipName" name="equipName" id="__x12">
            <span class="weui-icon-checked"></span>
          </div>
        </label>
        <label class="weui-cell weui-check__label " for="x13">.
          <div class="weui-cell__bd">
            <p>三脚架</p>
          </div>
          <div class="weui-cell__ft">
            <input type="checkbox" name="equipName" value="三脚架" v-model="form.equipName" class="weui-check" id="x13">
            <span class="weui-icon-checked"></span>
          </div>
        </label>
        <label class="weui-cell weui-check__label " for="_x15">
          <div class="weui-cell__bd" style="width: 2em;display: inline-table;">
            <p for="x15">其他</p>
          </div>
          <div class="weui-cell__ft">
            <input type="checkbox"  :checked="hasOthers"  class="weui-check" id="_x15">
            <span class="weui-icon-checked"></span>
          </div>
          <input type="text" name="equipName" v-model="otherEquip" id="_causeDetail1" placeholder="请输入设备名称">
        </label>
      </div>
    </div>
    <div class="weui-cell weui-cells_radio flextop">
      <div class="weui-cell__hd"><label class="weui-label">设备用途</label></div>
      <div class="weui-cell__hd">
        <label class="weui-cell weui-check__label " for="x16">
          <div class="weui-cell__bd">
            <p>摄影课程</p>
          </div>
          <div class="weui-cell__ft">
            <input type="radio" class="weui-check" value="摄影课程" v-model="form.cause" name="cause" id="x16">
            <span class="weui-icon-checked"></span>
          </div>
        </label>
        <label class="weui-cell weui-check__label " for="__x15">

          <div class="weui-cell__bd">
            <p for="x15">其他作业、项目</p>
          </div>
          <div class="weui-cell__ft">
            <input type="radio" name="cause" value="其他" v-model="form.cause" class="weui-check" id="__x15">
            <span class="weui-icon-checked"></span>
          </div>
        </label>
      </div>
    </div>
    <div class="weui-cell">
      <div class="weui-cell__hd"><label class="weui-label">详细原因</label></div>
      <div class="weui-cell__bd">
        <input class="weui-input need" name="causeDetail" v-model="form.causeDetail" type="text" placeholder="相关 老师 或 用途"/>
      </div>
    </div>
    <div id="equipment" class="equipmentType">
      <div class="weui-cell" style="padding: 0;"></div>
      <div class="weui-cell">
        <div class="weui-cell__hd"><label class="weui-label">借用时段</label></div>
        <div class="weui-cell__bd">
          <div id="checkinout1">
            <div id="firstSelect1" style="width:100%;">
              <div class="Date_lr" style="float:left;">
                <P>开始</p>
                <input id="startDate1" name="startTime" v-model="form.startTime" type="text" style="" readonly>
              </div>
              <div class="Date_lr" style="float:right;">
                <p>结束</p>
                <input id="endDate1" name="endTime" v-model="form.endTime" type="text"  style="" readonly>
              </div>
              <span class="span21">共<span class="NumDate" id="NumDate1">1</span>天</span>
            </div>
          </div>
          <div class="mask_calendar" id="mask_calendar1">
            <div class="calendar" id="calendar1"></div>
            <!-- 提示 -->
            <div class="calendar_tishi">请选择结束时间...</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import $ from 'jquery';
  require('../assets/js/date.js');
  export default {
    name: 'equipmentPart',
    props:['form'],
    data () {
      return {
        otherEquip:'',hasOthers:'',otherEquipIndex:-1,
      }
    },
    watch:{
      form(val){
        console.log(val,form)
      },


      //处理输入 其他 选项
      otherEquip(val){
        let checkboxs = $('input[name="equipName"]:checked');
        let equipNameArr = checkboxs.map((index,item) => {
          return ($(item).val());
        })
        let _equipNameArr = [];
        for (let i=0;i<equipNameArr.length;i++){
          _equipNameArr.push(equipNameArr[i])
        }
        if(val)_equipNameArr.push(val);
        this.$emit('set-equip-name',_equipNameArr);
        this.hasOthers = val ? 'hasOthers' : '';
      },
    },
    mounted () {
      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been rendered
        setTimeout(()=> {
          //解决组件渲染时获取的高度不准确bug （待渲染完成后再设置高度）
          var height = this.$refs.formPart.clientHeight;
          this.$emit('setHeight',height+'px');
        },10)

      })


      $('#firstSelect1').on('click',function (e) {
        e.stopPropagation();
        e.preventDefault();
        $('#mask_calendar1').show();
      });
      $('#mask_calendar1').on('click',function (e) {
        e.stopPropagation();
        e.preventDefault();
        if(e.target.className == "mask_calendar"){
          $('#calendar1').slideUp(200);
          $('#mask_calendar1').fadeOut(200);
        }
      });
      var self = this;
      $('#firstSelect1').calendarSwitch({
        selectors : {
          sections : "#calendar1",
          //firstSelect
          firstSelect:"#firstSelect1",
          //mask_calendar
          mask_calendar:"#mask_calendar1",
          //calendar1
          calendar:"#calendar1",
          //startDate
          startDate:"#startDate1",
          //endDate1
          endDate:"#endDate1",
          //NumDate1
          NumDate:"#NumDate1"
        },
        index : 4,      //展示的月份个数
        animateFunction : "slideToggle",        //动画效果
        controlDay:true,//知否控制在daysnumber天之内，这个数值的设置前提是总显示天数大于90天
        daysnumber : "90",     //控制天数
        comeColor : "#09BB07",       //入住颜色
        outColor : "#09BB07",      //离店颜色
        comeoutColor : "#E0F4F2",        //入住和离店之间的颜色
        callback :function(){//回调函数
          $('#mask_calendar1').fadeOut(200);
          var startDate = $('#startDate1').val();  //入住的天数
          var endDate = $('#endDate1').val();      //离店的天数
          var NumDate = $('#NumDate1').text();    //共多少晚
          self.form.startTime = startDate;
          self.form.endTime = endDate;
          console.log(startDate);
          console.log(endDate);
          console.log(NumDate);
          //下面做ajax请求
        },
        comfireBtn:'#comfire1'//确定按钮的class或者id
      });

    }
  }
</script>

<style scoped>
  .title{margin-top: 30px;font-weight: 500;}
  .weui-label{font-weight: 600;color: #393939;font-size: 17px;}
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
