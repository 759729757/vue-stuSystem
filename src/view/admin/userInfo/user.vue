<template>
	<section >
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filter">
				<el-form-item>
					<el-input v-model="filter.name" placeholder="姓名"></el-input>
				</el-form-item>
        <el-form-item>
          <el-input v-model="filter.stuNum" placeholder="学号"></el-input>
        </el-form-item>
        <el-form-item>
          <!--<el-input v-model="filter.grade" placeholder="年级"></el-input>-->
          <el-autocomplete
            class="inline-input"
            v-model="filter.grade"
            :fetch-suggestions="queryGrade"
            placeholder="年级"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-autocomplete
            class="inline-input"
            v-model="filter.major"
            :fetch-suggestions="queryMajor"
            placeholder="专业"
          ></el-autocomplete>

          <!--<el-input v-model="filter.major" placeholder="专业"></el-input>-->
        </el-form-item>
        <el-select v-model="filter.isBind" placeholder="绑定微信">
          <el-option value="" label="绑定微信"></el-option>
          <el-option value="1" label="已绑定"></el-option>
          <el-option value="-1" label="未绑定"></el-option>
        </el-select>
        <el-form-item>
					<el-button type="primary" v-on:click="getUser">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="users" highlight-current-row v-loading="loading" height="80vh" stripe>
				<el-table-column type="index" width="60">				</el-table-column>

				<el-table-column prop="name" label="姓名" width="150" sortable>			</el-table-column>

				<el-table-column prop="stuNum" label="学号" width="150"  sortable>				</el-table-column>

				<el-table-column prop="grade" label="年级" width="100" sortable>				</el-table-column>

        <el-table-column prop="major" label="专业" width="250" sortable>        </el-table-column>

        <el-table-column prop="phone" label="手机号" width="150" sortable>        </el-table-column>

        <el-table-column prop="creativeOpenid|isBind" label="绑定微信" width="100" sortable>
          <template slot-scope="scope">
            <el-link
              :type="scope.row.creativeOpenid ? 'success' : 'info' " :underline="false" disable-transitions>
              {{ scope.row.creativeOpenid | binding }}</el-link>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="info" v-on:click="edit(scope.row)" plain>查看</el-button>
          </template>
        </el-table-column>


			</el-table>
		</template>

<!--分页-->
    <el-pagination
      :current-page.sync="filter.page"
      :page-size="20" @current-change="pageChange"
      layout="total, prev, pager, next"
      :total="count">
    </el-pagination>


    <el-dialog title="个人详情" :visible.sync="dialogFormVisible" center>
        <stuInfo :form="editForm" @closeDialog="closeDialog" @reload="getUser"></stuInfo>
    </el-dialog>

	</section>
</template>
<script>
  import { getOneUser } from '../../../../src/api/adminApi.js';
  import stuInfo from '../../../../src/components/admin_stuInfo'

  //import NProgress from 'nprogress'
	export default {
		data() {
			return {
        filter: {
					name: '',page:0,
				},
				loading: false,dialogFormVisible:false,
				users: [],count:0,
        restaurantsMajor:[{value:'中德合作办学项目'}],//专业内容提示
        restaurantsGrade:[{value:'2016'},{value:'2017'},{value:'2018'},{value:'2019'}],//专业内容提示
        editForm:{}
			}
		},
    components:{
      stuInfo:stuInfo
    },
		methods: {
      queryMajor(queryString, cb) {
        // 调用 callback 返回建议列表的数据
        cb(this.restaurantsMajor);
      },
      queryGrade(queryString, cb) {
        // 调用 callback 返回建议列表的数据
        cb(this.restaurantsGrade);
      },
      closeDialog:function(){
        this.dialogFormVisible = false;
      },
		  edit:function(data){
		    this.editForm = data;
		    this.dialogFormVisible = true;
      },
      pageChange:function(){
        console.log(this.page);
        this.getUser();
      },
			//获取用户列表
			getUser: function () {
        this.loading = true;
        getOneUser(this.filter).then((res)=>{
          console.log(res)
          this.loading = false;
          this.count = res.data.count;
          this.users = res.data.users;
				})
			},

		},
    filters:{
      binding:function (val) {
        return val ? '已绑定' : '未绑定'
      }
    },
		mounted() {
			this.getUser();
			// this.testlogin();
		}
	};

</script>

<style scoped>

</style>
