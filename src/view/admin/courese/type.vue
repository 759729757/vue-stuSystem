<template>
	<section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
		<!--列表-->
		<el-table :data="types" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">

			<!--<el-table-column type="selection" width="55"></el-table-column>-->
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="className" label="课程" width="120" sortable></el-table-column>
			<el-table-column prop="teacher" label="任课老师" width="100" sortable></el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>

		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="名称" prop="className">
          <el-input v-model="editForm.className" auto-complete="off"></el-input>
          <el-input v-model="editForm._id" auto-complete="off" readonly style="display: none;"></el-input>
				</el-form-item>
				<el-form-item label="任课老师" prop="teacher">
					<el-input v-model="editForm.teacher" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px"  ref="addForm">
				<el-form-item label="课程" prop="className">
					<el-input v-model="addForm.className" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="任课老师" prop="teacher">
					<el-input v-model="addForm.teacher" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { getCoureseType, editCoureseType,delCoureseType } from '../../../api/adminApi';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				types: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入课程', trigger: 'blur' }
					]
				},
				vipLevel:0,allRecharge:0,
				//编辑界面数据
				editForm: {
					_id: 0,
					rank:0,
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增界面数据
				addForm: {
					name: '',rank:0,
				}

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getData();
			},
			//获取用户列表
			getData() {
        getCoureseType().then((res) => {
          console.log('getCoureseType',res)
          this.types = res.data.data;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { _id: row._id };
          delCoureseType(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getData();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
              editCoureseType(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getData();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
              editCoureseType(para).then((res) => {
                console.log('editCoureseType',res)
                this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getData();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			}

		},
		mounted() {
			this.getData();
		}
	}

</script>
<style scoped>

</style>
