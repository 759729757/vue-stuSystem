<template>
  <div>
    <el-table
      :data="lectureArr"
      style="width: 100%">
      <el-table-column
        prop="lecture"
        label="讲座名称"
        width="550">
      </el-table-column>
      <el-table-column
        prop="stu.length"
        label="打卡人数" align="center"
        width="180">
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-link type="primary"  v-on:click="edit(scope.row)" >编辑</el-link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-link type="danger"  v-on:click="del(scope.row)" >删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="表格格式案例" :visible.sync="dialogHini" center>
      <el-link style="color: #F56C6C;" :underline="false"><i class="el-icon-warning"></i> 必须是xls或者xlsx格式（不是该格式可用excel打开后另存为该格式）</el-link>
      <br>
      <el-link style="color: #F56C6C;" :underline="false"><i class="el-icon-warning"></i> 表格必需拥有表头，表头一般以该列内容名称命名</el-link>
      <br>
      <el-link style="color: #F56C6C;" :underline="false"><i class="el-icon-warning"></i> 表头必须在表第一行，否则会导致表格内容识别出错</el-link>
      <br><strong>如下图：</strong><br>
      <img src="../../../assets/images/excel-right.png" alt="" width="400">
      <img src="../../../assets/images/excel-wrong.png" alt="" width="400">
    </el-dialog>

    <el-dialog title="编辑讲座考勤" :visible.sync="dialogFormVisible" center>
      <el-form :model="lecture">
        <el-form-item label="讲座名称" prop="lecture">
          <el-input v-model="lecture.lecture"></el-input>
        </el-form-item>
        <transition name="fade" mode="out-in">
          <div  v-show="!ExcelDataTitle.length">
            <div class="el-upload__tip" >
              导入文件数据<strong style="color: firebrick;"> 只能导入 xls 或者 xlsx 格式文件</strong>
              <el-link type="primary" @click="dialogHini=true">点击查看表格格式要求</el-link>
            </div>
            <el-upload
              class="upload-demo"
              drag
              ref="upload"
              accept=".xls,.xlsx"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="uploadExcel"
              :show-file-list="false"
              :auto-upload="false"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </div>
        </transition>

        <transition name="fade" mode="out-in">
          <div v-show="ExcelDataTitle.length">
            <div class="el-upload__tip" >请选择学号对应字段</div>
            <el-select v-model="ExcelDataChoose" placeholder="请选择学号字段">
              <el-option
                v-for="item in ExcelDataTitle"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-button @click="ExcelDataTitle=[]">重新选择文件</el-button>
          </div>
        </transition>

        <div class="el-upload__tip" >输入学号，多个学号请用<strong style="color: firebrick;"> 英文状态</strong>下的逗号“ , ”分开</div>
        <el-input
          type="textarea"
          :rows="4" style="resize: none;"
          placeholder="请输入学号"
          v-model="textNumber">
        </el-input>

        <el-button type="primary" style="margin-top: 20px;" @click="uploadData">上传</el-button>

      </el-form>

    </el-dialog>

    <!--分页-->
    <el-pagination
      :current-page.sync="filter.page"
      :page-size="15" @current-change="fetch"
      layout="total, prev, pager, next"
      :total="amount">
    </el-pagination>
  </div>
</template>

<script>
  import { getLectureRecord,addLectureRecord,delLectureRecord } from '../../../api/adminApi'
  import XLSX from 'xlsx'

  export default {
    name: 'editLectureRecord',
    data(){
      return{
        dialogFormVisible:false,
        dialogHini:false,
        filter:{page:1},
        lecture:{},
        amount:0,
        lectureArr:[],

        sendData:[],//存放要上传的学号字段

        ExcelData:[],
        ExcelDataTitle:[],ExcelDataChoose:'',//上传表格的字段信息

        textNumber:'',// textarea 内容

      }
    },
    methods:{
      del(item){
        this.$confirm(`是否删除该场讲座记录： ${item.lecture} ？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delLectureRecord({id:item._id}).then(res=>{
            if(res.data.status ===1){
              this.$message.success('删除成功!');
              this.fetch();
            }
          })
        })

      },
      uploadData(){
        let _numberArr = this.textNumber.replace(/\s/,'');
        var _arr = _numberArr.split(',');
        let textareaArr = [],data=[];
        for(var i=0;i<_arr.length;i++){
          if(parseInt(_arr[i].replace(/a/,'')) && typeof parseInt(_arr[i].replace(/a/,'')) == "number"){
            textareaArr.push(_arr[i].replace(/a/,''));
          }
        }
        data = data.concat(textareaArr,this.sendData);//合并表格和文字区域的内容
        console.log(data)
        let lecture = this.lecture;
        addLectureRecord({id:lecture._id,stuNum:data,lecture:lecture.lecture}).then( res=>{
          if(res.status ===1){
            this.$message.success('操作成功！');
            this.dialogFormVisible=false;
            this.ExcelDataTitle=[];
            this.fetch();
          }
        })

      },
      uploadExcel(file,fileList){
        let files = {0:file.raw}
        this.readExcel1(files);
      },
      edit:function(item){
        this.lecture = item;
        this.dialogFormVisible = true;
      },
      fetch:function () {
        getLectureRecord(this.filter).then(res=>{
          console.log('getLectureRecord',res)
          this.amount = res.data.amount;
          this.lectureArr = res.data.lecture
        })
      },
      readExcel1:function(files) {//表格导入
        var that = this;
        console.log(files);
        if(files.length<=0){//如果没有文件名
          return false;
        }else if(!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())){
          this.$Message.error('上传格式不正确，请上传xls或者xlsx格式');
          return false;
        }

        const fileReader = new FileReader();
        fileReader.onload = (ev) => {
          try {
            const data = ev.target.result;
            const workbook = XLSX.read(data, {
              type: 'binary'
            });
            const wsname = workbook.SheetNames[0];//取第一张表
            const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
            console.log('表格内容',ws);

            that.ExcelData = ws;
            that.ExcelDataTitle = [];//初始化
            for(var _key in ws[2]) {
              that.ExcelDataTitle.push(_key)
            }
            //重写数据
            try{

            }catch(err){
              console.log(err)
            }

            this.$refs.upload.value = '';

          } catch (e) {

            return false;
          }
        };
        fileReader.readAsBinaryString(files[0]);
      }
    },
    watch:{
      ExcelDataChoose:function (val) {
        console.log(`选择了${val}`);
        let Data = this.ExcelData;
        this.sendData=[];
        for(let i=0;i < Data.length;i++){
          this.sendData.push(Data[i][val]);
        }
        console.log(this.sendData);

      }
    },
    mounted () {
      this.fetch()
    }
  }
</script>

<style scoped>

</style>
