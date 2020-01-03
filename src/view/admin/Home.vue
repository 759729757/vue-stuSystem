<template>
  <el-container style="height: 100% ; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: #545c64;">

      <el-menu :default-active="$route.path"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b"
               @open="handleOpen"
               @close="handleClose" @select="handleselect"
      >

        <el-submenu  v-for="(item,index) in $router.options.routes" :key="item.path" :index="item.path" v-if="item.type == '管理端'">
          <template slot="title"><i :class="item.icon"></i> <strong style="color: #a0cfff">{{ item.name }}</strong></template>
            <el-menu-item v-for="subitem in item.children" :index="item.path+'/'+subitem.path" :key="subitem.path">
              <!--<router-link :to="item.path+subitem.path">-->
                {{ subitem.name }}
              <!--</router-link>-->
            </el-menu-item>
        </el-submenu>

      </el-menu>
    </el-aside>

    <el-container>
      <el-header style=" font-size: 12px">
        <el-link class="title">{{$route.name}}</el-link>
        <div style="float:right;display: inline-block;">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>查看</el-dropdown-item>
              <el-dropdown-item>新增</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>管理员</span>
        </div>

      </el-header>

      <el-main>
        <transition name="fade" mode="out-in">
        <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
	export default {
		data() {
			return {
				sysName:'学生信息系统',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
      handleOpen() {
				console.log('handleopen');
			},
			handleClose() {
				//console.log('handleclose');
			},
			handleselect: function (url) {
			  console.log(url)
        this.$router.push({
          path:url
        })
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {

				});


			},
		},
		mounted() {
      var user = sessionStorage.getItem('user');
			// if (user) {
			// 	user = JSON.parse(user);
			// 	this.sysUserName = user.name || '';
			// 	this.sysUserAvatar = user.avatar || '';
			// }

		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';
  .title{
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
    font-weight: 400;
    color: #1f2f3d;font-size: 22px;margin-bottom: 20px;
  }
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    .header {
      height: 60px;
      line-height: 60px;
      background: $color-primary;
      color:#fff;
      .userinfo {
        text-align: right;
        padding-right: 35px;
        float: right;
        .userinfo-inner {
          cursor: pointer;
          color:#fff;
          img {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            margin: 10px 0px 10px 10px;
            float: right;
          }
        }
      }
      .logo {
        //width:230px;
        height:60px;
        font-size: 22px;
        padding-left:20px;
        padding-right:20px;
        border-color: rgba(238,241,146,0.3);
        border-right-width: 1px;
        border-right-style: solid;
        img {
          width: 40px;
          float: left;
          margin: 10px 10px 10px 18px;
        }
        .txt {
          color:#fff;
        }
      }
      .logo-width{
        width:230px;
      }
      .logo-collapse-width{
        width:60px
      }
      .tools{
        padding: 0px 23px;
        width:14px;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
      }
    }
    .main {
      display: flex;
      // background: #324057;
      position: absolute;
      top: 60px;
      bottom: 0px;
      overflow: hidden;
      aside {
        flex:0 0 230px;
        width: 230px;
        // position: absolute;
        // top: 0px;
        // bottom: 0px;
        .el-menu{
          height: 100%;
        }
        .collapsed{
          width:60px;
          .item{
            position: relative;
          }
          .submenu{
            position:absolute;
            top:0px;
            left:60px;
            z-index:99999;
            height:auto;
            display:none;
          }

        }
      }
      .menu-collapsed{
        flex:0 0 60px;
        width: 60px;
      }
      .menu-expanded{
        flex:0 0 230px;
        width: 230px;
      }
      .content-container {
        // background: #f1f2f7;
        flex:1;
        // position: absolute;
        // right: 0px;
        // top: 0px;
        // bottom: 0px;
        // left: 230px;
        overflow-y: scroll;
        padding: 20px;
        .breadcrumb-container {
          //margin-bottom: 15px;
          .title {
            width: 200px;
            float: left;
            color: #475669;
          }
          .breadcrumb-inner {
            float: right;
          }
        }
        .content-wrapper {
          background-color: #fff;
          box-sizing: border-box;
        }
      }
    }
  }

  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

</style>
